import os
from whitenoise import WhiteNoise
from django.core.wsgi import get_wsgi_application

# Set the settings module for Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'juridical_chatbot.settings')

# Get the WSGI application
application = get_wsgi_application()

# Use WhiteNoise to serve static files
application = WhiteNoise(application)