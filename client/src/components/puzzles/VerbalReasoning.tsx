import { Puzzle } from "../../lib/stores/usePuzzles";

interface Props { puzzle: Puzzle; onAnswer: (a: number) => void; disabled: boolean; }

const SUBTYPE_LABEL: Record<string, string> = {
  odd_one_out: 'НАЙДИТЕ ЛИШНЕЕ',
  synonym:     'НАЙДИТЕ СИНОНИМ',
  antonym:     'НАЙДИТЕ АНТОНИМ',
  category:    'ОПРЕДЕЛИТЕ КАТЕГОРИЮ',
};

export default function VerbalReasoning({ puzzle, onAnswer, disabled }: Props) {
  const q = puzzle.question as {
    key: string; subtype: string; text: string; options: string[]; explanation: string;
  };

  const subtypeLabel = SUBTYPE_LABEL[q.subtype] || 'СЛОВЕСНАЯ ЛОГИКА';

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Subtype badge */}
      <div className="flex justify-center">
        <span style={{
          fontSize: '0.65rem', letterSpacing: '0.15em', fontFamily: 'monospace',
          padding: '3px 12px', borderRadius: 4,
          border: '1px solid rgba(255,215,0,0.35)',
          background: 'rgba(255,215,0,0.07)',
          color: 'rgba(255,215,0,0.85)'
        }}>
          {subtypeLabel}
        </span>
      </div>

      {/* Question */}
      <div style={{
        background: 'rgba(0,0,0,0.45)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 10,
        padding: '14px 16px',
        textAlign: 'center',
      }}>
        <p style={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: '0.95rem',
          fontFamily: 'monospace',
          lineHeight: 1.6,
          margin: 0,
        }}>
          {q.text}
        </p>
      </div>

      {/* Options grid */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => !disabled && onAnswer(idx)}
            disabled={disabled}
            style={{
              padding: '12px 10px',
              borderRadius: 8,
              border: '1px solid rgba(255,215,0,0.3)',
              background: disabled ? 'rgba(255,255,255,0.04)' : 'rgba(255,215,0,0.06)',
              color: 'rgba(255,255,255,0.88)',
              fontSize: '0.85rem',
              fontFamily: 'monospace',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.18s',
              textAlign: 'center',
              lineHeight: 1.4,
            }}
            onMouseEnter={e => {
              if (!disabled) {
                (e.target as HTMLElement).style.background = 'rgba(255,215,0,0.18)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255,215,0,0.7)';
              }
            }}
            onMouseLeave={e => {
              if (!disabled) {
                (e.target as HTMLElement).style.background = 'rgba(255,215,0,0.06)';
                (e.target as HTMLElement).style.borderColor = 'rgba(255,215,0,0.3)';
              }
            }}
          >
            <span style={{ opacity: 0.45, marginRight: 6, fontSize: '0.75rem' }}>
              {['A','B','C','D'][idx]}.
            </span>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
