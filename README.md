# juridical_chatbot

This is a Django-based project for a juridical chatbot designed to assist users with legal information and queries.

## Setup Instructions

### Create and Activate Virtual Environment


Create a virtual environment to isolate the project dependencies:
```bash
python -m venv venv
.\venv\Scripts\activate
```

### Install Dependencies

Install all required dependencies using the requirements.txt file:
pip install -r requirements.txt


### Run the Project

#### Start the Django Development Server

To run the backend services, start the Django development server:
```bash
python backend/manage.py runserver
```

This will start the server at http://127.0.0.1:8000/.

#### Start the HTTP Server

If you are serving static files or frontend components separately, use the built-in Python HTTP server:

```bash
python -m http.server 8000
```
This will serve static files at http://127.0.0.1:8000/.