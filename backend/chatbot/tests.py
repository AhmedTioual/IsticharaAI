from django.test import TestCase, Client
import json

class ChatbotAPITest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = '/api/chat/'

    def test_chatbot_api_post(self):
        payload = {"message": "hello"}
        response = self.client.post(self.url, data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('response', response.json())

    def test_chatbot_api_invalid_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 405)