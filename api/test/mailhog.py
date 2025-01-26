import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# MailHog SMTP server details
smtp_server = "mailhog"
smtp_port = 1025  # Default SMTP port for MailHog

# Email details
sender_email = "sender@example.com"
receiver_email = "receiver@example.com"
subject = "Test Email from Python to MailHog"
body = "This is a test email sent from Python to MailHog."

# Create the email content
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = receiver_email
message["Subject"] = subject

# Add body to email
message.attach(MIMEText(body, "plain"))

# Send the email via MailHog
try:
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.sendmail(sender_email, receiver_email, message.as_string())
    print("Test email sent successfully!")
except Exception as e:
    print(f"Failed to send email: {e}")
