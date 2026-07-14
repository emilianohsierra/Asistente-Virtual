<h1 align="center">AI Customer Support Assistant</h1>

<p align="center">
  A production web app that drafts professional, bilingual customer-support replies —<br/>
  powered by the Claude API and a secure serverless architecture.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>
  <img src="https://img.shields.io/badge/Claude_API-D97757?style=flat-square&logo=anthropic&logoColor=white" alt="Claude API"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5"/>
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3"/>
  <img src="https://img.shields.io/badge/License-MIT-3DA639?style=flat-square" alt="MIT License"/>
</p>

<p align="center">
  <img src="screenshot-1.png" alt="AI Customer Support Assistant — main interface" width="100%"/>
</p>

<p align="center">
  <a href="https://asistente-virtual-livid.vercel.app"><b>Live Demo →</b></a>
</p>

---

## Overview

Support teams spend hours drafting repetitive, on-brand replies across multiple languages. This app turns a customer's message into a professional, ready-to-send reply in seconds — with full control over tone, language, and length — while keeping API credentials secure on the server.

---

## Features

### AI
- Claude API response generation
- Prompt engineering for tone and format control
- Bilingual output (Spanish / English)

### User Experience
- Responsive design
- Dark mode
- Editable replies
- Chat-style conversation view

### Productivity
- Conversation history
- Quick actions — shorten, formalize, translate
- Professional mode with automatic signature

---

## Architecture

The API key is stored server-side and is never exposed to the browser.

```mermaid
flowchart TD
    A[User] --> B[Frontend · HTML · CSS · JavaScript]
    B -->|POST /api/generar-respuesta| C[Serverless Function · Vercel]
    C -->|x-api-key from env variable| D[Claude API · Anthropic]
    D -->|generated reply| C
    C -->|JSON response| B
```

---

## Technologies

| Technology | Purpose |
|------------|---------|
| JavaScript | Application logic and DOM |
| HTML5 / CSS3 | Interface and styling |
| Claude API | AI response generation |
| Serverless Functions | Secure backend |
| Vercel | Hosting and continuous deployment |
| Git and GitHub | Version control |

---

## How It Works

1. The user pastes a customer message and selects tone, language, and length.
2. The frontend calls an internal serverless endpoint (`/api/generar-respuesta`).
3. The function attaches the secret API key from an environment variable and calls the Claude API.
4. The generated reply returns to the interface, where it can be edited, refined, or translated.

---

## Installation

```bash
git clone https://github.com/emilianohsierra/Asistente-Virtual.git
cd Asistente-Virtual/asistente-soporte
```

The frontend is static; the backend runs as a Vercel serverless function.

---

## Configuration

Deploy on [Vercel](https://vercel.com):

1. Import the repository.
2. Set the **Root Directory** to `asistente-soporte`.
3. Add the environment variable listed below.
4. Deploy.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key, read server-side only |

---

## Roadmap

- [ ] Custom domain
- [ ] Saved reply templates
- [ ] Multi-provider LLM support
- [ ] Usage analytics

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="screenshot-2.png" alt="Generated reply"/></td>
    <td width="50%"><img src="screenshot-3.png" alt="Professional mode"/></td>
  </tr>
  <tr>
    <td width="50%"><img src="screenshot-4.png" alt="Quick actions"/></td>
    <td width="50%"><img src="screenshot-5.png" alt="History and dark mode"/></td>
  </tr>
</table>

---

## Author

**Emiliano Lizarraga** — AI-Assisted Developer
Portfolio: https://emilianohsierra.vercel.app · GitHub: https://github.com/emilianohsierra

---

## License

Released under the MIT License. See [`LICENSE`](LICENSE) for details.
