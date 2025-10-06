# AudioRail Rider: Ride the Pulse of Your Music

## 🚀 Project Overview

AudioRail Rider is an innovative AI-powered web application that transforms any audio file into a unique, rideable rollercoaster track set within a dynamic, dream-like 3D world. By leveraging the advanced capabilities of the Google Gemini API for deep audio analysis and track generation, alongside Three.js for immersive 3D rendering, it crafts a truly synesthetic experience. Users can upload an MP3 or WAV file, and the application will procedurally generate a rollercoaster blueprint whose twists, turns, climbs, and drops are directly inspired by the emotional arc, dynamics, and rhythm of the music. Prepare to inhabit the very soul of a song as you hurtle through a bespoke soundscape.

## 🛠️ Tech Stack

This project is built using a modern web development stack focused on performance, dynamic user experiences, and AI integration:

*   **React**: For building the responsive and interactive user interface.
*   **TypeScript**: Ensures type safety, enhances code quality, and improves developer productivity.
*   **Three.js**: The powerful 3D graphics library used to construct, render, and animate the rollercoaster track and its ethereal environment.
*   **Google Gemini API**: The core AI engine that processes uploaded audio files (along with basic duration info) and translates their essence into a detailed `RideBlueprint`, including track segments and a harmonious color palette.
*   **Meyda**: A JavaScript audio feature extraction library utilized for client-side audio analysis, specifically for extracting audio duration and real-time loudness for dynamic visual effects.
*   **Web Audio API**: Provides the low-level client-side audio processing capabilities necessary for `Meyda` and audio playback.
*   **Tailwind CSS**: A utility-first CSS framework for rapid and consistent styling of the UI components.
*   **Vite**: A next-generation frontend tooling that provides an extremely fast development server and optimized build process.

## 📂 File Structure

The project follows a logical structure to separate concerns and facilitate maintainability:

```
├── public/                 // Static assets (e.g., index.css, textures, favicon)
├── src/                    // Main application source code
│   ├── components/         // Reusable React UI components
│   │   ├── Icon.tsx        // SVG icon components used throughout the UI
│   │   ├── Loader.tsx      // Full-screen loading overlay with dynamic messages
│   │   └── ThreeCanvas.tsx // The core Three.js scene, camera, and animation logic
│   ├── lib/                // Core application utilities and logic
│   │   ├── audioProcessor.ts // Handles client-side audio file processing (e.g., duration extraction)
│   │   └── trackBuilder.ts // Converts the AI-generated RideBlueprint into Three.js track data
│   ├── services/           // Integrations with external APIs and services
│   │   └── geminiService.ts // Manages communication with the Google Gemini API for blueprint generation
│   ├── types.ts            // TypeScript interfaces and enums defining data structures
│   ├── App.tsx             // The main React application component, orchestrating UI state and core logic
│   └── index.tsx           // Entry point for rendering the React application
├── .env.local              // Environment variables (e.g., GEMINI_API_KEY) - local only
├── .gitignore              // Specifies files and directories to be ignored by Git
├── index.html              // The main HTML file, serving as the entry point for the web application
├── metadata.json           // Project metadata (name, description) as consumed by the development environment
├── package.json            // Project dependencies and scripts for development and build
├── README.md               // This project documentation
├── tsconfig.json           // TypeScript compiler configuration
└── vite.config.ts          // Vite build tool configuration for environment variables and aliases
```

## 🏁 Getting Started

Follow these steps to get AudioRail Rider up and running on your local machine.

**Prerequisites:**

*   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
*   [npm](https://www.npmjs.com/get-npm) or [pnpm](https://pnpm.io/) (comes bundled with Node.js)
*   **For optimal 3D performance**: Hardware-accelerated GPU with up-to-date drivers (see [GPU Setup Guide](../docs/GPU_SETUP.md))

**Setup Instructions:**

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd audiorail-rider.0 # Or the name of your cloned directory
    ```
2.  **Install dependencies:**
    ```bash
    pnpm install  # or npm install
    ```
3.  **Configure your Gemini API Key:**
    *   You will need an API key for the Google Gemini API. You can obtain one from the [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   Open the `.env.local` file in the project root.
    *   Replace `PLACEHOLDER_API_KEY` with your actual Gemini API key:
        ```dotenv
        GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
        *Self-note: Ensure you do not commit your API key to public version control.*
4.  **Enable Hardware Acceleration (Important for Performance):**
    *   Open Chrome/Chromium and navigate to `chrome://settings`
    *   Search for "hardware" and enable:
        - **"Use hardware acceleration when available"**
        - **"Use hardware video decode"** (if available)
    *   Restart your browser
    *   Verify at `chrome://gpu` that hardware acceleration is active
    *   For detailed troubleshooting, see the [GPU Setup Guide](../docs/GPU_SETUP.md)
5.  **Run the application:**
    ```bash
    pnpm run dev  # or npm run dev
    ```
    This command will start the development server. Open your web browser and navigate to the address displayed in your terminal (e.g., `http://localhost:5173`).

## 💡 Potential Next Steps

This project offers a robust foundation for a captivating synesthetic experience. Here are some exciting avenues for future development:

1.  **Deeper Audio-Visual Synchronicity:**
    *   **Expand AI Features**: Currently, Gemini receives only `duration` from client-side analysis. Enhance `audioProcessor.ts` to extract more features (e.g., tempo, key changes, percussive events, instrument detection) and pass them to `geminiService.ts` for a more nuanced blueprint generation.
    *   **Dynamic Environment**: Based on the AI-generated `palette` and real-time `Meyda` features (like beat detection or specific frequency bands), dynamically adjust scene elements such as background stars density, ambient lighting, or even abstract particle effects that react to the music's intensity.

2.  **Interactive Ride Experience & Customization:**
    *   **Post-Ride Exploration**: After the ride finishes, enable a free-roam camera mode (`OrbitControls` from `three/examples/jsm/controls/OrbitControls`) to allow users to explore the generated track at their leisure.
    *   **Blueprint Tweaking**: Provide a simple UI for users to modify certain parameters of the generated `RideBlueprint` (e.g., increase/decrease overall intensity, add more loops, change turn radii) and rebuild the track without re-analyzing the audio.

3.  **Performance & Optimization**:
    *   For very long audio files or complex tracks, consider optimizing the `trackBuilder.ts` to reduce the number of Three.js points or using a simpler geometry approach for distant track sections.
    *   Implement level-of-detail (LOD) for the track or environmental elements to maintain smooth frame rates on less powerful hardware.
    *   Explore Web Workers for offloading heavy audio analysis or track generation computations to prevent blocking the main thread.
    *   **Ensure hardware acceleration is enabled** - See the [GPU Setup Guide](../docs/GPU_SETUP.md) if experiencing low FPS or software rendering warnings.

## 🧪 Testing

Run the test suite:

```bash
pnpm test          # Unit tests with Jest
pnpm test:e2e      # End-to-end tests with Playwright
```

For GPU-sensitive E2E tests on systems with hybrid graphics or packaged Chromium, see the [GPU Setup Guide](../docs/GPU_SETUP.md) for environment variables and browser configuration options.
```