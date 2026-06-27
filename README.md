# Teletraan II

A reimagined, rebuilt version of Teletraan I — the Autobot supercomputer from Transformers G1. Built from scratch with React + Vite and deployed at [teletraan-ii.vercel.app](https://teletraan-ii.vercel.app).

## Features

- **AI Brain** — Powered by Claude API, responds in character as the Autobot supercomputer
- **Voice Control** — Say "Teletraan" to activate voice command mode, speak your command, hear the response
- **Optical Threat Scanner** — Live computer vision with real-time object detection via TensorFlow COCO-SSD
- **Decepticon Threat Assessment** — Dynamic threat level system (MINIMAL → ELEVATED → HIGH → CRITICAL) with panel alerts
- **Energon Level Indicator** — Live energon reserves monitor in the header with status readout
- **Ambient Sound System** — Ark background hum with alert tones on threat escalation
- **Earth Monitoring** — Animated radar with sector tracking and orbital data
- **Autobot Roster** — Live status panel for Optimus Prime, Bumblebee, Jazz, and Ironhide
- **System Diagnostics** — Real-time CPU, RAM, network, and uptime readouts
- **Subspace Communications** — Send Autobot transmissions and intercept Decepticon signals
- **Jazz Unit Panel** — Wearable interface panel pre-built for future Jazz mask hardware integration
- **Fullscreen Mode** — Press F to go full Teletraan II

## Tech Stack

React, Vite, TensorFlow.js, COCO-SSD, Claude API, Web Speech API

## Setup

```bash
npm install
npm run dev
```

Create a `.env` file:

VITE_ANTHROPIC_API_KEY=your_key_here

## Roadmap — v2

- Jazz wearable mask with LED matrix, motion sensors, voice module, and audio array
- Hardware integration via USB / Bluetooth
- Live sensor data feeding into the Jazz Unit panel
- Camera feed from the mask piped into the Optical Threat Scanner
