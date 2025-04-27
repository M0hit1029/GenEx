import ast
import json
import requests
import re

def get_exact_requirements(api_key, text_chunks, previous_requirements=None):
    format_example = '[{"feature": "Requirement name in short","description":"Actual Requirement", "priority": can be from 1 to 5 assign it according to you by seeing other requirements, "type":"F for Functional and NF for Non-Functional", "moscow":"Assign MoSCoW priority like M,S,C,W by seeing other requirements","question":"If any question needs to be asked to user for clarification of requirement otherwise keep it empty"}]'
    req = previous_requirements or []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    base_prompt = f"""YOUR TASK:
From the text below, extract ONLY the actual software or system requirements.

RULES:
- Extract all stated requirements, including those in tables, bullet points, or paragraphs.
- DO NOT skip requirements that are duplicated in different formats. Include all while extracting requirements.
- YOU CAN summarize, infer, or add extra information but DON'T do it such that meaning will change.
- IF YOU HAVE ANY DOUBT ABOUT THE REQUIREMENT OR ABOUT A STATEMENT WHICH CAN BE A REQUIREMENT, PLEASE ASK A QUESTION IN FORMATTED WAY mention below
- Return only the actual software or system requirements.
- FORMAT STRICTLY: Output must be a valid Python list of dictionaries. Do not add explanations, markdown, or any extra text.
- Return format: {format_example}
- If no valid requirements are found, return an empty list: []

PREVIOUSLY EXTRACTED REQUIREMENTS: {req}

INPUT TEXT:
{{text}}

RETURN ALL THE UNIQUE REQUIREMENTS EXTRACTED in FORMAT provided above.:
"""

    all_requirements = previous_requirements or []
    seen_set = set(json.dumps(r, sort_keys=True) for r in all_requirements)

    for i, chunk in enumerate(text_chunks, 1):
        try:
            prompt = base_prompt.replace("{text}", chunk)

            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": "nvidia/llama-3.3-nemotron-super-49b-v1:free",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.0
                },
                timeout=30
            )
            response.raise_for_status()
            raw_output = response.json()["choices"][0]["message"]["content"].strip()
            # Remove markdown formatting like ```json ... ```
            raw_output = re.sub(r"```(json)?", "", raw_output).strip("`\n ")

            # If result is quoted string, unescape and decode it
            if raw_output.startswith('"') and raw_output.endswith('"'):
                raw_output = raw_output[1:-1]
                raw_output = raw_output.encode().decode('unicode_escape')

            try:
                parsed = ast.literal_eval(raw_output)
                if isinstance(parsed, list):
                    for req in parsed:
                        serialized = json.dumps(req, sort_keys=True)
                        if serialized not in seen_set:
                            seen_set.add(serialized)
                            all_requirements.append(req)
            except Exception as parse_err:
                print(f"[Parsing Error: chunk {i}] {parse_err}")
                print("Raw output:\n", raw_output)

        except Exception as e:
            print(f"[Model Error: chunk {i}] {e}")
    print(f"✅ Total unique requirements extracted: {len(all_requirements)}")
    return all_requirements