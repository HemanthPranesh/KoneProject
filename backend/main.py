import json
from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional
import requests
app = FastAPI()


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

@app.get("/")
def home():
    return {"message": "LiftMind Backend Running"}


@app.get("/faults")
def get_faults():
    with open("fault_db.json", "r") as file:
        data = json.load(file)

    return data



def generate_ai_report(fault):

    prompt = f"""
You are a senior elevator maintenance engineer.

Fault Information:
Error Code: {fault['error_code']}
Cause: {fault['cause']}
Severity: {fault['severity']}
Repair Time: {fault['repair_time']}
Solution: {fault['solution']}

Generate the response in EXACTLY this format:

LIKELY CAUSE:
<cause>

SEVERITY:
<severity>

RECOMMENDED ACTION:
<action>

ESTIMATED REPAIR TIME:
<time>

Keep the total response under 100 words.
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
                if symptom.lower() in user_text:
                    score += 1

            if score > best_score:
                best_score = score
                best_match = fault

        if best_match:
            best_match["ai_report"] = generate_ai_report(best_match)
            return best_match

    return {"message": "No matching fault found"}