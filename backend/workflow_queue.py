from celery import Celery

app = Celery(
    "workflow_queue",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)


def send_an_email(task_params):
    print(
        "I have sent an email with payload:  ",
        task_params,
    )
    return True


def post_to_social_media(task_params):
    print("I have posted ", task_params, " to social media")
    return True


def mapTaskToFunction(task_name, task_params):
    if task_name == "Post to Social Media":
        post_to_social_media(task_params)
    elif task_name == "Send an Email":
        send_an_email(task_params)
    # ...


# Define a task
@app.task
def process_task(task_name, task_params, task_req, api_key=None):
    print(f"Processing Task: {task_name}")
    if task_req and api_key == None:
        return "Failure"
    res = mapTaskToFunction(task_name, task_params, api_key)
    if res:
        return f"Task {task_name} completed "
    else:
        return "Failure"


if __name__ == "__main__":

    workflows = [
        {
            "id": 0,
            "name": "Email Notification",
            "trigger": "New Sign Up",
            "tasks": [
                {
                    "name": "Send Welcome Email",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
                {
                    "name": "Add to Mailing List",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
                {
                    "name": "Notify Sales Team",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
                {
                    "name": "Post to Social Media",
                    "params": {},
                    "provider": "Meta",
                    "needsKey": False,
                },
            ],
        },
        {
            "id": 1,
            "name": "Invoice Processing",
            "trigger": "Invoice Received",
            "tasks": [
                {"name": "Extract Data", "needsKey": False, "provider": "NotZapier"},
                {
                    "name": "Validate Information",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
                {
                    "name": "Record in Accounting System",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
                {
                    "name": "Schedule Payment",
                    "needsKey": False,
                    "provider": "NotZapier",
                },
            ],
        },
    ]
    workflow = workflows[0]
    tasks = workflow["tasks"]
    for t in tasks:
        retries = 0

        # Enqueue a task
        result = process_task.delay(t)

        # Wait for the task to finish and get the result
        print("Waiting for the task to complete...")
        task_result = result.get()  # This blocks until the task completes

        print(f"Task result: {task_result}")
        while task_result == "Failure" and retries < 5:
            result = process_task.delay(t)

            # Wait for the task to finish and get the result
            print("Waiting for the task to complete...")
            task_result = result.get()  # This blocks until the task completes

            print(f"Task result: {task_result}")

            retries += 1

        if retries == 5:
            print("workflow failure, need to rerun from start")
