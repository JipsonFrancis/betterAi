import requests

# Define the URL of the POST API
url = "http://127.0.0.1:5000/api/v1/prompt/"

# Create a dictionary of the data to be posted
data = {"prompt": "whats is the meaning of life as a computer, do you even have any concept of life as a program?"}

# Send the POST request
response = requests.post(url, data=data)

# Print the response status code
print(response.status_code)