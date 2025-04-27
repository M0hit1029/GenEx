from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

def store_requirements(requirements_list, source_name, project_id, user_id, table_data=None):
    if not isinstance(requirements_list, list) or not all(isinstance(item, dict) for item in requirements_list):
        raise ValueError(
            f"store_requirements needs List[Dict], "
            f"got elements types: {set(type(i).__name__ for i in requirements_list)}"
        )
    print(f"Structured requirements count: {len(requirements_list)}")

    try:
        client = MongoClient("mongodb+srv://lalalala27122:sFlkBEUKqzJm80n1@cluster0.0yelt.mongodb.net/", serverSelectionTimeoutMS=5000)
        db = client["Barclays"]

        doc = {
            "projectId": ObjectId(project_id),  # Make sure you're passing this as a string that can be cast to ObjectId
            "userId": ObjectId(user_id),
            "requirements": requirements_list,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # if table_data:
        #     doc["tables"] = table_data  # Optional: store extra extracted tables if needed

        db.requirements.insert_one(doc)
        print(f"✅ Stored {len(requirements_list)} structured requirement(s) for project {project_id}")
        return True

    except Exception as e:
        print(f"❌ Database Error: {e}")
        return False

    finally:
        client.close()