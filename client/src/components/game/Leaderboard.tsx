import { useEffect, useState } from "react";
import { useMultiplayer, LeaderboardEntry } from "../../lib/stores/useMultiplayer";
import { useChicken } from "../../lib/stores/useChicken";
import { useIQGame } from "../../lib/stores/useIQGame";

const STAGE_NAMES = [
  "НЕСУШКА", "УМНАЯ", "МЫСЛЯЩАЯ", "СТУДЕНТ",
  "ПРОФЕССОР", "ГЕНИЙ", "КОСМОС", "АБС.РАЗУМ"
];

const STAGE_COLORS = [
  '#ffd700','#c0c0c0','#4a9eff','#9b59b6',
  '#1abc9c','#e74c3c','#00d4ff','#ff00ff'
];

const FLAGS: Record<string, string> = {
  RU:'RU', US:'US', DE:'DE', GB:'GB', FR:'FR', JP:'JP', CN:'CN', KR:'KR', BR:'BR',
};

function getRankColor(rank: number) {
  if (rank === 1) return '#ffd700';
  if (rank === 2) return '#c0c0c0';
  if (rank === 3) return '#cd7f32';
  return '#4a9eff44';
}

function getRankLabel(rank: number) {
  if (rank === 1) return '1ST';
  if (rank === 2) return '2ND';
  if (rank === 3) return '3RD';
  return `#${rank}`;
}

