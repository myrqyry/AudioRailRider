import React from 'react';
import { useValidatedAppState } from './hooks/useValidatedAppState';
import { useAppInitialization } from './hooks/useAppInitialization';
import AppUIRenderer from './components/AppUIRenderer';
import DevPanel from './components/DevPanel';

const App: React.FC = React.memo(() => {
    useAppInitialization();
    const appState = useValidatedAppState();

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-[url('/stardust.png')] opacity-20"></div>
            <AppUIRenderer {...appState} />
            <DevPanel />
        </main>
    );
});

export default App;
