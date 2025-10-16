# AudioRail Rider

AudioRail Rider is an immersive web application that transforms any audio track into a dynamic, navigable 3D rollercoaster experience. By analyzing the audio's rhythm, energy, and tonal qualities, it procedurally generates a unique ride through a synesthetic landscape, allowing you to inhabit the soul of a song.

## Features

-   **Dynamic Ride Generation**: The backend, powered by FastAPI and the Gemini API, analyzes audio files to create a "blueprint" of a rollercoaster track. This blueprint defines the twists, turns, drops, and loops of the ride, all synchronized to the music.
-   **Immersive 3D Visualization**: The frontend, built with React and Three.js, renders the rollercoaster and its environment in real-time. It features a dynamic skybox, particle effects, and other visuals that react to the audio.
-   **Real-time Audio Analysis**: The application can perform real-time audio analysis in the browser using a custom AudioWorklet, providing low-latency visual feedback that is tightly coupled to the music.
-   **Developer-Friendly**: The project is a monorepo managed with pnpm, with a clear separation between the frontend and backend. It includes a development panel for real-time tweaking of visual parameters.

## Getting Started

### Prerequisites

-   Node.js (v16 or later)
-   pnpm
-   Python 3.9+ and Poetry
-   A Gemini API key

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/audiorail-rider.git
    cd audiorail-rider
    ```

2.  **Install dependencies:**

    This project uses `pnpm` as a package manager for the monorepo. The `install:all` script in the root `package.json` will install dependencies for both the frontend and backend.

    ```bash
    pnpm install:all
    ```

3.  **Set up environment variables:**

    -   **Backend**: Copy the `.env.example` file in the `backend` directory to a new file named `.env` and add your Gemini API key:

        ```
        GEMINI_API_KEY="your_gemini_api_key"
        ```

    -   **Frontend**: The frontend does not require a separate `.env` file for standard operation, as it communicates with the backend proxy.

### Running the Application

To run both the frontend and backend development servers concurrently, use the `dev` script in the root `package.json`:

```bash
pnpm dev
```

This will start:

-   The **frontend** development server on `http://localhost:5173`
-   The **backend** API server on `http://localhost:8000`

You can then access the application by opening `http://localhost:5173` in your browser.

## Project Structure

The repository is organized as a monorepo with two main packages:

-   `frontend/`: The React/Three.js web application.
-   `backend/`: The FastAPI backend service.

Each package has its own `README.md` file with more detailed information about its structure and development.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.