🧭 Continuity
<p align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=0f766e,2563eb&height=190&section=header&text=Continuity&fontSize=56&fontColor=ffffff&animation=fadeIn&fontAlignY=38" width="100%" alt="Continuity"> </p> <p align="center"> <strong>Plan Today. Protect Tomorrow.</strong> </p> <p align="center"> A modern personal financial continuity platform designed to organize important information, improve preparedness, and bring clarity to life's unexpected moments. </p> <p align="center"> <a href="https://chillingbing648-sketch.github.io/Continuity/"> <img src="https://img.shields.io/badge/🚀%20LIVE%20APP-0F766E?style=for-the-badge" alt="Live App"> </a> <a href="https://github.com/chillingbing648-sketch/Continuity"> <img src="https://img.shields.io/badge/💻%20SOURCE-181717?style=for-the-badge&logo=github" alt="Source"> </a> <img src="https://img.shields.io/github/last-commit/chillingbing648-sketch/Continuity?style=for-the-badge&logo=git&label=UPDATED" alt="Last Updated"> </p>
✨ Preview
<p align="center"> <a href="https://chillingbing648-sketch.github.io/Continuity/"> <img src="image.png" width="96%" alt="Continuity Application Preview"> </a> </p> <p align="center"> <sub>Live application preview · Click the image to open Continuity</sub> </p>
🎯 The Idea

Continuity is built around a simple question:

If something unexpected happened tomorrow, would your important financial information be easy to understand and access?

Continuity aims to make that preparation more organized, accessible, and actionable through a focused digital experience.

Core Focus

💰 Financial Organization · 🧭 Preparedness · 📋 Continuity · 🔐 Responsible Data

⚡ Highlights
<table> <tr> <td align="center" width="25%"> <h3>🧠</h3> <b>Clarity</b><br> <sub>Turn scattered information into a structured experience.</sub> </td> <td align="center" width="25%"> <h3>💰</h3> <b>Financial Focus</b><br> <sub>Designed around personal financial continuity.</sub> </td> <td align="center" width="25%"> <h3>⚛️</h3> <b>Modern Stack</b><br> <sub>React + Vite with modular architecture.</sub> </td> <td align="center" width="25%"> <h3>🚀</h3> <b>Deployed</b><br> <sub>Automated GitHub Pages deployment.</sub> </td> </tr> </table>
🛠️ Technology
<p align="center"> <img src="https://skillicons.dev/icons?i=react,vite,js,html,css,supabase,git,github&perline=8" alt="Technology Stack"> </p>
Technology	Purpose
⚛️ React 18	UI & component architecture
⚡ Vite 5	Development & production builds
🟨 JavaScript / JSX	Application logic
🎨 CSS	Styling & presentation
🟩 Supabase	Data & backend services
🔧 Git	Version control
🐙 GitHub	Repository & collaboration
⚙️ GitHub Actions	Deployment automation
🌐 GitHub Pages	Application hosting
📊 Language Breakdown
<p align="center"> <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=chillingbing648-sketch&repo=Continuity&layout=donut&theme=transparent&hide_border=true&langs_count=8" width="380" alt="Continuity Language Breakdown" /> </p> <p align="center"> <sub> Automatically generated from the repository's current source composition. </sub> </p>
🏗️ Architecture
                         ┌──────────────────────┐
                         │      CONTINUITY      │
                         │     React + Vite     │
                         └──────────┬───────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
       ┌────────────┐        ┌────────────┐        ┌────────────┐
       │ Components │        │  Context   │        │   Styles   │
       │    UI      │        │   State    │        │    CSS     │
       └─────┬──────┘        └─────┬──────┘        └────────────┘
             │                     │
             └──────────┬──────────┘
                        ▼
                 ┌──────────────┐
                 │   Services   │
                 │    Utils     │
                 └──────┬───────┘
                        │
                        ▼
                 ┌──────────────┐
                 │   Supabase   │
                 │ Data Layer   │
                 └──────────────┘

Project Structure
Continuity/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
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
│
├── imag.png
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js

🚀 Run Locally
1 · Clone
git clone https://github.com/chillingbing648-sketch/Continuity.git
cd Continuity

2 · Install
npm install

3 · Start
npm run dev

4 · Build
npm run build

5 · Preview
npm run preview

🔐 Environment

If using the Supabase integration locally, configure your environment in .env.local:

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key


Never commit secrets or private credentials.

☁️ Deployment

Continuity uses a GitHub-based deployment workflow:

   Developer
       │
       ▼
    Git Push
       │
       ▼
    GitHub
       │
       ▼
 GitHub Actions
       │
       ▼
   Vite Build
       │
       ▼
 GitHub Pages
       │
       ▼
   🌐 LIVE APP

🔗 Live
<p align="center"> <a href="https://chillingbing648-sketch.github.io/Continuity/"> <img src="https://img.shields.io/badge/OPEN%20CONTINUITY-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Open Continuity"> </a> </p>
📈 Engineering Status
Area	Status
React Architecture	🟢
Component Structure	🟢
Supabase Integration	🟢
Production Build	🟢
GitHub Pages	🟢
CI/CD Foundation	🟢
Automated Tests	🟡
Monitoring	🟡
Production Security Hardening	🟡

Current stage: MVP / Active Development

🗺️ Next
✓ Core Application
✓ Modern UI
✓ Data Integration
✓ Deployment

→ Testing
→ Security Hardening
→ Accessibility
→ Observability
→ Advanced Planning Features

🤝 Contributing

Contributions and ideas are welcome.

git checkout -b feature/my-feature
npm install
npm run dev
npm run build
git commit -m "feat: describe change"
git push origin feature/my-feature


Then open a Pull Request.

⚠️ Disclaimer

Continuity is a financial organization and planning software project.

It does not provide financial, investment, legal, insurance, or tax advice.

🔗 Links
<p align="center"> <a href="https://chillingbing648-sketch.github.io/Continuity/"> 🌐 <b>Live Application</b> </a> &nbsp;&nbsp;•&nbsp;&nbsp; <a href="https://github.com/chillingbing648-sketch/Continuity"> 💻 <b>GitHub</b> </a> &nbsp;&nbsp;•&nbsp;&nbsp; <a href="https://github.com/chillingbing648-sketch/Continuity/issues"> 🐛 <b>Issues</b> </a> </p>
<p align="center"> <img src="https://capsule-render.vercel.app/api?type=waving&color=2563eb,0f766e&height=120&section=footer" width="100%" alt="Continuity"> </p> <p align="center"> <strong>Continuity</strong><br> <sub>Plan Today. Protect Tomorrow.</sub> </p>
