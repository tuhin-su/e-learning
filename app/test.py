import unittest
import requests
import json

class TestAPI(unittest.TestCase):
    base_url = "https://localhost:5000/api"
    users = [
        {"username": "sd", "password": "sdsds"},
        {"username": "sdd", "password": "sadasdd"},
        {"username": "sdsd", "password": "asdsad"}
    ]

    def setUp(self):
        self.session = requests.Session()
        # Disable SSL warnings for testing
        requests.packages.urllib3.disable_warnings(requests.packages.urllib3.exceptions.InsecureRequestWarning)
    
    def create_user(self, user):
        response = self.session.post(f"{self.base_url}/users", json=user, verify=False)
        print(f"Create user response: {response.status_code}, {response.text}")
        self.assertEqual(response.status_code, 201)

    def login_user(self, user):
        response = self.session.post(f"{self.base_url}/login", json=user, verify=False)
        print(f"Login response: {response.status_code}, {response.text}")
        self.assertEqual(response.status_code, 200)
        return response.cookies

    def logout_user(self):
        response = self.session.post(f"{self.base_url}/logout", verify=False)
        print(f"Logout response: {response.status_code}, {response.text}")
        self.assertEqual(response.status_code, 200)

    def access_secure_data(self, cookies):
        response = self.session.get(f"{self.base_url}/secure-data", cookies=cookies, verify=False)
        print(f"Access secure data response: {response.status_code}, {response.text}")
        return response

    def test_multiple_user_access(self):
        for user in self.users:
            # Create user
            self.create_user(user)
            
            # Login user
            cookies = self.login_user(user)
            
            # Access secure data with the logged-in user
            response = self.access_secure_data(cookies)
            print(f"Secure data response after login: {response.status_code}, {response.text}")
            self.assertEqual(response.status_code, 200)
            self.assertIn("data", response.json())

            # Logout user
            self.logout_user()
            
            # Try to access secure data after logout
            response = self.access_secure_data(cookies)
            print(f"Secure data response after logout: {response.status_code}, {response.text}")
            self.assertEqual(response.status_code, 401)

if __name__ == '__main__':
    unittest.main()
