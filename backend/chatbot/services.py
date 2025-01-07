from langchain_groq import ChatGroq
import requests
import time
from pinecone import Pinecone
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import re

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
        التعليمات:
            - عرف نفسك في بداية الإجابة. قل: "أنا مساعد قانوني إلكتروني متخصص في القانون المغربي، هنا لمساعدتك في الإجابة عن الأسئلة القانونية بدقة وسرعة."
            - أجب عن الأسئلة المتعلقة بالقانون المغربي والمسائل القانونية بدقة واختصار. إذا كنت لا تعرف الإجابة، قل "لا أعرف".
            - استخدم السياق المقدم لتقديم معلومات دقيقة وذات صلة حول الموضوع القانوني المطروح.
            - طابق لغة الإجابة مع لغة السؤال. أجب بالإنجليزية إذا كان السؤال بالإنجليزية، وبالفرنسية إذا كان بالفرنسية، وبالعربية إذا كان بالعربية.
            - أدمج أي مبادئ قانونية معروفة أو لوائح أو نصوص قانونية مغربية لتعزيز صلة الإجابة.
            - استشهد دائمًا بمصدر معلوماتك، مثل القوانين المغربية أو المواد أو السوابق القضائية المغربية المحددة، مع ذكر رقم المادة أو النص القانوني، لضمان المصداقية والوضوح.
            - قدم تفاصيل حول القوانين المذكورة، بما في ذلك اسمها، سنة صدورها، الاختصاص القضائي، ورقم المادة أو القسم ذي الصلة.
            - إذا كان المصدر غير متاح أو لا يمكن العثور على المرجع القانوني المناسب، يجب أن تطلب من المستخدم المزيد من السياق حول السؤال ليتمكن من تقديم إجابة دقيقة. قل: "يرجى توفير مزيد من التفاصيل أو تحديد المادة أو النص القانوني المرتبط بهذا السؤال."
            - تأكد من أن الإجابة مدعومة بأدلة من القانون أو المادة المعنية، واذكر رقم المادة بشكل واضح إذا كان ذلك ممكنًا.
        
        السياق: {context}

        السؤال: {question}
    """

    # Create the prompt template
    prompt = PromptTemplate.from_template(template)

    model = get_chat_model()

    parser = StrOutputParser()
    
    context = retrieve_similar_documents(user_message)

    chain = prompt | model | parser

    result = chain.invoke({'context': context, 'question': user_message})
    
    # Remove non-Arabic, non-English, and non-numeric characters
    response = re.sub(r'[^\u0600-\u06FF\u0750-\u077F\u0041-\u005A\u0061-\u007A\u0030-\u0039\s.,:؛،\n]', '', result)
    
    # Apply formatting to the result string
    result = result.replace("\n", "<br>").replace(":", ":<br>").replace("1.", "<br>1.")
    result = "\n".join([line.strip() for line in result.split("\n") if line.strip() != ""])

    return result

# Process user queries
def process_chat_query(user_message):
    """
    Process user messages and return chatbot responses.
    Replace this function with your RAG integration logic.
    """
    try:
        model = get_chat_model()  # Get the initialized model
        if user_message.lower() == "سلام":
            return "سلام! كيفاش بغيتي نعاونك ليوما"
        else:
            # Use the model to generate a response
            response = rag_pipeline(user_message)
            return response
    except Exception as e:
        return f"An error occurred while processing your request: {e}"
