import requests
from os import getenv

class Bot:
    def __init__(self,bot_token:str, channel_id:str, server_name:str, enable:bool) -> None:
        self.bot_token = bot_token
        self.channel_id = channel_id
        self.name =server_name
        self.state=enable
        
        if self.bot_token == None:
            raise TypeError("bot_token can't None")
        
        if self.channel_id == None:
            raise TypeError("channel_id can't None")
        
        if self.name == None:
            raise TypeError("server_name can't None")
        
        if self.state == None:
            raise TypeError("state can't None")
        
        
    def send_message(self, message):
        if not self.state:
            return True
        
        url = f'https://api.telegram.org/bot{self.bot_token}/sendMessage'
        payload = {
            'chat_id': self.channel_id,
            'text': f"{self.name}: {message}",
            'parse_mode': 'HTML'
        }
        response = requests.post(url, data=payload)
        return response.json()["ok"]