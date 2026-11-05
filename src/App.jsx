import { useCallback, useState } from 'react';
import Background from './components/Background';
import TopBar from './components/TopBar';
import WelcomeScreen from './components/WelcomeScreen';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/game/GameScreen';
import SettingsModal from './components/SettingsModal';
import HistoryModal from './components/HistoryModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useSound } from './hooks/useSound';
import { DEFAULT_SETTINGS, DEFAULT_SETUP, MAX_HISTORY, STORAGE_KEYS } from './lib/constants';
import { buildPlayers, normalizeSetup } from './lib/players';
import { playSound } from './lib/sound';

export default function App() {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'setup' | 'game'
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS);
  const [setup, setSetup] = useLocalStorage(STORAGE_KEYS.setup, DEFAULT_SETUP);
  const [history, setHistory] = useLocalStorage(STORAGE_KEYS.history, []);
  const [match, setMatch] = useState(null);
  const [modal, setModal] = useState(null); // 'settings' | 'history' | null
  const play = useSound(settings);

  const updateSettings = useCallback((patch) => setSettings((s) => ({ ...s, ...patch })), [setSettings]);

  const goHome = () => {
    play('click');
    setScreen('welcome');
  };
  const goSetup = useCallback(() => {
    play('click');
    setScreen('setup');
  }, [play]);

  const startMatch = (form) => {
    const clean = normalizeSetup(form);
    setSetup(clean);
    setMatch({ id: Date.now(), mode: clean.mode, difficulty: clean.difficulty, players: buildPlayers(clean) });
    setScreen('game');
    play('start');
  };

  const recordResult = useCallback(
    (entry) => setHistory((h) => [entry, ...(Array.isArray(h) ? h : [])].slice(0, MAX_HISTORY)),
    [setHistory],
  );

  const openModal = (name) => {
    play('click');
    setModal(name);
  };
  const closeModal = useCallback(() => setModal(null), []);

  const toggleSound = () => {
    const next = !settings.sound;
    updateSettings({ sound: next });
    if (next) playSound('toggle', settings.volume);
  };

  return (
    <div className="relative isolate flex min-h-[100dvh] flex-col">
      <Background />
      <TopBar
        showBrand={screen !== 'welcome'}
        soundOn={settings.sound}
        onHome={goHome}
        onToggleSound={toggleSound}
        onHistory={() => openModal('history')}
        onSettings={() => openModal('settings')}
      />

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-8 sm:px-6">
        {screen === 'welcome' && (
          <WelcomeScreen history={history} onPlay={goSetup} onHistory={() => openModal('history')} onSettings={() => openModal('settings')} />
        )}
        {screen === 'setup' && <SetupScreen initial={setup} onStart={startMatch} onBack={goHome} play={play} />}
        {screen === 'game' && match && (
          <GameScreen
            key={match.id}
            match={match}
            settings={settings}
            play={play}
            onRecord={recordResult}
            onNewGame={goSetup}
            inputLocked={modal !== null}
          />
        )}
      </main>

      <footer className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-center text-xs text-slate-600">
        No sign-up needed · Preferences and history are saved on this device
      </footer>

      <SettingsModal
        open={modal === 'settings'}
        onClose={closeModal}
        settings={settings}
        onChange={updateSettings}
        historyCount={history.length}
        onClearHistory={() => setHistory([])}
        onResetPreferences={() => {
          setSettings(DEFAULT_SETTINGS);
          setSetup(DEFAULT_SETUP);
        }}
      />
      <HistoryModal open={modal === 'history'} onClose={closeModal} history={history} onClear={() => setHistory([])} />
    </div>
  );
}
