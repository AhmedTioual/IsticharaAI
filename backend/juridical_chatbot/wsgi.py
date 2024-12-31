import os
from django.core.wsgi import get_wsgi_application

# Make sure to reference the correct path to settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.juridical_chatbot.settings')

application = get_wsgi_application()

# Export 'application' for Vercel
app = application