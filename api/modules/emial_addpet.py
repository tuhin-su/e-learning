import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = "smtp.mail.yahoo.com"
SMTP_PORT = 587

sender_email = os.environ["MAIL"]
sender_password = os.environ["MAIL_KEY"]

def sendOTP(receiver_email, title: str, content: str) -> bool:
    subject = f"{title} - TIMT App"
    body = content

    message = MIMEMultipart()
    message['From'] = sender_email
    message['To'] = receiver_email
    message['Subject'] = subject
    message.attach(MIMEText(body, 'html'))

    server = None  # Initialize server variable
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Start TLS encryption
        server.login(sender_email, sender_password)  # Authenticate
        server.send_message(message)  # Send the email
        print("Email sent successfully!")
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
    
