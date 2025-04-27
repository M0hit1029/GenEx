from pymongo import MongoClient
from bson import ObjectId

def get_previous_requirements(project_id):
    try:
        # Establish connection to MongoDB
        client = MongoClient("mongodb+srv://lalalala27122:sFlkBEUKqzJm80n1@cluster0.0yelt.mongodb.net/", serverSelectionTimeoutMS=5000)
        db = client["Barclays"]

        # Query the database for the requirements of a given project_id
        project = db.requirements.find_one({"projectId": ObjectId(project_id)})

        # If project found, return its requirements
        if project:
            print(f"✅ Found {len(project['requirements'])} requirements for project {project_id}")
            return project["requirements"]
        else:
            print(f"❌ No requirements found for project {project_id}")
            return None

    except Exception as e:
        print(f"❌ Database Error: {e}")
        return None

    finally:
        client.close()
