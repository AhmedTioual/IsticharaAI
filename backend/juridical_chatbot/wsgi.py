import os
from whitenoise import WhiteNoise
from django.core.wsgi import get_wsgi_application

# Set the settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.juridical_chatbot.settings')

application = get_wsgi_application()

application = WhiteNoise(application)

# Vercel requires an `app` or `handler` variable to point to the application.
app = application  # Use `app` instead of `application` for compatibility with Vercel.