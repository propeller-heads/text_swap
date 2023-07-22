import requests

# URL of the API endpoint
url = "http://localhost:8000/chat"

# JSON data to send in the request body
data = {"message": "Your message goes here"}

# Make the POST request
response = requests.post(url, json=data)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Get the JSON data from the response
    response_data = response.json()
    print(response_data)
else:
    print(f"Request failed with status code: {response.status_code}")
