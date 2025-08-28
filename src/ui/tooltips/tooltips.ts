const tooltips = {
  'timeline': 'View the loop structure and hits',
  'pattern': 'View average timing and velocity stats for each hit in the current loop',
  'session-stats': 'View overall stats for your current practice session',
  'score': 'Your overall score for the current loop, based on how close your hits were to the targets',
  'deviation': 'How consistent your timing was, based on the standard deviation of your hit timings',
  'early-late': 'Whether you tend to hit notes early or late, based on the average of your hit timings',
  'mistakes': 'The number of missed or extra hits you made during the loop',
  'velocity': 'How consistent your hit velocities were, based on the standard deviation of your hit velocities',
  'play-button': 'Start, stop, and reset exercise playback',
  'bpm': 'Set the playback tempo in beats per minute (BPM)',
  'bars': 'Set the number of bars to loop during playback',
  'zoom': 'Zoom in and out of the timeline view',
  'bpm-history': 'View your BPM history over time',
  'exercise-select': 'Select different exercises to practice',
} as const;

export type TooltipKey = keyof typeof tooltips;

export function getTooltipText(key: TooltipKey): string {
  return tooltips[key];
}

export const tutorialSteps: TooltipKey[] = [
  'exercise-select',
  'timeline',
  'pattern',
  'session-stats',
  'play-button'
]

export function nextTutorialStep(current: TooltipKey | undefined): TooltipKey | undefined {
  if (!current) return tutorialSteps[0];
  const idx = tutorialSteps.indexOf(current);
  if (idx === -1 || idx === tutorialSteps.length - 1) return undefined;
  return tutorialSteps[idx + 1];
}