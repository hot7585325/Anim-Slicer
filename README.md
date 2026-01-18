# AnimSlicer ✂️

**A visual tool to slice GLB animations and generate config for Three.js / React Three Fiber.**

[Download on [Itch.io]([AnimSlicer](https://hot7585325.itch.io/animslicer-visual-glb-animation-splitter-for-threejs)]

## 💡 Why this tool?

Hard-coding animation timestamps (e.g., `start: 1.2s, end: 3.5s`) in your WebGL project is brittle and tedious. **AnimSlicer** solves this by providing a GUI to define animation clips and exporting them as a structured JSON configuration.

It acts as a **bridge between 3D Artists and Developers**, ensuring that animation logic is data-driven, not hard-coded.

## 🚀 Workflow

1. **Import:** Drag & drop your `.glb` model.
2. **Slice:** Use the visual timeline to define clips (Idle, Run, Attack...).
3. **Export:** Generate a `config.json` and a viewer script.
4. **Integrate:** Use the generated JSON in your Three.js app to automatically slice animations.

## 🛠 Features

- **Visual Preview:** Real-time seeking and looping verification.
- Smart Duration Logic: Automatically sets the start/end time for new clips based on the previous clip's length. Drastically reduces manual slider dragging for uniform animation sheets.
- **Zero Dependencies:** Runs as a standalone portable app (Windows/macOS).
- **Export Formats:**
    - `config.json`: The data source for your app.
    - `index.html`: Instant preview to verify clips before coding.
- **Developer Friendly:** The output logic is vanilla JS, easily adaptable to **React Three Fiber (R3F)** or **A-Frame**.

## 📦 Installation

Go to the [Releases page]([AnimSlicer](https://hot7585325.itch.io/animslicer-visual-glb-animation-splitter-for-threejs) ) to download the latest executable.

## 📄 License

MIT
