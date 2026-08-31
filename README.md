🧭 Continuity

<p align="center">
  <img src="./assets/continuity-tech-stack.svg" width="100%" alt="Continuity code and technology stack" />
</p>

<p align="center"><strong>Plan Today. Protect Tomorrow.</strong></p>

<p align="center">A modern personal financial continuity platform for organizing assets, people, documents, obligations, and preparedness into one focused workspace.</p>

<p align="center">
  <a href="https://chillingbing648-sketch.github.io/Continuity/"><img src="https://img.shields.io/badge/🚀%20LIVE%20APP-0F766E?style=for-the-badge" alt="Live App"></a>
  <a href="https://github.com/chillingbing648-sketch/Continuity"><img src="https://img.shields.io/badge/💻%20SOURCE-181717?style=for-the-badge&logo=github" alt="Source"></a>
</p>

## ✨ Preview

<p align="center">
  <a href="https://chillingbing648-sketch.github.io/Continuity/"><img src="./image.png" width="96%" alt="Continuity Application Preview"></a>
</p>

<p align="center"><sub>Click the preview to open the live application.</sub></p>

## 🎯 What is Continuity?

Continuity is built around a simple question: **if something unexpected happened tomorrow, would your important financial information be easy to understand and access?**

The product turns scattered financial and preparedness information into a structured workspace built around four things:

**💰 Financial organization · 🧭 Preparedness · 👥 Trusted people · 📋 Continuity actions**

## ⚡ Product Surface

| Area | What it does |
|---|---|
| 🏠 Command Center | One view for continuity health, priorities, deadlines, activity, and next actions |
| 💰 Assets & Liabilities | Track accounts, property, investments, debts, nominees, and ownership context |
| 👥 Trusted People | Organize trustees, beneficiaries, emergency contacts, and related responsibilities |
| 📄 Document Vault | Keep important documents connected to the financial picture |
| 📅 Financial Calendar | Surface recurring obligations and upcoming deadlines |
| 🗺️ Life Map | Connect important life and financial information into a broader continuity picture |
| 🛡️ Continuity Protocols | Prepare check-ins, readiness workflows, simulations, and drills |
| 🤖 AI Assistant | Contextual help and guided discovery inside the workspace |
| 🔎 Search & Command | Quickly find information and trigger common actions |
| 🧾 Audit Trail | Keep visibility into important workspace activity |

## 🛠️ Code & Technology Stack

<p align="center">
  <img src="./assets/continuity-tech-stack.svg" width="100%" alt="Continuity language breakdown and technology stack">
</p>

### Core stack

- ⚛️ **React 18** — UI and component architecture
- ⚡ **Vite 5** — development and production builds
- 🟨 **JavaScript / JSX** — application logic
- 🎨 **CSS** — responsive product interface and design system
- 🟩 **Supabase** — authentication and backend/data services
- 🧠 **React Context** — shared application state
- ⚙️ **GitHub Actions** — CI/CD automation
- 🌐 **GitHub Pages** — application hosting
- 🔧 **Git / GitHub** — version control and collaboration

> **Language note:** the visual language bars are intentionally illustrative rather than hard-coded as repository percentages. For exact current percentages, GitHub's repository language statistics are the source of truth.

## 🏗️ Architecture

```text
                         CONTINUITY
                      React + Vite App
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
   Components             Context              Styles
      UI                 App State               CSS
        │                    │
        └──────────────┬─────┘
                       ▼
                Services / Utils
                       │
                       ▼
                    Supabase
             Auth + Data Services
```

### Project structure

```text
Continuity/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── assets/
│   └── continuity-tech-stack.svg
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── icons/
│   ├── lib/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── image.png
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## 🚀 Run Locally

```bash
git clone https://github.com/chillingbing648-sketch/Continuity.git
cd Continuity
npm install
npm run dev
```

Production check:

```bash
npm run build
npm run preview
```

## 🔐 Environment

For local Supabase integration, configure `.env.local`:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Never commit secrets or private credentials.

## ☁️ Deployment

```text
Developer
   │
   ▼
Git Push
   │
   ▼
GitHub Actions
   │
   ▼
Vite Build
   │
   ▼
Deployment
   │
   ▼
🌐 Live Application
```

## 📈 Engineering Status

| Area | Status |
|---|:---:|
| React architecture | 🟢 |
| Component system | 🟢 |
| Supabase integration | 🟢 |
| Production build | 🟢 |
| Deployment workflow | 🟢 |
| Automated testing | 🟡 |
| Monitoring / observability | 🟡 |
| Security hardening | 🟡 |

**Stage:** MVP / Active Development

## 🗺️ Roadmap

- [x] Core application
- [x] Modern UI
- [x] Data integration
- [x] Deployment
- [x] Command Center foundation
- [ ] Testing expansion
- [ ] Accessibility hardening
- [ ] Observability
- [ ] Advanced continuity planning
- [ ] Deeper scenario simulation

## 🤝 Contributing

```bash
git checkout -b feature/my-feature
npm install
npm run dev
npm run build
git commit -m "feat: describe change"
git push origin feature/my-feature
```

Then open a Pull Request.

## ⚠️ Disclaimer

Continuity is a **financial organization and planning software project**. It does not provide financial, investment, legal, insurance, or tax advice.

## 🔗 Links

<p align="center">
  <a href="https://chillingbing648-sketch.github.io/Continuity/">🌐 <strong>Live Application</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/chillingbing648-sketch/Continuity">💻 <strong>GitHub</strong></a>
  &nbsp; · &nbsp;
  <a href="https://github.com/chillingbing648-sketch/Continuity/issues">🐛 <strong>Issues</strong></a>
</p>

<p align="center"><strong>Continuity</strong><br><sub>Plan Today. Protect Tomorrow.</sub></p>
