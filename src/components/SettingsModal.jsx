import Modal from './ui/Modal';
import { ConfirmButton, Segmented, Toggle } from './ui/Controls';
import { IconSettings, IconTrash } from './ui/Icons';
import { AI_SPEEDS } from '../lib/constants';
import { playSound } from '../lib/sound';

function Row({ title, desc, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="font-medium text-slate-100">{title}</p>
        {desc && <p className="mt-0.5 text-sm text-slate-400">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <section className="mb-6 last:mb-0">
      <h3 className="label mb-1">{label}</h3>
      <div className="divide-y divide-white/5">{children}</div>
    </section>
  );
}

export default function SettingsModal({ open, onClose, settings, onChange, historyCount, onClearHistory, onResetPreferences }) {
  const volumePct = Math.round(settings.volume * 100);

  return (
    <Modal open={open} onClose={onClose} title="Settings" icon={<IconSettings className="h-5 w-5" />}>
      <Group label="Sound">
        <Row title="Sound effects" desc="Moves, wins and menu clicks.">
          <Toggle
            label="Sound effects"
            checked={settings.sound}
            onChange={(sound) => {
              onChange({ sound });
              if (sound) playSound('toggle', settings.volume);
            }}
          />
        </Row>
        <Row title="Volume" desc={settings.sound ? `${volumePct}%` : 'Muted'}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            aria-label="Volume"
            className="slider w-32 sm:w-40"
            style={{ '--fill': `${volumePct}%` }}
            value={settings.volume}
            disabled={!settings.sound}
            onChange={(e) => onChange({ volume: Number(e.target.value) })}
            onPointerUp={(e) => playSound('x', Number(e.currentTarget.value))}
            onKeyUp={(e) => playSound('x', Number(e.currentTarget.value))}
          />
        </Row>
      </Group>

      <Group label="Gameplay">
        <Row title="Alternate first move" desc="Players take turns starting each new round.">
          <Toggle label="Alternate first move" checked={settings.alternateStart} onChange={(alternateStart) => onChange({ alternateStart })} />
        </Row>
        <Row title="Computer speed" desc="How long the AI 'thinks'.">
          <Segmented label="Computer speed" options={AI_SPEEDS} value={settings.aiSpeed} onChange={(aiSpeed) => onChange({ aiSpeed })} />
        </Row>
      </Group>

      <Group label="Data">
        <Row title="Match history" desc={`${historyCount} saved ${historyCount === 1 ? 'match' : 'matches'} on this device.`}>
          <ConfirmButton onConfirm={onClearHistory} disabled={historyCount === 0} confirmLabel="Confirm">
            <IconTrash className="h-4 w-4" /> Clear
          </ConfirmButton>
        </Row>
        <Row title="Reset preferences" desc="Restore default settings and player setup.">
          <ConfirmButton onConfirm={onResetPreferences} confirmLabel="Confirm">
            Reset
          </ConfirmButton>
        </Row>
      </Group>
    </Modal>
  );
}
