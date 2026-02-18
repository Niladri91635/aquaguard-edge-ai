<div align="center">
🌊 AquaGuard
Edge-AI Smart Water & Energy Loss Detection System

🚧 Prototype in Development — AMD Slingshot Hackathon 2026










</div>

🌍 Problem Statement

Water infrastructure systems worldwide suffer from:

🚱 Undetected leaks

💧 Massive water loss

⚡ Energy waste due to pump overuse

⏳ Delayed manual inspection

Current monitoring systems lack real-time intelligence and automated response mechanisms.


💡 Our Solution

AquaGuard is an Edge-AI powered IoT system that:

📊 Uses Flow, Pressure & Vibration sensors

🧠 Performs TinyML inference on ESP32

🚨 Detects anomalies in real-time

🔒 Triggers autonomous valve shutdown

♻ Calculates Water Recovery Efficiency

📈 Displays sustainability analytics via dashboard


🏗 System Architecture
Sensors → ESP32 (Edge AI) → FastAPI Backend → React Dashboard
                      ↓
                Auto Valve Control

Architecture Overview
4


🔧 Hardware Components
Component	Purpose
ESP32	Edge processing + TinyML inference
Flow Sensor	Water flow measurement
Pressure Sensor	Detect pressure anomalies
Vibration Sensor	Pipe vibration analysis
Solenoid Valve	Automatic water shutoff
Relay Module	Valve control


💻 Software Stack
🖥 Frontend

React

Vite

TypeScript

TailwindCSS

⚙ Backend

FastAPI (Python)

🔌 Edge Device

ESP32 (Arduino Framework)

🤖 Machine Learning

TinyML

Edge Impulse

📂 Repository Structure
aquaguard-edge-ai/
├── frontend/        → React Dashboard UI
├── backend/         → FastAPI Server
├── edge-device/     → ESP32 + TinyML Code
├── ml-model/        → Training & exported models
├── hardware/        → Circuit diagrams & components
├── docs/            → Architecture & API specs
└── demo/            → Screenshots & demo links

🚀 Demo Workflow

Simulate leak condition

Sensors detect abnormal readings

ESP32 runs TinyML model

Backend logs anomaly

Dashboard updates in real-time

Valve auto-shutdown activates

🔮 Future Scope

🔍 Predictive leak forecasting

🏙 City-wide deployment model

☁ Cloud scaling with analytics

📡 Satellite-integrated water monitoring

🤖 Advanced anomaly pattern learning

📜 License

This project is licensed under the MIT License.
