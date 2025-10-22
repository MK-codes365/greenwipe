# 🛡️ Green Wipe — Secure & Eco-Friendly Data Erasure

Green Wipe is a modern web app for secure, verifiable, and eco-friendly data sanitization. It uses AI to suggest optimal wiping procedures and generates blockchain-anchored certificates for tamper-proof audit trails. Built for individuals and organizations, Green Wipe helps securely erase data and promotes responsible e-waste recycling.

---

## ✨ Key Features

- ⚡ **AI-Powered Wipe Suggestions:** Get expert recommendations for data sanitization methods (NIST SP 800-88, DoD 5220.22-M, etc.)
- 💾 **Multi-Platform Wiping:**
    - Securely wipe individual files in-browser
    - Simulate wiping of drives (HDD, SSD, NVMe)
    - Simulate remote device wipes
- 📄 **Verifiable Certificates:** Generate official certificates for every completed wipe
- 🔗 **Blockchain Anchoring (Simulated):** Anchor certificates to a simulated blockchain for permanent records
- 📊 **Real-Time Dashboard:** Monitor wipes, environmental impact (CO₂ saved, e-waste diverted), and live impact charts
- 🌐 **Dynamic Content Translation:** Instantly translate the homepage into multiple languages using AI
- 🔒 **Secure by Design:** Built with security best practices for data sanitization

---

## 🚀 Tech Stack

- 🖥️ **Framework:** [Next.js](https://nextjs.org/) (App Router)
- ⚛️ **UI Library:** [React](https://react.dev/)
- 🎨 **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- 🧩 **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- 🧠 **Generative AI:** [Genkit](https://github.com/google/genkit) with Google's Gemini models
- 🗄️ **Database:** [PostgreSQL](https://www.postgresql.org/) via [Prisma](https://www.prisma.io/)
- 🖼️ **Icons:** [Lucide React](https://lucide.dev/guide/packages/lucide-react)
- 📊 **Charts:** [Recharts](https://recharts.org/)
- 🚀 **Deployment:** [Vercel](https://vercel.com/)

---

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) or a compatible package manager
- [Git](https://git-scm.com/) installed on your machine

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/greenwipe.git
    cd greenwipe
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of your project and add your Google AI (Gemini) API key and PostgreSQL connection string. You can get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    ```
    GEMINI_API_KEY=your_api_key_here
    DATABASE_URL=your_postgresql_connection_string
    ```

4.  **Run the development server:**
    - **Terminal 1: Start the Next.js app:**
      ```bash
      npm run dev
      ```
    - **Terminal 2: Start the Genkit server:**
      ```bash
      npm run genkit:watch
      ```

5.  **Open the application:**
    Open your browser and navigate to `http://localhost:3000` to see the application in action.

---

## 🚀 Deployment to Vercel

Deploying to Vercel is simple and integrates directly with GitHub:

1.  **Push Your Project to GitHub:**
    - Create a new repository on [GitHub](https://github.com/new).
    - Initialize git in your project folder and push your code:
      ```bash
      git init -b main
      git add .
      git commit -m "Initial commit"
      git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
      git push -u origin main
      ```

2.  **Deploy on Vercel:**
    - Go to [Vercel](https://vercel.com/) and sign up or log in.
    - Click "New Project" and import your GitHub repository.
    - Vercel will auto-detect your Next.js app and set up build settings:
      - **Build command:** `npm run build`
      - **Output directory:** `.next`
    - Add your environment variables (`GEMINI_API_KEY`, `DATABASE_URL`) in the Vercel dashboard.
    - Click "Deploy". Vercel will build and deploy your app, giving you a live URL.

Every time you push changes to GitHub, Vercel will automatically redeploy your site.

---

## 📬 Contact & Contributing

- For questions, suggestions, or contributions, open an issue or pull request on GitHub.
- Made with ❤️ by the Green Wipe team (Beyonders)
