import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.smtp_server = getattr(settings, 'SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = getattr(settings, 'SMTP_PORT', 587)
        self.smtp_username = getattr(settings, 'SMTP_USERNAME', '')
        self.smtp_password = getattr(settings, 'SMTP_PASSWORD', '')
        self.from_email = getattr(settings, 'FROM_EMAIL', 'noreply@smartstudy.ai')
    
    async def send_email(
        self,
        to_emails: List[str],
        subject: str,
        html_content: str,
        text_content: Optional[str] = None
    ) -> bool:
        """Send email to recipients"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.from_email
            msg['To'] = ', '.join(to_emails)
            
            # Add text part
            if text_content:
                text_part = MIMEText(text_content, 'plain')
                msg.attach(text_part)
            
            # Add HTML part
            html_part = MIMEText(html_content, 'html')
            msg.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                if self.smtp_username and self.smtp_password:
                    server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {to_emails}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False
    
    async def send_welcome_email(self, user_email: str, user_name: str) -> bool:
        """Send welcome email to new user"""
        subject = "Welcome to SmartStudy AI+!"
        
        html_content = f"""
        <html>
        <body>
            <h2>Welcome to SmartStudy AI+, {user_name}!</h2>
            <p>Thank you for joining our AI-powered learning platform.</p>
            <p>Here's what you can do:</p>
            <ul>
                <li>📚 Take AI-generated quizzes</li>
                <li>🤖 Chat with your personal AI tutor</li>
                <li>📊 Track your learning progress</li>
                <li>🎯 Get personalized study recommendations</li>
            </ul>
            <p>Get started by visiting your <a href="https://smartstudy.vercel.app/dashboard">dashboard</a>.</p>
            <p>Happy learning!</p>
            <p>The SmartStudy AI+ Team</p>
        </body>
        </html>
        """
        
        text_content = f"""
        Welcome to SmartStudy AI+, {user_name}!
        
        Thank you for joining our AI-powered learning platform.
        
        Here's what you can do:
        - Take AI-generated quizzes
        - Chat with your personal AI tutor
        - Track your learning progress
        - Get personalized study recommendations
        
        Get started by visiting your dashboard.
        
        Happy learning!
        The SmartStudy AI+ Team
        """
        
        return await self.send_email([user_email], subject, html_content, text_content)
    
    async def send_password_reset_email(self, user_email: str, reset_token: str) -> bool:
        """Send password reset email"""
        subject = "Reset Your SmartStudy AI+ Password"
        
        reset_link = f"https://smartstudy.vercel.app/auth/reset-password?token={reset_token}"
        
        html_content = f"""
        <html>
        <body>
            <h2>Password Reset Request</h2>
            <p>You requested to reset your password for SmartStudy AI+.</p>
            <p>Click the link below to reset your password:</p>
            <p><a href="{reset_link}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
            <p>The SmartStudy AI+ Team</p>
        </body>
        </html>
        """
        
        text_content = f"""
        Password Reset Request
        
        You requested to reset your password for SmartStudy AI+.
        
        Click the link below to reset your password:
        {reset_link}
        
        This link will expire in 1 hour.
        
        If you didn't request this, please ignore this email.
        
        The SmartStudy AI+ Team
        """
        
        return await self.send_email([user_email], subject, html_content, text_content)
