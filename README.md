# Ascend AI

AI-Powered Elevator Maintenance Intelligence Platform

## Overview

Ascend AI is an intelligent elevator troubleshooting and maintenance assistant designed to help technicians diagnose elevator faults quickly and efficiently.

The system allows technicians to identify faults using either error codes or symptom descriptions, generates AI-powered maintenance insights, and provides an interactive AI assistant for follow-up troubleshooting guidance.

## Features

* Error Code-Based Fault Diagnosis
* Symptom-Based Fault Diagnosis
* AI-Generated Maintenance Insights
* Interactive AI Troubleshooting Assistant
* Severity Classification
* Repair Time Estimation
* Modern Enterprise Dashboard UI
* Fault Knowledge Base with 30+ Elevator Faults

## Problem Statement

Traditional elevator maintenance often requires technicians to manually search documentation and interpret fault codes. This process can be time-consuming and heavily dependent on experience.

Ascend AI aims to reduce troubleshooting time by combining fault diagnosis, AI-generated recommendations, and conversational assistance within a single platform.

## System Workflow

Technician Input (Error Code / Symptoms)
↓
Fault Matching Engine
↓
Fault Database Lookup
↓
Diagnosis Result
↓
AI Insight Report
↓
AI Assistant Chat
↓
Maintenance Recommendation

## Technology Stack

### Frontend

* React.js
* CSS3
* Axios
* Vite

### Backend

* Python
* FastAPI

### Artificial Intelligence

* Ollama
* Llama 3

### Database

* JSON-Based Fault Database

## Project Architecture

React Frontend
│
▼
FastAPI Backend
│
├── Fault Database (JSON)
│
└── Ollama + Llama 3
│
▼
Diagnosis & AI Recommendations
│
▼
Technician Dashboard

## Example Diagnosis

### Input

Error Code:

E204

### Output

Cause:
Door Sensor Obstruction

Severity:
Medium

Repair Time:
15–30 Minutes

Solution:
Clean and recalibrate door sensor

### AI Insight Report

* Why the fault occurs
* Risks if ignored
* Inspection checks
* Preventive maintenance recommendations

## Installation

### Backend

```bash
cd backend

python -m venv .venv

.\.venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend

npm install

npm run dev
```

### Ollama

Start Ollama:

```bash
ollama serve
```

Pull the required model:

```bash
ollama pull llama3:8b
```

Verify:

```bash
ollama list
```

## Future Enhancements

* Natural Language Fault Understanding
* Self-Learning Fault Database
* Predictive Maintenance
* IoT Sensor Integration
* Maintenance Analytics Dashboard
* Real-Time Elevator Monitoring

## Benefits

* Faster Fault Diagnosis
* Reduced Elevator Downtime
* AI-Assisted Troubleshooting
* Improved Maintenance Efficiency
* User-Friendly Interface
* Scalable Architecture

## Team Members

* Hemanth Pranesh
* Varsha
* Raghavi

## License

This project was developed for academic and innovation purposes.
