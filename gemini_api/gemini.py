import os
import requests
import pathlib
import textwrap
import google.generativeai as genai

from IPython.display import display
from IPython.display import Markdown

def to_markdown(text):
  text = text.replace('•', '  *')
  return Markdown(textwrap.indent(text, '> ', predicate=lambda _: True))

# this not secure need to use something like this GOOGLE_API_KEY=userdata.get('GOOGLE_API_KEY')
GOOGLE_API_KEY='AIzaSyDl9kwN2va1YPDyRWWAesOm7DBbLeuVwac'

genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel('gemini-pro')

# API call to get user's prompt

# data = {'key': 'value'}

# response = requests.post('http://localhost:5000/api', json=data)

# print(response.json())

response = model.generate_content("setip a basic local server for a local api FOR MAKING POST CALLS AND GETTING RESPONSES FROM IT ")

text = to_markdown(response.text)


print(response.text)