from flask import Flask, request, jsonify
import os
import json
from flask_cors import CORS

# service that mocks a DB service by using JSON files in the frontend's public file

app = Flask(__name__)
CORS(app)

# Directory where the file will be saved
SAVE_DIR_TEST = os.path.abspath(
    os.path.join(os.getcwd(), "../frontend/public/workflowsTEST.json")
)
READ_DIR = os.path.abspath(
    os.path.join(os.getcwd(), "../frontend/public/workflows.json")
)
DIR_KEYS = os.path.abspath(os.path.join(os.getcwd(), "../frontend/public/keys.json"))
SAVE_DIR = READ_DIR


# updates a singular workflow
@app.route("/update-workflow", methods=["POST"])
def update_workflow():
    try:
        json_data = request.get_json()

        print("Received JSON data:", json_data)

        with open(READ_DIR, "r") as file:
            workflows = json.load(file)

        found = False

        for i in range(len(workflows)):
            w = workflows[i]
            if w["id"] == json_data["id"] and w["name"] == json_data["name"]:
                workflows[i] = json_data
                found = True
        if found:
            with open(SAVE_DIR, "w") as file:
                json.dump(workflows, file)

            return (
                jsonify(
                    {"message": "File updated successfully!", "file_path": SAVE_DIR}
                ),
                200,
            )
        return (
            jsonify({"message": "File upload failed!", "file_path": SAVE_DIR}),
            400,
        )

    except KeyError:
        return jsonify({"error": "No file part in the request"}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# adds a singular workflow to workflows
@app.route("/add-workflow", methods=["POST"])
def add_workflow():
    try:
        json_data = request.get_json()

        with open(READ_DIR, "r") as file:
            workflows = json.load(file)

        print("Received JSON data:", json_data)
        workflows.append(json_data)

        with open(SAVE_DIR, "w") as file:
            json.dump(workflows, file)

        return (
            jsonify({"message": "File updated successfully!", "file_path": SAVE_DIR}),
            200,
        )

    except KeyError:
        return jsonify({"error": "No file part in the request"}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


# adds a singular workflow to workflows
@app.route("/update_keys", methods=["POST"])
def add_workflow():
    try:
        json_data = request.get_json()

        print("Received JSON data:", json_data)

        with open(DIR_KEYS, "w") as file:
            json.dump(json_data, file)

        return (
            jsonify({"message": "File updated successfully!", "file_path": SAVE_DIR}),
            200,
        )

    except KeyError:
        return jsonify({"error": "No file part in the request"}), 400

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
