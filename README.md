# BeatBot

A rhythm coach for musicians and learners.

BeatBot helps you practice rhythm exercises, track your timing, and improve your consistency. It provides real-time feedback as you play along with a metronome, and detailed stats to help you monitor your progress.

## Features

- **Exercise Selection**  
  Select an exercise to practice from a list of patterns.

- **Playback Controls**  
  Start, stop, and reset exercise playback. A metronome sound will play at your configured BPM.

- **Interactive Timeline**  
  Press keyboard or MIDI keys to match the pattern. Get feedback in real time. After the exercise completes, you can scroll through the timeline to review your performance.

- **Pattern Stats**  
  See stats for each hit in the exercise pattern. Average timing and standard deviation are highlighted, so you can spot areas for improvement.

- **Session Stats**  
  View stats for your current session. Hover over each stat for a description in the bottom toolbar.

- **Tutorial**  
  Access the tutorial anytime for a guided walkthrough of the app.

## Stats Explained

- **Score**  
  Your overall score for the current loop, based on how close your hits were to the targets.

- **Deviation**  
  How consistent your timing was, based on the standard deviation of your hit timings.

- **Early/Late**  
  Whether you tend to hit notes early or late, based on the average of your hit timings.

- **Mistakes**  
  The number of missed or extra hits you made during the loop.

- **Velocity**  
  How consistent your hit velocities were, based on the standard deviation of your hit velocities.

- **BPM**  
  Set the playback tempo in beats per minute (BPM).

- **Bars**  
  Set the number of bars to loop during playback.

- **Zoom**  
  Zoom in and out of the timeline view.

- **BPM History**  
  View your BPM history over time.

## Getting Started

1. **Select an exercise** to practice.
2. **Set your BPM** and other playback options.
3. **Press play** and follow the metronome, matching the pattern using your keyboard or MIDI controller.
4. **Review your stats** and timeline to see where you can improve.
5. **Repeat** and track your progress!

## Developing

```
npm i
npm start
```

## License

MIT