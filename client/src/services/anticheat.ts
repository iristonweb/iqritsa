export interface PlayTelemetry {
  answerTimeMs: number;
  mistakes: number;
  tapsPerSecond: number;
}

export const getSuspicionScore = (telemetry: PlayTelemetry): number => {
  let score = 0;
  if (telemetry.answerTimeMs < 350) score += 40;
  if (telemetry.mistakes === 0 && telemetry.answerTimeMs < 800) score += 25;
  if (telemetry.tapsPerSecond > 18) score += 35;
  return Math.min(100, score);
};

export const isSuspicious = (telemetry: PlayTelemetry) => getSuspicionScore(telemetry) >= 70;
