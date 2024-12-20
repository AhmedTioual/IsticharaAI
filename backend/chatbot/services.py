from langchain_groq import ChatGroq
import requests
import time
from pinecone import Pinecone
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# get embeddings from LaBSE model
def get_embeddings(texts):

    API_URL = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/LaBSE"

    headers = {"Authorization": "Bearer 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"}

    def query(payload):
        response = requests.post(API_URL, headers=headers, json=payload)
        result = response.json()

        # Check if model is still loading
        if 'error' in result and 'loading' in result['error']:
            print(f"Model is loading. Estimated time: {result.get('estimated_time', 'unknown')} seconds.")
            return None
        return result

    count=0
    # Retry logic
    embeddings = None
    while embeddings is None:
        embeddings = query({
            "inputs": texts
        })
        if embeddings is None:
            count+=1
            # Wait for 10 seconds before retrying
            time.sleep(10)
        if count == 10:
            return None

    return embeddings

# Initialize the ChatGroq model
def get_chat_model():
    model = ChatGroq(
        groq_api_key="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",
        model_name="llama-3.1-70b-versatile"
    )
    return model

# Initialize the Picone
def connect_to_index():
    
    pc = Pinecone(api_key='pcsk_5shSMb_91Md5cJAMd4EfFYnDFNbqSYtPAYUTXPxaHLRRqWA8HwmHcBmsfQ3hjjECYX8Uia')

    return pc

# Retrieve related law documents
def retrieve_similar_documents(query, top_k=10):
    """Retrieve similar documents from Pinecone."""
    # Step 1: Convert query to embedding
    query_vector = get_embeddings(query)
    
    pc = connect_to_index()

    # Step 2: Search in Pinecone
    # Connect to the existing index
    index = pc.Index('moroccanlaw-index')

    search_results = index.query(
        vector=query_vector,
        top_k=top_k,
        include_metadata=True  # Fetch metadata for the results
    )

    # Step 3: Return results
    return ' '.join(item['metadata']['text'] for item in search_results['matches']) #"Relevant legal documents or extracted content based on the message." #search_results["matches"]['metadata'] 

# The RAG system Pipeline
def rag_pipeline(user_message):

    # Define the prompt template
    template = """
        Instructions:
        - Answer the questions related to law and legal matters concisely and accurately. If you don't know the answer, say 'I don't know.'
        - Use the provided context to give specific and relevant information about the legal topic in question.
        - Match the language of your response to the language of the question. Respond in English if the question is in English, in French if the question is in French, or in Arabic if the question is in Arabic.
        - Incorporate any known legal principles, regulations, case law, or legal doctrines to enhance the relevance of your answer.
        - Always cite the source of your information, such as specific laws, articles, or precedents, to ensure credibility and clarity.
        - Provide details about the cited laws, including their name, year of enactment, jurisdiction, and relevant articles or sections.
        - If the source is unavailable, explicitly state that it is based on general legal knowledge or context.

        Context: {context}

        Question: {question}
    """

    # Create the prompt template
    prompt = PromptTemplate.from_template(template)

    model = get_chat_model()

    parser = StrOutputParser()
    
    context = retrieve_similar_documents(user_message)

    chain = prompt | model | parser

    result = chain.invoke({'context': context, 'question': user_message})

    return result

# Process user queries
def process_chat_query(user_message):
    """
    Process user messages and return chatbot responses.
    Replace this function with your RAG integration logic.
    """
    try:
        model = get_chat_model()  # Get the initialized model
        if user_message.lower() == "hello":
            return "Hello! How can I assist you with legal queries?"
        else:
            # Use the model to generate a response
            response = rag_pipeline(user_message)
            return response
    except Exception as e:
        return f"An error occurred while processing your request: {e}"