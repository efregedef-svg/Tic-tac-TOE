import Modal from './ui/Modal';
import Mark from './Mark';
import { ConfirmButton } from './ui/Controls';
import { IconHistory, IconTrash } from './ui/Icons';
import { difficultyLabel } from '../lib/players';
import { timeAgo } from '../lib/time';

function Summary({ history }) {
  const pvc = history.filter((h) => h.mode === 'pvc');
  const won = pvc.filter((h) => h.winner !== 'draw' && !h.players?.[h.winner]?.isAi).length;
  const lost = pvc.filter((h) => h.winner !== 'draw' && h.players?.[h.winner]?.isAi).length;
  const draws = history.filter((h) => h.winner === 'draw').length;
  const tiles = [
    { label: 'Total', value: history.length },
    { label: 'Beat CPU', value: won },
    { label: 'Lost to CPU', value: lost },
    { label: 'Draws', value: draws },
  ];
  return (
    <div className="mb-5 grid grid-cols-4 gap-2">
      {tiles.map((t) => (
        <div key={t.label} className="rounded-xl border border-white/5 bg-white/[0.03] px-2 py-3 text-center">
          <p className="font-display text-xl font-bold tabular-nums">{t.value}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-slate-500">{t.label}</p>
        </div>
      ))}
    </div>
  );
}

function Entry({ entry }) {
  const { winner, players, mode, difficulty, moves, date } = entry;
  const isDraw = winner === 'draw';
  const winnerName = isDraw ? null : players?.[winner]?.name ?? winner;
  const cpuWon = !isDraw && players?.[winner]?.isAi;

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/5">
        {isDraw ? <span className="font-display text-lg font-bold text-slate-400">=</span> : <Mark symbol={winner} animate={false} className="h-6 w-6" strokeWidth={15} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">
          {isDraw ? 'Draw' : `${winnerName} won`}
          {mode === 'pvc' && !isDraw && (
            <span className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${cpuWon ? 'bg-rose-500/15 text-rose-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
              {cpuWon ? 'Loss' : 'Win'}
            </span>
          )}
        </p>
        <p className="truncate text-xs text-slate-400">
          {players?.X?.name} <span className="text-cyan-300">X</span> vs {players?.O?.name} <span className="text-fuchsia-300">O</span>
          {' · '}
          {mode === 'pvc' ? difficultyLabel(difficulty) : 'PvP'} · {moves} moves
        </p>
      </div>
      <span className="shrink-0 text-xs text-slate-500">{timeAgo(date)}</span>
    </li>
  );
}

export default function HistoryModal({ open, onClose, history, onClear }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Match history"
      icon={<IconHistory className="h-5 w-5" />}
      footer={
        history.length > 0 && (
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">Last {history.length} results, stored on this device.</p>
            <ConfirmButton onConfirm={onClear} confirmLabel="Confirm clear">
              <IconTrash className="h-4 w-4" /> Clear
            </ConfirmButton>
          </div>
        )
      }
    >
      {history.length === 0 ? (
        <div className="py-10 text-center">
          <div className="mx-auto mb-4 flex w-fit gap-1 opacity-60">
            <Mark symbol="X" className="h-10 w-10" />
            <Mark symbol="O" className="h-10 w-10" delay={0.2} />
          </div>
          <p className="font-medium">No matches yet</p>
          <p className="mt-1 text-sm text-slate-400">Finished rounds will show up here.</p>
        </div>
      ) : (
        <>
          <Summary history={history} />
          <ul className="space-y-2">
            {history.map((entry) => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </ul>
        </>
      )}
    </Modal>
  );
}
