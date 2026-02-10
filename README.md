
# ✨ Lumina: Genesis (v0.1.0)

**The AI-Powered Spiritual Sanctuary.**

Lumina is a high-end, visual-first Christian application designed for the modern era. It leverages the latest **Google Gemini 2.5 & 3.0** models to provide theological guidance, generate prayers, and simulate biblical narratives through **Veo** video generation.

## 🌟 Key Features

*   **AI Pastor**: Context-aware spiritual counseling using `gemini-3-flash-preview`.
*   **Veo Divine Simulations**: Generate cinematic representations of biblical miracles using `veo-3.1-fast-generate-preview`.
*   **Community Prayer Chain**: A glassmorphic social hub for intercession.
*   **Media Vault**: Generate custom spiritual wallpapers (`gemini-2.5-flash-image`) and prophetic alarms (TTS).
*   **Premium Guide**: Personalized audio prayers tailored to user life details.

## 🛠 Tech Stack

*   **Framework**: React 19 + TypeScript
*   **Build Tool**: Vite 6
*   **Styling**: Tailwind CSS + Custom CSS Animations
*   **AI Engine**: Google GenAI SDK (`@google/genai`)
*   **Routing**: React Router DOM (HashRouter for static deployment)

## 🚀 Setup & Deployment

This project uses a **Flat Root Structure** for maximum compatibility.

1.  **Clone the Repo**
    ```bash
    git clone https://github.com/your-username/lumina-genesis.git
    cd lumina-genesis
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables**
    Create a `.env` file in the root (or configure in Vercel):
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run Locally**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

## ⚠️ Veo Video Generation Note
The "Divine Simulations" feature uses the Veo model, which requires a paid Google Cloud Project with billing enabled. The app automatically handles the API Key selection UI if the user attempts to generate video.

## 🎨 "Golden State" Visuals
The app enforces a "Golden State" aesthetic:
*   Deep indigo/black gradients (`#0f1018`).
*   Glassmorphism (`backdrop-filter: blur(12px)`).
*   Serif typography (`Playfair Display`) for headings.
*   Smooth, ethereal entrance animations.

Built for the Glory of God.
