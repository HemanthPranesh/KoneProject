import json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import requests
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/test-llm")
def test_llm():

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": "What is an elevator door sensor? Answer in 2 lines.",
            "stream": False
        }
    )

    return response.json()

class DiagnoseRequest(BaseModel):
    error_code: Optional[str] = None
    symptoms: Optional[str] = None
class ChatRequest(BaseModel):
    question: str
    fault_data: dict

@app.get("/")
def home():
    return {"message": "LiftMind Backend Running"}


@app.get("/faults")
def get_faults():
    with open("fault_db.json", "r") as file:
        data = json.load(file)

    return data

@app.post("/chat")
def chat_with_ai(request: ChatRequest):

    prompt = f"""
You are an elevator maintenance expert.

Current Fault Information:

Error Code: {request.fault_data.get('error_code')}
Cause: {request.fault_data.get('cause')}
Severity: {request.fault_data.get('severity')}
Repair Time: {request.fault_data.get('repair_time')}
Solution: {request.fault_data.get('solution')}

Technician Question:
{request.question}

Answer clearly and practically.
Keep the answer under 150 words.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    return {
        "answer": response.json()["response"]
    }

def generate_ai_report(fault):

    prompt = f"""
You are a senior elevator maintenance engineer.

Fault Information:
Error Code: {fault['error_code']}
Cause: {fault['cause']}
Severity: {fault['severity']}
Repair Time: {fault['repair_time']}
Solution: {fault['solution']}

Generate a technician insight report.

IMPORTANT:
- Do NOT repeat the cause.
- Do NOT repeat the severity.
- Do NOT repeat the repair time.
- Do NOT repeat the solution.
- Add new insights only.

Format:

WHY IT HAPPENS:
(Explain common reasons behind this fault)

RISKS IF IGNORED:
(Potential consequences)

STEP-BY-STEP INSPECTION:
Provide 3-5 numbered steps.
(What the technician should verify)

PREVENTIVE MAINTENANCE:
(How to avoid this fault in future)

Keep it practical and under 120 words.
"""

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]
@app.post("/diagnose")
def diagnose_fault(request: DiagnoseRequest):

    with open("fault_db.json", "r") as file:
        faults = json.load(file)

    # Search by error code
    if request.error_code:
        for fault in faults:
            if fault["error_code"].lower() == request.error_code.lower():
                fault["ai_report"] = generate_ai_report(fault)
                return fault

    # Search by symptoms
    if request.symptoms:

        user_text = request.symptoms.lower()

        best_match = None
        best_score = 0

        for fault in faults:

            score = 0

            for symptom in fault["symptoms"]:

                symptom_words = symptom.lower().split()

                for word in symptom_words:

                    if word in user_text:
                        score += 1

            if score > best_score:
                best_score = score
                best_match = fault

        if best_match:
            best_match["ai_report"] = generate_ai_report(best_match)
            return best_match

    return {"message": "No matching fault found"}