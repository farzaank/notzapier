# notzapier

frontend is a nextJS/react app that abuses the public directory as a mock database to keep track of workflows and keys

backend involves

- a flask api that mocks a DB service by reading/writing to the public directory
- a celery service that serves as a task queue with redis for message management
