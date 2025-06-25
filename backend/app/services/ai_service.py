import openai
from typing import Dict, List, Any
from app.core.config import settings

openai.api_key = settings.OPENAI_API_KEY


class AIService:
    def __init__(self):
        self.client = openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    
    async def generate_quiz(
        self,
        subject: str,
        topic: str,
        difficulty: str,
        num_questions: int = 10
    ) -> Dict[str, Any]:
        """Generate a quiz using GPT-4"""
        
        prompt = f"""
        Create a {difficulty} level quiz about {topic} in {subject}.
        Generate {num_questions} multiple choice questions.
        
        Format the response as JSON with this structure:
        {{
            "title": "Quiz title",
            "description": "Brief description",
            "questions": [
                {{
                    "question": "Question text",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": 0,
                    "explanation": "Why this answer is correct"
                }}
            ]
        }}
        
        Make sure questions are educational and cover different aspects of the topic.
        Difficulty level: {difficulty} (easy = basic concepts, medium = application, hard = analysis/synthesis)
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert educator creating educational quizzes."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            
            import json
            quiz_data = json.loads(response.choices[0].message.content)
            return quiz_data
            
        except Exception as e:
            raise Exception(f"Failed to generate quiz: {str(e)}")
    
    async def chat_with_tutor(
        self,
        message: str,
        chat_history: List[Dict],
        subject: str = None
    ) -> Dict[str, Any]:
        """Chat with AI tutor"""
        
        system_prompt = f"""
        You are SmartStudy AI+, an intelligent tutoring assistant. Your role is to:
        1. Help students understand concepts clearly
        2. Provide step-by-step explanations
        3. Encourage critical thinking
        4. Adapt to the student's learning level
        5. Be supportive and patient
        
        {f"Focus on {subject} topics." if subject else ""}
        
        Always provide educational value and encourage learning.
        """
        
        # Convert chat history to OpenAI format
        messages = [{"role": "system", "content": system_prompt}]
        
        # Add recent chat history (last 10 messages to stay within limits)
        for msg in chat_history[-10:]:
            if msg["role"] in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Add current message
        messages.append({"role": "user", "content": message})
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            ai_response = response.choices[0].message.content
            
            # Generate follow-up suggestions
            suggestions = self._generate_suggestions(message, subject)
            
            return {
                "response": ai_response,
                "suggestions": suggestions
            }
            
        except Exception as e:
            raise Exception(f"Failed to get AI response: {str(e)}")
    
    def _generate_suggestions(self, message: str, subject: str) -> List[str]:
        """Generate follow-up question suggestions"""
        base_suggestions = [
            "Can you explain this concept differently?",
            "Can you give me an example?",
            "What are the key points to remember?",
            "How does this relate to other topics?"
        ]
        
        if subject:
            subject_suggestions = {
                "mathematics": [
                    "Can you show me the step-by-step solution?",
                    "What's the real-world application of this?",
                    "Are there any shortcuts or tricks?"
                ],
                "science": [
                    "What's the scientific explanation?",
                    "Can you describe the process?",
                    "What experiments demonstrate this?"
                ],
                "history": [
                    "What were the causes and effects?",
                    "How did this impact society?",
                    "What were the key figures involved?"
                ]
            }
            
            return subject_suggestions.get(subject.lower(), base_suggestions)
        
        return base_suggestions
