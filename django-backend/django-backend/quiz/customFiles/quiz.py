from langchain import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.output_parsers.regex import RegexParser
from langchain.document_loaders import PyPDFLoader
import requests
import ipfshttpclient   
import tempfile
import os

def fetch_ipfs_file(file_hash):
    try:
        # Specify the base URL of the public IPFS gateway
        base_url = 'https://ipfs.io/ipfs/'
        # Construct the complete URL with the file hash
        url = f'{base_url}{file_hash}'
        
        # Send a GET request to the IPFS gateway URL
        response = requests.get(url)
        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # Return the response content (file contents)
            return response.content
        else:
            # Print an error message if the request was not successful
            print(f"Error: Failed to fetch IPFS file (Status Code: {response.status_code})")
            return None
    except requests.RequestException as e:
        # Print an error message if there was an exception during the request
        print(f"Error: {e}")
        return None

# Example usage:
file_hash = 'QmaicT19zxWdun44mPCg1SumDpkLSeBLGLkhk88FZUtiDz'
file_contents = fetch_ipfs_file(file_hash)



















text=''

# Create a temporary file from the file_contents bytes
try:
    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_file.write(file_contents)
    temp_file.close()
except Exception as e:
    print(f"Error creating temporary file: {e}")
    temp_file = None

if temp_file:
    try:
        # Pass the temporary file path to PyPDFLoader
        loader = PyPDFLoader(file_path=temp_file.name)
        # Load and split pages
        pages = loader.load_and_split()
        # Process pages as needed
        for page in pages:
            text += page.page_content
    except Exception as e:
        print(f"Error processing PDF file: {e}")
    finally:
        # Remove the temporary file after use
        os.unlink(temp_file.name)
else:
    print("Error: Temporary file creation failed")

# Now you can use the 'text' variable containing the concatenated content of the PDF pages






















































template = """You are a teacher preparing questions for a quiz. Given the following text, please generate 10 multiple-choice questions (MCQs) with 4 options and a corresponding answer letter based on the document.

Example question:

Question: question here
CHOICE_A: choice here
CHOICE_B: choice here
CHOICE_C: choice here
CHOICE_D: choice here
Answer: A or B or C or D

These questions should be detailed and solely based on the information provided in the document.

<Begin Document>
{doc}
<End Document>"""


prompt=PromptTemplate(
        input_variables=['doc'],
        template=template
        )

llm=ChatGoogleGenerativeAI(model="gemini-pro")
chain=LLMChain(llm=llm,prompt=prompt)
# print(text)

# doc= """Data science is an interdisciplinary field that combines techniques from statistics, computer
# science, and domain expertise to extract insights and knowledge from structured and
# unstructured data. It involves using various tools and methodologies to analyze data, uncover
# patterns, make predictions, and drive decision-making processes."""
doc=text


def get_quiz():
    input_string=chain.invoke(doc)


    input_string=input_string['text']

    return input_string

