from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .services import process_chat_query  # Import your chatbot logic

@csrf_exempt
def chatbot_api(request):
    """
    API endpoint to handle chatbot requests.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  # Parse JSON request body
            user_message = data.get('message', '')

            # Use chatbot logic to generate a response
            bot_response = process_chat_query(user_message)

            return JsonResponse({'response': bot_response}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)