import requests
import json
import re
import ast

def get_op_from_prompt(api_key, text_chunks, previous_requirements=None, prompt=None):
    req = previous_requirements or []

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    # Base template for handling the user prompt (escaping special characters for frontend display)
    base_prompt = f"""YOUR TASK:
From the text below, perform the task as per the user's request. The task can include requirement extraction, data analysis, or summarization as instructed by the user.

RULES:
- Ensure that you follow the exact instructions provided by the user in the prompt.
- If a specific task like requirement extraction or summarization is needed, apply the appropriate methods as per the instruction.
- Only return the final result after processing the text.
- Return only what is needed and avoid unnecessary details or explanations.
- If any clarification is required, ask the user for more information.

USER INSTRUCTION:
{prompt}

TEXT TO BE PROCESSED:
{{text}}

PROVIDE THE FINAL OUTPUT BASED ON THE ABOVE INSTRUCTION.
"""

    # Escape any special characters for frontend display
    frontend_prompt = json.dumps(base_prompt).replace('\n', '<br>').replace(' ', '&nbsp;')
    
    # The 'frontend_prompt' can be safely displayed in HTML
    print(f"Frontend Prompt to display:\n{frontend_prompt}")

    all_requirements = previous_requirements or []
    seen_set = set(json.dumps(r, sort_keys=True) for r in all_requirements)

    # Process each chunk of text separately
    for i, chunk in enumerate(text_chunks, 1):
        try:
            # Format the chunk with the user prompt
            formatted_prompt = base_prompt.replace("{text}", chunk)

            # Send the request to the LLM API
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": "nvidia/llama-3.3-nemotron-super-49b-v1:free",
                    "messages": [{"role": "user", "content": formatted_prompt}],
                    "temperature": 0.0
                },
                timeout=30
            )

            response.raise_for_status()

            # Process the model response
            raw_output = response.json()["choices"][0]["message"]["content"].strip()

            # Clean up the response by removing markdown or any extra characters
            raw_output = re.sub(r"```(json)?", "", raw_output).strip("`\n ")

            # If result is a quoted string, unescape and decode it
            if raw_output.startswith('"') and raw_output.endswith('"'):
                raw_output = raw_output[1:-1]
                raw_output = raw_output.encode().decode('unicode_escape')

            # Try parsing the output to extract requirements or other structured data
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
    return all_requirements, frontend_prompt
