from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

def store_requirements(requirements_list, source_name, project_id, user_id, table_data=None):
    if not isinstance(requirements_list, list) or not all(isinstance(item, dict) for item in requirements_list):
        raise ValueError(
            f"store_requirements needs List[Dict], "
            f"got elements types: {set(type(i).__name__ for i in requirements_list)}"
        )
    print(f"Structured requirements count: {len(requirements_list)}")

    try:
        # Load Mongo URI from environment
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            raise EnvironmentError("MONGO_URI not found in environment variables")

        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        db = client["Barclays"]

        doc = {
            "projectId": ObjectId(project_id),
            "userId": ObjectId(user_id),
            "requirements": requirements_list,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }

        # if table_data:
        #     doc["tables"] = table_data

        db.requirements.insert_one(doc)
        print(f"✅ Stored {len(requirements_list)} structured requirement(s) for project {project_id}")
        return True

    except Exception as e:
        print(f"❌ Database Error: {e}")
        return False

    finally:
        client.close()
