import { useState, useEffect, useRef, useCallback } from "react";
import { useMultiplayer } from "../../lib/stores/useMultiplayer";
import { useChicken } from "../../lib/stores/useChicken";
import { useIQGame } from "../../lib/stores/useIQGame";
import { generatePuzzle } from "../../lib/puzzleGenerator";
import type { Puzzle } from "../../lib/stores/usePuzzles";

const STAGE_NAMES = [
  "ЗЁРНЫШКИ","ЦЫПЛЯЧЬЯ ТРОПА","ГНЕЗДО МУДРОСТИ","КУРИНЫЙ УНИ",
  "ФАКУЛЬТЕТ ЛОГИКИ","ЛАБОРАТОРИЯ ГЕНИЯ","КОСМОС ИНТЕЛЛЕКТ","АБС. РАЗУМ"
];
const STAGE_COLORS = [
  '#ffd700','#c0c0c0','#4a9eff','#9b59b6',
  '#1abc9c','#e74c3c','#00d4ff','#ff00ff'
];

const PUZZLE_TYPES = [
  'logic_sequence','math_problem','analogies',
  'spatial_thinking','probability','cryptarithmetic'
];

const TOTAL_QUESTIONS = 10;
const QUESTION_TIME   = 30; // seconds per question

// ── Lobby ──────────────────────────────────────────────────────────────────
function Lobby() {
  const { players, roomId, setReady, leaveRace, sendChat, chatMessages, raceStage } = useMultiplayer();
  const { setGameState } = useIQGame();
  const [chatText, setChatText] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const color = STAGE_COLORS[Math.min(raceStage, 7)];
  const myId  = useMultiplayer(s => s.playerId);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: 99999 });
  }, [chatMessages]);

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    sendChat(chatText.trim());
    setChatText('');
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Room header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold tracking-widest" style={{ color }}>
            КОМНАТА: {roomId}
          </div>
          <div className="text-xs mt-0.5" style={{ color: '#ffffff44' }}>
            УРОВЕНЬ: {STAGE_NAMES[Math.min(raceStage, 7)]}
          </div>
        </div>
        <button onClick={() => { leaveRace(); setGameState('hub'); }}
          className="text-xs px-3 py-1 rounded"
          style={{ background: '#ff336622', color: '#ff6666', border: '1px solid #ff336644' }}>
          ВЫЙТИ
        </button>
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        {/* Players */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="text-xs tracking-widest mb-1" style={{ color: '#ffffff55' }}>
            ИГРОКИ ({players.length})
          </div>
          {players.map(p => (
            <div key={p.id} className="flex items-center gap-3 px-3 py-2 rounded"
              style={{
                background: p.id === myId ? `${color}15` : '#ffffff08',
                border: `1px solid ${p.id === myId ? color + '44' : '#ffffff11'}`
              }}>
              <div className="w-2 h-2 rounded-full"
                style={{ background: p.ready ? '#00ff88' : '#ffffff33',
                  boxShadow: p.ready ? '0 0 6px #00ff88' : 'none' }}/>
              <span className="text-xs font-bold flex-1" style={{ color: p.id === myId ? color : '#ffffffcc' }}>
                {p.name}
                {p.id === myId && <span style={{ color: color+'88' }}> (вы)</span>}
              </span>
              <span className="text-xs" style={{ color: p.ready ? '#00ff88' : '#ffffff44' }}>
                {p.ready ? 'ГОТОВ' : 'ЖДЁТ'}
              </span>
            </div>
          ))}

          <div className="mt-auto pt-4">
            <button onClick={setReady}
              className="w-full py-3 text-sm font-bold tracking-widest rounded transition-all hover:opacity-90"
              style={{
                background: `linear-gradient(135deg, ${color}33, ${color}11)`,
                color, border: `1px solid ${color}88`,
                boxShadow: `0 0 20px ${color}44`
              }}>
              ГОТОВ К ГОНКЕ
            </button>
            <div className="text-xs text-center mt-2" style={{ color: '#ffffff33' }}>
              Гонка начнётся когда все игроки будут готовы
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="w-52 flex flex-col gap-2 hidden sm:flex">
          <div className="text-xs tracking-widest" style={{ color: '#ffffff55' }}>ЧАТ</div>
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-1 min-h-0"
            style={{ maxHeight: '240px' }}>
            {chatMessages.length === 0 ? (
              <div className="text-xs" style={{ color: '#ffffff22' }}>Сообщений нет...</div>
            ) : chatMessages.map((m, i) => (
              <div key={i} className="text-xs">
                <span style={{ color }}>{m.from}: </span>
                <span style={{ color: '#ffffffaa' }}>{m.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleChat} className="flex gap-1">
            <input value={chatText} onChange={e => setChatText(e.target.value)}
              placeholder="Сообщение..."
              className="flex-1 text-xs px-2 py-1 rounded outline-none min-w-0"
              style={{ background: '#ffffff0a', color: '#ffffffcc', border: '1px solid #ffffff22' }}
              maxLength={80}/>
            <button type="submit" className="text-xs px-2 py-1 rounded"
              style={{ background: `${color}33`, color }}>
              OK
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Racing ─────────────────────────────────────────────────────────────────
function Racing() {
  const { players, raceStage, playerId, sendAnswer, sendFinish } = useMultiplayer();
  const { submitScore, playerName } = useMultiplayer();
  const [qIndex, setQIndex]       = useState(0);
  const [puzzle, setPuzzle]       = useState<Puzzle | null>(null);
  const [timeLeft, setTimeLeft]   = useState(QUESTION_TIME);
  const [answered, setAnswered]   = useState(false);
  const [lastCorrect, setLast]    = useState<boolean | null>(null);
  const [myScore, setMyScore]     = useState(0);
  const [inputVal, setInputVal]   = useState('');
  const [lastKey, setLastKey]     = useState<string | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const color    = STAGE_COLORS[Math.min(raceStage, 7)];

  const nextPuzzle = useCallback((idx: number) => {
    if (idx >= TOTAL_QUESTIONS) {
      sendFinish();
      return;
    }
    const type = PUZZLE_TYPES[idx % PUZZLE_TYPES.length];
    const p    = generatePuzzle(type, raceStage, lastKey);
    setLastKey((p.question as any).key);
    setPuzzle(p);
    setTimeLeft(QUESTION_TIME);
    setAnswered(false);
    setLast(null);
    setInputVal('');
  }, [raceStage, lastKey, sendFinish]);

  useEffect(() => { nextPuzzle(0); }, []);

  useEffect(() => {
    if (answered) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleSubmit(null); // timeout = wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [qIndex, answered]);

  const handleSubmit = (userAnswer: any) => {
    if (answered || !puzzle) return;
    clearInterval(timerRef.current!);
    setAnswered(true);

    const correct = userAnswer !== null && String(userAnswer) === String(puzzle.answer);
    const points  = correct ? Math.round(100 + timeLeft * 3) : 0;
    setLast(correct);
    if (correct) setMyScore(s => s + points);
    sendAnswer(correct, points);

    setTimeout(() => {
      const next = qIndex + 1;
      setQIndex(next);
      nextPuzzle(next);
    }, 1200);
  };

  if (!puzzle) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-xs animate-pulse" style={{ color: '#00ffff66' }}>ЗАГРУЗКА...</div>
    </div>
  );

  const isChoice = ['raven_matrix','analogies','spatial_thinking','probability'].includes(puzzle.type);
  const opts      = (puzzle.question as any).options as string[] | undefined;

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      {/* Top bar */}
      <div className="flex items-center gap-4">
        {/* Progress */}
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#ffffff55' }}>
            <span>ВОПРОС {Math.min(qIndex + 1, TOTAL_QUESTIONS)} / {TOTAL_QUESTIONS}</span>
            <span style={{ color: myScore > 0 ? color : '#ffffff55' }}>{myScore} ОЧК</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#ffffff11' }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${(qIndex / TOTAL_QUESTIONS) * 100}%`, background: color,
                boxShadow: `0 0 8px ${color}` }}/>
          </div>
        </div>

        {/* Timer */}
        <div className="text-lg font-bold w-12 text-center"
          style={{
            color: timeLeft <= 10 ? '#ff3366' : timeLeft <= 20 ? '#ffd700' : '#00ffff',
            textShadow: `0 0 10px currentColor`,
            fontVariantNumeric: 'tabular-nums'
          }}>
          {timeLeft}s
        </div>
      </div>

      {/* Scoreboard strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
          <div key={p.id} className="flex items-center gap-1.5 px-2 py-1 rounded shrink-0"
            style={{
              background: p.id === playerId ? `${color}22` : '#ffffff08',
              border: `1px solid ${p.id === playerId ? color+'55' : '#ffffff11'}`
            }}>
            <span className="text-xs" style={{ color: '#ffd700' }}>#{i+1}</span>
            <span className="text-xs" style={{ color: p.id === playerId ? color : '#ffffffaa' }}>
              {p.name.slice(0,10)}
            </span>
            <span className="text-xs font-bold" style={{ color: '#ffffffcc' }}>{p.score}</span>
            {p.finished && <span className="text-xs" style={{ color: '#00ff88' }}>✓</span>}
          </div>
        ))}
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col gap-4 justify-center">
        <div className="text-xs tracking-widest px-1" style={{ color: color + '88' }}>
          {puzzle.type === 'logic_sequence'   ? 'ЧИСЛОВОЙ РЯД' :
           puzzle.type === 'math_problem'     ? 'МАТЕМАТИКА' :
           puzzle.type === 'analogies'        ? 'АНАЛОГИЯ' :
           puzzle.type === 'spatial_thinking' ? 'ПРОСТРАНСТВО' :
           puzzle.type === 'probability'      ? 'ВЕРОЯТНОСТЬ' :
           puzzle.type === 'cryptarithmetic'  ? 'ШИФР-АРИФМЕТИКА' : 'ЗАДАЧА'}
        </div>

        <div className="px-4 py-4 rounded-lg"
          style={{
            background: answered
              ? lastCorrect ? '#00ff8811' : '#ff336611'
              : '#ffffff08',
            border: `1px solid ${answered ? (lastCorrect ? '#00ff8844' : '#ff336644') : '#ffffff15'}`,
            transition: 'all 0.3s'
          }}>
          {puzzle.type === 'logic_sequence' ? (
            <div>
              <div className="text-sm mb-3" style={{ color: '#ffffffcc' }}>Найдите следующее число:</div>
              <div className="flex items-center gap-2 flex-wrap">
                {((puzzle.question as any).sequence as number[]).map((n: number, i: number) => (
                  <div key={i} className="px-3 py-1.5 rounded text-base font-bold"
                    style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>
                    {n}
                  </div>
                ))}
                <div className="px-3 py-1.5 rounded text-base font-bold animate-pulse"
                  style={{ background: '#ffffff11', color: '#ffffff55', border: '1px dashed #ffffff33' }}>
                  ?
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm leading-relaxed" style={{ color: '#ffffffcc' }}>
              {(puzzle.question as any).text || (puzzle.question as any).desc || (puzzle.question as any).eq}
            </div>
          )}

          {answered && (
            <div className="mt-3 text-sm font-bold"
              style={{ color: lastCorrect ? '#00ff88' : '#ff6666' }}>
              {lastCorrect ? `ВЕРНО! +${Math.round(100 + timeLeft * 3)} очков` : `НЕВЕРНО. Ответ: ${puzzle.answer}`}
            </div>
          )}
        </div>

        {/* Answer input */}
        {!answered && (
          isChoice && opts ? (
            <div className="grid grid-cols-2 gap-2">
              {opts.map((opt, i) => (
                <button key={i} onClick={() => handleSubmit(i)}
                  className="py-2.5 px-3 text-xs rounded text-left transition-all hover:opacity-90"
                  style={{
                    background: '#ffffff0a',
                    color: '#ffffffcc',
                    border: '1px solid #ffffff22'
                  }}>
                  <span style={{ color: color, marginRight: 6 }}>
                    {String.fromCharCode(65 + i)}.
                  </span>
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleSubmit(inputVal); }}
              className="flex gap-2">
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                inputMode="numeric"
                autoFocus
                placeholder="Введите ответ..."
                className="flex-1 px-3 py-2.5 text-sm rounded outline-none"
                style={{ background: '#ffffff0a', color: '#ffffffcc', border: `1px solid ${color}55` }}
              />
              <button type="submit"
                className="px-5 py-2.5 text-sm font-bold rounded transition-all"
                style={{ background: `${color}33`, color, border: `1px solid ${color}66` }}>
                OK
              </button>
            </form>
          )
        )}
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────────────
function Results() {
  const { raceResults, leaveRace, playerName, raceStage, submitScore } = useMultiplayer();
  const { setGameState } = useIQGame();
  const { totalSolved, stats } = useChicken();
  const submitted = useRef(false);

  useEffect(() => {
    const myResult = raceResults.find(r => r.name === playerName);
    if (myResult && !submitted.current) {
      submitted.current = true;
      const accuracy = myResult.solved / Math.max(TOTAL_QUESTIONS, 1);
      submitScore({
        playerName,
        score: myResult.score,
        stage: raceStage,
        totalSolved: myResult.solved,
        accuracy,
        avgTime: 15,
        country: '',
      });
    }
  }, []);

  const color = STAGE_COLORS[Math.min(raceStage, 7)];

  return (
    <div className="flex flex-col h-full p-4 gap-4">
      <div className="text-center">
        <div className="text-lg font-bold tracking-widest mb-1"
          style={{ color, textShadow: `0 0 16px ${color}` }}>
          ГОНКА ЗАВЕРШЕНА
        </div>
        <div className="text-xs" style={{ color: '#ffffff44' }}>
          {STAGE_NAMES[Math.min(raceStage, 7)]}
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {raceResults.map((r, i) => {
          const rc   = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#ffffff55';
          const isMe = r.name === playerName;
          return (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded"
              style={{
                background: isMe ? `${color}18` : '#ffffff06',
                border: `1px solid ${isMe ? color+'55' : rc+'22'}`,
                boxShadow: i === 0 ? `0 0 20px ${rc}22` : 'none'
              }}>
              <div className="text-xl font-bold w-10 text-center"
                style={{ color: rc, textShadow: `0 0 8px ${rc}` }}>
                {i === 0 ? '1ST' : i === 1 ? '2ND' : i === 2 ? '3RD' : `#${i+1}`}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold" style={{ color: isMe ? color : '#ffffffcc' }}>
                  {r.name} {isMe && <span style={{ color: color+'88', fontSize: 10 }}>(вы)</span>}
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#ffffff55' }}>
                  {r.solved} из {TOTAL_QUESTIONS} правильно
                </div>
              </div>
              <div className="text-base font-bold" style={{ color: rc }}>
                {r.score.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={() => { leaveRace(); setGameState('leaderboard' as any); }}
          className="flex-1 py-2.5 text-xs font-bold tracking-widest rounded"
          style={{ background: '#00ffff22', color: '#00ffff', border: '1px solid #00ffff55' }}>
          РЕЙТИНГ
        </button>
        <button onClick={() => { leaveRace(); setGameState('multiplayer' as any); }}
          className="flex-1 py-2.5 text-xs font-bold tracking-widest rounded"
          style={{ background: `${color}22`, color, border: `1px solid ${color}55` }}>
          ЕЩЁЁ ГОНКУ
        </button>
        <button onClick={() => { leaveRace(); setGameState('hub'); }}
          className="flex-1 py-2.5 text-xs font-bold tracking-widest rounded"
          style={{ background: '#ffffff0a', color: '#ffffffaa', border: '1px solid #ffffff22' }}>
          В МЕНЮ
        </button>
      </div>
    </div>
  );
}

// ── Setup screen ───────────────────────────────────────────────────────────
function Setup() {
  const { setGameState } = useIQGame();
  const { joinRace, playerName, setPlayerName, raceStage, setRaceStage } = useMultiplayer();
  const { chickenStage } = useChicken();
  const [name, setName]       = useState(playerName || '');
  const [room, setRoom]       = useState('global');
  const [customRoom, setCustom] = useState('');
  const [error, setError]     = useState('');

  const color = STAGE_COLORS[Math.min(raceStage, 7)];

  const handleJoin = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Введите имя игрока'); return; }
    setPlayerName(trimmed);
    const roomId = room === 'custom' ? (customRoom.trim() || 'global') : room;
    joinRace(roomId, trimmed, raceStage);
  };

  const rooms = [
    { id: 'global',   label: 'ОБЩАЯ КОМНАТА',  desc: 'До 8 игроков' },
    { id: 'quick',    label: 'БЫСТРЫЙ МАТЧ',   desc: '2 игрока' },
    { id: 'custom',   label: 'СВОЯ КОМНАТА',   desc: 'Введите ID' },
  ];

  return (
    <div className="flex flex-col h-full p-4 gap-5">
      <div className="flex items-center justify-between">
        <div className="text-sm font-bold tracking-widest" style={{ color: '#00ffff' }}>
          ГОНКА УМОВ
        </div>
        <button onClick={() => setGameState('hub')}
          className="text-xs px-3 py-1 rounded"
          style={{ background: '#ffffff11', color: '#ffffff55', border: '1px solid #ffffff22' }}>
          НАЗАД
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {/* Name */}
        <div>
          <label className="text-xs tracking-widest block mb-2" style={{ color: '#ffffff55' }}>
            ИМЯ ИГРОКА
          </label>
          <input value={name} onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="Введите имя..."
            maxLength={20}
            className="w-full px-3 py-2.5 text-sm rounded outline-none"
            style={{ background: '#ffffff0a', color: '#ffffffcc', border: '1px solid #00ffff44' }}/>
          {error && <div className="text-xs mt-1" style={{ color: '#ff6666' }}>{error}</div>}
        </div>

        {/* Stage */}
        <div>
          <label className="text-xs tracking-widest block mb-2" style={{ color: '#ffffff55' }}>
            УРОВЕНЬ СЛОЖНОСТИ
          </label>
          <div className="grid grid-cols-4 gap-2">
            {STAGE_NAMES.map((n, i) => (
              <button key={i} onClick={() => setRaceStage(i)}
                className="py-2 text-xs rounded text-center transition-all"
                style={{
                  background: raceStage === i ? `${STAGE_COLORS[i]}33` : '#ffffff08',
                  color:      raceStage === i ?  STAGE_COLORS[i]       : '#ffffff55',
                  border: `1px solid ${raceStage === i ? STAGE_COLORS[i]+'66' : '#ffffff11'}`,
                  boxShadow:  raceStage === i ? `0 0 10px ${STAGE_COLORS[i]}44` : 'none',
                  fontSize: 9
                }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Room */}
        <div>
          <label className="text-xs tracking-widest block mb-2" style={{ color: '#ffffff55' }}>
            ВЫБОР КОМНАТЫ
          </label>
          <div className="space-y-2">
            {rooms.map(r => (
              <button key={r.id} onClick={() => setRoom(r.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded transition-all text-left"
                style={{
                  background: room === r.id ? `${color}22` : '#ffffff08',
                  color:      room === r.id ?  color       : '#ffffffcc',
                  border: `1px solid ${room === r.id ? color+'55' : '#ffffff11'}`
                }}>
                <span className="text-xs font-bold">{r.label}</span>
                <span className="text-xs" style={{ color: '#ffffff44' }}>{r.desc}</span>
              </button>
            ))}
          </div>
          {room === 'custom' && (
            <input value={customRoom} onChange={e => setCustom(e.target.value)}
              placeholder="ID комнаты (придумайте любой)..."
              className="w-full mt-2 px-3 py-2 text-sm rounded outline-none"
              style={{ background: '#ffffff0a', color: '#ffffffcc', border: `1px solid ${color}44` }}
              maxLength={32}/>
          )}
        </div>
      </div>

      <button onClick={handleJoin}
        className="w-full py-3.5 text-sm font-bold tracking-widest rounded transition-all hover:opacity-90"
        style={{
          background: `linear-gradient(135deg, ${color}33, ${color}11)`,
          color, border: `1px solid ${color}88`,
          boxShadow: `0 0 24px ${color}44`
        }}>
        ВОЙТИ В КОМНАТУ
      </button>
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────
export default function MultiplayerRace() {
  const { racePhase } = useMultiplayer();

  const content =
    racePhase === 'lobby'   ? <Lobby />   :
    racePhase === 'racing'  ? <Racing />  :
    racePhase === 'results' ? <Results /> :
    <Setup />;

  return (
    <div className="flex flex-col h-full overflow-hidden"
      style={{ background: 'rgba(5,5,20,0.95)', fontFamily: "'Courier New', monospace" }}>
      {content}
    </div>
  );
}
