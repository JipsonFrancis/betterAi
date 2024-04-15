from flask import Flask, request, jsonify
import os
import requests
import pathlib
import textwrap
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

# this not secure need to use something like this GOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')
GOOGLE_API_KEY='AIzaSyDl9kwN2va1YPDyRWWAesOm7DBbLeuVwac'

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

app = Flask(__name__)

@app.route('/api/v1/prompt', methods=['POST'])
def prompt():
    # Get the request data
    data = request.get_json()
    print(data)

    # Process the data (here we just return it as a response)
    response = model.generate_content(data)

    text = to_markdown(response.text)

    # Return the response
    return jsonify(response.text)

# Run the server
if __name__ == '__main__':
    app.run()