# OpenAI API를 사용하여 데이터 정제 및 AI 기능을 처리합니다.
import openai
import os
from dotenv import load_dotenv

# .env 파일에서 환경 변수를 불러옵니다.
load_dotenv()
# 환경 변수에서 OpenAI API 키를 가져옵니다.
openai.api_key = os.getenv("OPENAI_API_KEY")

def process_data_with_ai(data):
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"정리해 주세요: {data}",
            max_tokens=150
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error: {e}")
        return None
