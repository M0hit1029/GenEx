import requests

def generate_plantuml(api_key, user_stories, roles):
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    base_prompt = f"""
    YOUR TASK:
    Generate a PlantUML code based on the following user stories and roles.

    ROLES: {roles}
    USER STORIES: {user_stories}

    Based on this input, generate the corresponding PlantUML code for a UML diagram. 

    RETURN THE PLANTUML CODE:
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        json={
            "model": "nvidia/llama-3.3-nemotron-super-49b-v1:free",
            "messages": [{"role": "user", "content": base_prompt}],
            "temperature": 0.0
        },
        timeout=30
    )

    if response.status_code == 200:
        raw_output = response.json()["choices"][0]["message"]["content"].strip()
        return raw_output
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return None

# Example of how to use it:
user_stories = [
    {"role": "Admin", "user_story": "As an Admin, I want to manage users."},
    {"role": "User", "user_story": "As a User, I want to view my profile."}
]
roles = ["Admin", "User"]

api_key = "your_api_key_here"
plantuml_code = generate_plantuml(api_key, user_stories, roles)

if plantuml_code:
    print("Generated PlantUML Code:")
    print(plantuml_code)