export default function Leaderboard() {
  const { leaderboard, leaderboardLoading, fetchLeaderboard, myEntry } = useMultiplayer();
  const { chickenStage, totalSolved, stats } = useChicken();
  const { setGameState } = useIQGame();
  const [filter, setFilter] = useState<'all' | 'stage'>('all');
  const [myRank, setMyRank] = useState<number | null>(null);
  const playerName = useMultiplayer(s => s.playerName);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  useEffect(() => {
    if (myEntry && leaderboard.length) {
      const idx = leaderboard.findIndex(e => e.playerName === myEntry.playerName);
      if (idx >= 0) setMyRank(idx + 1);
    }
  }, [leaderboard, myEntry]);

  const filtered = filter === 'stage'
    ? leaderboard.filter(e => e.stage === chickenStage)
    : leaderboard;

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'rgba(5,5,20,0.95)', fontFamily: "'Courier New', monospace" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: '#00ffff22' }}>
        <div className="flex items-center gap-3">
          <div className="text-xs font-bold tracking-widest" style={{ color: '#00ffff' }}>
            ТАБЛИЦА ЛИДЕРОВ
          </div>
          <div className="text-xs px-2 py-0.5 rounded"
            style={{ background: '#00ffff11', color: '#00ffff66', border: '1px solid #00ffff33' }}>
            {leaderboard.length} ИГРОКОВ
          </div>
        </div>
        <button onClick={() => setGameState('hub')}
          className="text-xs px-3 py-1 rounded tracking-widest transition-all hover:opacity-80"
          style={{ background: '#ffffff11', color: '#ffffff88', border: '1px solid #ffffff22' }}>
          НАЗАД
        </button>
      </div>

      {/* My stats bar */}
      <div className="px-4 py-2 border-b flex items-center gap-4 flex-wrap"
        style={{ borderColor: '#00ffff11', background: '#00ffff06' }}>
        <div className="text-xs" style={{ color: '#00ffff88' }}>МОЙ РЕЗУЛЬТАТ:</div>
        {myEntry ? (
          <>
            <span className="text-xs font-bold" style={{ color: '#00ffff' }}>{myEntry.playerName}</span>
            <span className="text-xs" style={{ color: '#ffd700' }}>{myEntry.score.toLocaleString()} очков</span>
            <span className="text-xs" style={{ color: STAGE_COLORS[myEntry.stage] }}>
              {STAGE_NAMES[myEntry.stage]}
            </span>
            {myRank && (
              <span className="text-xs font-bold" style={{ color: getRankColor(myRank) }}>
                {getRankLabel(myRank)}
              </span>
            )}
          </>
        ) : (
          <span className="text-xs" style={{ color: '#ffffff44' }}>
            {playerName ? `${playerName} — не в рейтинге` : 'Сыграйте в гонку для попадания в рейтинг'}
          </span>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-4 pt-3 pb-2">
        {(['all', 'stage'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="text-xs px-3 py-1 rounded tracking-widest transition-all"
            style={{
              background: filter === f ? '#00ffff22' : '#ffffff08',
              color:      filter === f ? '#00ffff'   : '#ffffff55',
              border: `1px solid ${filter === f ? '#00ffff66' : '#ffffff11'}`,
              boxShadow: filter === f ? '0 0 10px #00ffff22' : 'none'
            }}>
            {f === 'all' ? 'ВСЕ УРОВНИ' : `МОЙ УРОВЕНЬ (${STAGE_NAMES[chickenStage]})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">

        {/* Column headers */}
        <div className="grid text-xs pb-1 pt-1 sticky top-0"
          style={{
            gridTemplateColumns: '48px 1fr 100px 80px 70px 60px',
            color: '#ffffff33',
            borderBottom: '1px solid #ffffff11',
            background: 'rgba(5,5,20,0.98)'
          }}>
          <span>РАНГ</span>
          <span>ИГРОК</span>
          <span className="text-right">ОЧКИ</span>
          <span className="text-right hidden sm:block">РЕШЕНО</span>
          <span className="text-right hidden sm:block">ТОЧНОСТЬ</span>
          <span className="text-right">УРОВЕНЬ</span>
        </div>

        {leaderboardLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-xs tracking-widest animate-pulse" style={{ color: '#00ffff66' }}>
              ЗАГРУЗКА РЕЙТИНГА...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-xs tracking-widest" style={{ color: '#ffffff33' }}>
              НЕТ ЗАПИСЕЙ
            </div>
          </div>
        ) : (
          filtered.map((entry, i) => {
            const rank  = leaderboard.indexOf(entry) + 1;
            const isMe  = myEntry?.playerName === entry.playerName;
            const color = STAGE_COLORS[Math.min(entry.stage, 7)];
            const rc    = getRankColor(rank);

            return (
              <div key={entry.id}
                className="grid items-center py-2 px-2 rounded transition-all"
                style={{
                  gridTemplateColumns: '48px 1fr 100px 80px 70px 60px',
                  background: isMe ? '#00ffff11' : rank <= 3 ? `${rc}08` : '#ffffff04',
                  border: `1px solid ${isMe ? '#00ffff44' : rank <= 3 ? `${rc}33` : '#ffffff08'}`,
                  boxShadow: isMe ? '0 0 12px #00ffff22' : 'none'
                }}>

                {/* Rank */}
                <div className="text-xs font-bold" style={{ color: rc }}>
                  {rank <= 3 ? (
                    <span style={{ textShadow: `0 0 8px ${rc}` }}>{getRankLabel(rank)}</span>
                  ) : getRankLabel(rank)}
                </div>

                {/* Player */}
                <div className="flex items-center gap-2 min-w-0">
                  {entry.country && (
                    <span className="text-xs shrink-0" style={{ color: '#ffffff44' }}>
                      {entry.country}
                    </span>
                  )}
                  <span className="text-xs font-bold truncate"
                    style={{ color: isMe ? '#00ffff' : '#ffffffcc' }}>
                    {entry.playerName}
                    {isMe && <span className="ml-1 text-xs" style={{ color: '#00ffff88' }}>(ВЫ)</span>}
                  </span>
                </div>

                {/* Score */}
                <div className="text-xs font-bold text-right"
                  style={{ color: rank === 1 ? '#ffd700' : '#ffffff99' }}>
                  {entry.score.toLocaleString()}
                </div>

                {/* Solved */}
                <div className="text-xs text-right hidden sm:block" style={{ color: '#ffffff55' }}>
                  {entry.totalSolved}
                </div>

                {/* Accuracy */}
                <div className="text-xs text-right hidden sm:block"
                  style={{ color: entry.accuracy >= 0.9 ? '#00ff88' : entry.accuracy >= 0.7 ? '#ffd700' : '#ff6666' }}>
                  {Math.round(entry.accuracy * 100)}%
                </div>

                {/* Stage */}
                <div className="text-xs font-bold text-right"
                  style={{ color, textShadow: `0 0 6px ${color}` }}>
                  {STAGE_NAMES[Math.min(entry.stage, 7)]}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom: go to race */}
      <div className="px-4 py-3 border-t flex gap-3" style={{ borderColor: '#00ffff22' }}>
        <button onClick={() => setGameState('multiplayer' as any)}
          className="flex-1 py-2 text-xs font-bold tracking-widest rounded transition-all hover:opacity-90"
          style={{
            background: 'linear-gradient(135deg, #00ffff22, #8b5cf622)',
            color: '#00ffff',
            border: '1px solid #00ffff66',
            boxShadow: '0 0 16px #00ffff33'
          }}>
          ИГРАТЬ В ГОНКУ УМОВ
        </button>
      </div>
    </div>
  );
}
