function initSketch() {
  const sketch = function (p) {
    let oscillator;
    let playing = false;
    let currentNote = -1;
    let tempoMultiplier = 300;
    let draggedNoteIndex = -1;
    let hasTriggered = false;
    let animationTimer = 0;
    let lastHoveredIndex = -1;

    // ... (Keep melody and notePositions exactly as they were)
    let melody = [
      { note: "D4", dur: 3 },
      { note: "B4", dur: 3 },
      { note: "G3", dur: 3 },
      { note: "D3", dur: 3 },
      { note: "E3", dur: 1 },
      { note: "F#3", dur: 1 },
      { note: "G3", dur: 1 },
      { note: "E3", dur: 1.5 },
      { note: "G3", dur: 1.5 },
      { note: "D3", dur: 3 },
      { note: "A4", dur: 3 },
      { note: "D4", dur: 3 },
      { note: "B4", dur: 3 },
      { note: "G3", dur: 3 },
      { note: "E3", dur: 1 },
      { note: "G3", dur: 1 },
      { note: "G3", dur: 1 },
      { note: "A4", dur: 2 },
      { note: "B4", dur: 1 },
      { note: "A4", dur: 3 },
      { note: "B4", dur: 1 },
      { note: "C4", dur: 1 },
      { note: "B4", dur: 1 },
      { note: "A4", dur: 1 },
      { note: "D4", dur: 2 },
      { note: "B4", dur: 1 },
      { note: "A4", dur: 1 },
      { note: "G3", dur: 3 },
      { note: "A4", dur: 1 },
      { note: "B4", dur: 2 },
      { note: "G3", dur: 1 },
      { note: "E3", dur: 2 },
      { note: "G3", dur: 1 },
      { note: "E3", dur: 1 },
      { note: "D3", dur: 3 },
      { note: "E3", dur: 1 },
      { note: "G3", dur: 2 },
      { note: "B4", dur: 1 },
      { note: "A4", dur: 2 },
      { note: "D3", dur: 1 },
      { note: "G3", dur: 2 },
      { note: "B4", dur: 1 },
      { note: "A4", dur: 2 },
      { note: "B4", dur: 1 },
      { note: "C4", dur: 1 },
      { note: "D4", dur: 1 },
      { note: "B4", dur: 1 },
      { note: "G3", dur: 2 },
      { note: "A3", dur: 1 },
      { note: "A3", dur: 1 },
      { note: "G3", dur: 6 },
    ];
    let notePositions = {
      G4: -2,
      "F#4": -1,
      F4: -1,
      E4: 0,
      D4: 1,
      C4: 2,
      B4: -4,
      A4: -3,
      B3: 3,
      A3: 4,
      G3: 5,
      "F#3": 6,
      F3: 6,
      E3: 7,
      D3: 8,
    };

    let celestialSymbols = [
      "@",
      "♪",
      "^",
      "☆",
      "♡",
      "<",
      "#",
      "＊",
      "&",
      "!",
      "+",
      "~",
      "=",
      "?",
      "%",
      "♫",
      "o",
      "•",
      ".",
    ];
    let celestialColors = [];

    p.setup = function () {
      let w = p.windowWidth;
      let h = p.windowHeight;
      // Mobile gets taller canvas to prevent cropping
      let canvasHeight = w < 600 ? h * 0.8 : h * 0.6;
      let cnv = p.createCanvas(w, canvasHeight);
      cnv.parent("sketch-container");

      cnv.style("display", "block");
      cnv.style("max-width", "100%");
      cnv.style("height", "auto");

      p.textAlign(p.CENTER, p.CENTER);
      p.textFont("Doto");
      p.colorMode(p.RGB, 255, 255, 255, 255);
      celestialColors = [
        p.color("#FA36A3"),
        p.color("#6FB5B6"),
        p.color("#D92731"),
      ];

      oscillator = new p5.Oscillator("square");
      oscillator.amp(0);

      for (let n of melody) {
        n.rX = p.random(-12, 12);
        n.rY = p.random(-15, 15);
        n.sizeVar = p.random(0.7, 1.1);
        n.jittOffset = p.random(100);
        n.offsetX = n.offsetY = 0;
        n.hue = p.random(celestialColors);
        n.parallaxMult = p.random(0.02, 0.06);
        n.opacity = 0;
        n.dropOffset = -400;
        n.myPersonalTrinkle = p.random(10, 40);
        n.char = p.random(celestialSymbols);
      }
      layoutNotes();
    };

    function layoutNotes() {
      let w = p.windowWidth;
      let h = p.windowHeight;

      // Proportional calculations instead of rigid breakpoints
      let margin = w * 0.05; // 5% margin on each side
      let maxLineWidth = w - margin * 2;

      // Smaller padding on mobile, larger on desktop
      let topPadding = w < 600 ? h * 0.05 : h * 0.08 + w * 0.02;
      let bottomPadding = w < 600 ? h * 0.08 : h * 0.12 + w * 0.02;

      // Scale row height and symbol size - smaller values on mobile
      let rowHeight = w < 600 ? h * 0.06 : h * 0.08;
      let symbolSize = p.constrain(w * 0.04, 16, 30); // 4% of width, clamped between 16-30

      let y = topPadding;

      // Group notes into rows first to calculate centering
      let rows = [[]];
      let currentRow = 0;
      let currentX = 0;

      for (let n of melody) {
        let noteW = 30 + n.dur * 3; // Smaller note width on mobile
        if (currentX + noteW > maxLineWidth) {
          currentRow++;
          rows[currentRow] = [];
          currentX = 0;
        }
        rows[currentRow].push({ noteRef: n, width: noteW });
        currentX += noteW;
      }

      // Position notes based on row totals
      for (let i = 0; i < rows.length; i++) {
        let totalRowWidth = rows[i].reduce((sum, item) => sum + item.width, 0);
        // Start X is the center of the screen minus half the row width
        let startX = (w - totalRowWidth) / 2;

        let runningX = startX;
        for (let item of rows[i]) {
          let n = item.noteRef;
          // Offset runningX by half the note width because text is CENTER aligned
          n.targetX = runningX + item.width / 2;
          n.targetY = y;
          n.spawnDelay = y * 0.15 + n.myPersonalTrinkle;
          runningX += item.width;
        }
        y += rowHeight;
      }

      // Store symbol size for use in draw
      window.sketchSymbolSize = symbolSize;

      // Calculate minimum needed height for content
      let contentHeight = topPadding + rows.length * rowHeight + bottomPadding;
      // Ensure canvas is at least 80% of viewport height on mobile, 60% on desktop
      let minCanvasHeight = w < 600 ? h * 0.8 : h * 0.6;
      let finalCanvasHeight = Math.max(contentHeight, minCanvasHeight);

      // Resize canvas
      p.resizeCanvas(w, finalCanvasHeight);
    }

    p.windowResized = () => layoutNotes();

    p.draw = function () {
      p.background("#1B191B");
      let scrollPos = window.scrollY;
      window.isHoveringNote = false;

      let canvasRect = p.canvas.getBoundingClientRect();
      if (canvasRect.top < p.windowHeight - 20) hasTriggered = true;
      if (hasTriggered) animationTimer += 4;

      for (let i = 0; i < melody.length; i++) {
        let n = melody[i];

        if (animationTimer > n.spawnDelay) {
          n.dropOffset = p.lerp(n.dropOffset, 0, 0.1);
          n.opacity = p.lerp(n.opacity, 255, 0.1);
        }

        let noteY = n.targetY + (notePositions[n.note] || 8) * 6;
        let scrollEffect = scrollPos * n.parallaxMult;
        let bob = ["♪", "♫"].includes(n.char)
          ? p.sin(p.frameCount * 0.1 + n.jittOffset) * 4
          : 0;

        if (draggedNoteIndex !== i) {
          n.offsetX = p.lerp(n.offsetX, 0, 0.2);
          n.offsetY = p.lerp(n.offsetY, 0, 0.2);
        }

        let fx = n.targetX + n.rX + n.offsetX;
        let fy = noteY + n.rY + bob + n.offsetY + n.dropOffset + scrollEffect;

        n.screenX = fx;
        n.screenY = fy;

        p.push();
        p.translate(fx, fy);

        let isActive = playing && i === currentNote;
        let isMusicNote = ["♪", "♫"].includes(n.char);

        // --- NEW INTERACTION LOGIC ---
        // Only hover if song is NOT playing
        let isHovered = p.dist(p.mouseX, p.mouseY, fx, fy) < 30 && !playing;
        let c = isActive || isMusicNote ? n.hue : p.color("#fcfcfc");

        if (isHovered && isMusicNote) {
          // 1. Pixel Noise Ding (Triggers once per hover)
          if (lastHoveredIndex !== i) {
            oscillator.setType("triangle");
            oscillator.freq(p.random(900, 1300));
            oscillator.amp(0.2, 0);
            oscillator.start();
            oscillator.amp(0, 0.05); // Short 50ms blip
            lastHoveredIndex = i;
          }

          // 2. Visual Transformation
          p.scale(1.4);
          p.rotate(p.sin(p.frameCount * 0.1) * 0.2);
          c = p.lerpColor(c, p.color("#fcfcfc"), 0.4); // Lighten note

          // 3. Play Song Label with Translucent Rectangle
          p.push();
          p.resetMatrix();
          let msg = "play song";
          p.textFont("Fragment Mono");
          p.textSize(14);
          let tw = p.textWidth(msg);

          p.noStroke();
          p.fill(0, 180); // Translucent black
          p.rectMode(p.CENTER);
          p.rect(p.mouseX + 38, p.mouseY - 10, tw + 32, 36, 10);

          p.fill("#fcfcfc");
          p.textAlign(p.CENTER, p.CENTER);
          p.text(msg, p.mouseX + 38, p.mouseY - 10);
          p.pop();
        } else if (lastHoveredIndex === i) {
          lastHoveredIndex = -1; // Reset when mouse leaves
        }
        // --- END NEW INTERACTION LOGIC ---

        p.fill(p.red(c), p.green(c), p.blue(c), n.opacity);
        p.textSize(26 * n.sizeVar);
        p.text(n.char, 0, 0);

        if (isActive) {
          p.fill(p.red(n.hue), p.green(n.hue), p.blue(n.hue), n.opacity);
          p.textSize(16);
          p.text("✧", 20, -20);
          p.text("｡", -20, 20);
          p.text("ﾟ", -25, -10);
          p.text("+", 18, 18);
        }
        p.pop();
      }
    };
    // ... (Keep handleCursor, getHoveredNoteIndex, mousePressed, mouseDragged, etc. the same)
    function handleCursor() {
      let h = getHoveredNoteIndex();
      if (draggedNoteIndex !== -1) p.cursor("grabbing");
      else if (h !== -1)
        p.cursor(["♪", "♫"].includes(melody[h].char) ? "pointer" : "grab");
      else p.cursor("none");
    }
    function getHoveredNoteIndex() {
      for (let i = 0; i < melody.length; i++) {
        if (
          p.dist(p.mouseX, p.mouseY, melody[i].screenX, melody[i].screenY) < 30
        )
          return i;
      }
      return -1;
    }
    p.mousePressed = function () {
      if (p.getAudioContext().state !== "running") p.getAudioContext().resume();
      let i = getHoveredNoteIndex();
      if (i !== -1) {
        if (["♪", "♫"].includes(melody[i].char)) startMusic();
        else draggedNoteIndex = i;
      }
    };
    p.mouseDragged = function () {
      if (draggedNoteIndex !== -1) {
        melody[draggedNoteIndex].offsetX += p.movedX;
        melody[draggedNoteIndex].offsetY += p.movedY;
      }
    };
    p.mouseReleased = () => {
      draggedNoteIndex = -1;
    };
    function startMusic() {
      if (playing) return;
      playing = true;
      oscillator.start();
      playNote(0);
    }
    function playNote(i) {
      if (i >= melody.length) {
        oscillator.amp(0, 0.2);
        setTimeout(() => {
          oscillator.stop();
          playing = false;
          currentNote = -1;
        }, 200);
        return;
      }
      currentNote = i;
      let n = melody[i];
      oscillator.freq(noteToFreq(n.note));
      oscillator.amp(0.3, 0.05);
      setTimeout(
        () => {
          oscillator.amp(0, 0.05);
          n.char = p.random(celestialSymbols);
        },
        n.dur * tempoMultiplier - 50,
      );
      setTimeout(() => playNote(i + 1), n.dur * tempoMultiplier);
    }
    function noteToFreq(n) {
      return {
        D3: 146.83,
        E3: 164.81,
        F3: 174.61,
        "F#3": 185,
        G3: 196,
        A3: 220,
        B3: 246.94,
        C4: 261.63,
        D4: 293.66,
        E4: 329.63,
        F4: 349.23,
        "F#4": 369.99,
        G4: 392,
        A4: 440,
        B4: 493.88,
      }[n];
    }
  };
  new p5(sketch);
}

initSketch();
