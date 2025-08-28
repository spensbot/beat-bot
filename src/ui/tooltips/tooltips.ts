const tooltips = {
  'exercise-select': 'Select an exercise to practice.',
  'play-button': 'Start, stop, and reset exercise playback. A metronome sound with play at the configured BPM.',
  'timeline': 'Press keyboard or midi keys to match the pattern. Get feedback in real time. You can scroll through the timeline after the exercise completes.',
  'pattern': 'Stats for each hit in the exercise pattern. Average timing and standard deviation show in red.',
  'session-stats': 'View stats for the current session. Hover over each stat for a description in the bottom toolbar.',
  'tutorial': 'View the tutorial again anytime',

  'score': 'Your overall score for the current loop, based on how close your hits were to the targets',
  'deviation': 'How consistent your timing was, based on the standard deviation of your hit timings',
  'early-late': 'Whether you tend to hit notes early or late, based on the average of your hit timings',
  'mistakes': 'The number of missed or extra hits you made during the loop',
  'velocity': 'How consistent your hit velocities were, based on the standard deviation of your hit velocities',
  'bpm': 'Set the playback tempo in beats per minute (BPM)',
  'bars': 'Set the number of bars to loop during playback',
  'zoom': 'Zoom in and out of the timeline view',
  'bpm-history': 'View your BPM history over time'
} as const;

export type TooltipKey = keyof typeof tooltips;

export function getTooltipText(key: TooltipKey): string {
  return tooltips[key];
}

export const tutorialSteps: TooltipKey[] = [
  'exercise-select',
  'play-button',
  'timeline',
  'pattern',
  'session-stats',
  'tutorial'
]

export function nextTutorialStep(current: TooltipKey | undefined): TooltipKey | undefined {
  if (!current) return tutorialSteps[0];
  const idx = tutorialSteps.indexOf(current);
  if (idx === -1 || idx === tutorialSteps.length - 1) return undefined;
  return tutorialSteps[idx + 1];
}