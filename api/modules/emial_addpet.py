import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

SMTP_SERVER = os.environ["SMTP_SERVER"]
SMTP_PORT = int(os.environ["SMTP_PORT"])

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
        # Try connecting with STARTTLS first
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Try using STARTTLS
        server.login(sender_email, sender_password)  # Authenticate
        server.send_message(message)  # Send the email
        print("Email sent successfully with STARTTLS!")
        return True
    except Exception as e:
        print(f"STARTTLS failed: {e}")
        # If STARTTLS fails, try without encryption
        try:
            print("Falling back to non-STARTTLS connection.")
            server.quit()  # Ensure the previous server connection is closed
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.login(sender_email, sender_password)  # Authenticate
            server.send_message(message)  # Send the email
            print("Email sent successfully without STARTTLS!")
            return True
        except Exception as e2:
            print(f"Error without STARTTLS: {e2}")
            return False
    finally:
        if server:
            server.quit()  # Ensure the server connection is closed properly
