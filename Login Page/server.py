import requests

def get_google_access_token(code):
    token_url = "https://oauth2.googleapis.com/token"
    client_id = "YOUR_GOOGLE_CLIENT_ID"  # Replace with your Google Client ID
    client_secret = "YOUR_GOOGLE_CLIENT_SECRET"  # Replace with your Google Client Secret
    redirect_uri = "YOUR_REDIRECT_URI"  # Replace with your redirect URI

    # Prepare the payload with the authorization code
    payload = {
        "code": code,
        "client_id": "876080209753-0k7oip0morqa1bk0rlhvfi8oeqn9r4uq.apps.googleusercontent.com",
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }

    # Send a POST request to exchange the code for an access token
    response = requests.post(token_url, data=payload)

    if response.status_code == 200:
        return response.json()  # Contains the access token, refresh token, etc.
    else:
        return response.json()  # Handle error response
