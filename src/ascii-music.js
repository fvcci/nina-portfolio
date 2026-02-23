function initAsciiMusic() {
  const sketch = function (p) {
    let img;
    let symbols = [
      "@",
      "#",
      "&",
      "＊",
      "%",
      "♫",
      "♪",
      "!",
      "+",
      "=",
      "?",
      "^",
      "☆",
      "♡",
      "<",
      "o",
      "•",
      ".",
      "~",
    ];
    let stepSize = 9;
    let t = 0;
    let asciiAmount = 1;
    let transitionDuration = 8;
    let startTime;
    let imgLoaded = false;

    p.preload = function () {
      let isMobile = p.windowWidth < 768;
      let resizeFactor = isMobile ? 8 : 3.5;
      img = p.loadImage(
        "music.png",
        () => {
          console.log("Image loaded successfully");
          img.resize(img.width / resizeFactor, img.height / resizeFactor);
          imgLoaded = true;
        },
        () => {
          console.error("Failed to load image");
        },
      );
    };

    p.setup = function () {
      let isMobile = p.windowWidth < 768;
      stepSize = isMobile ? 6 : 9;
      let displayWidth = isMobile ? p.windowWidth : 800;
      let displayHeight = isMobile ? p.windowWidth * 0.5 : 400;
      let cnv = p.createCanvas(displayWidth, displayHeight);
      cnv.parent("ascii-music-container");
      p.textFont("Doto");
      p.textSize(stepSize);
      p.noStroke();
      startTime = p.millis() / 1000;
      console.log("Canvas created:", displayWidth, displayHeight);
    };

    p.windowResized = function () {
      let isMobile = p.windowWidth < 768;
      let displayWidth = isMobile ? p.windowWidth : 800;
      let displayHeight = isMobile ? p.windowWidth * 0.5 : 400;
      p.resizeCanvas(displayWidth, displayHeight);
    };

    p.draw = function () {
      p.background("#fcfcfc");

      if (!imgLoaded || !img) {
        p.fill(0);
        p.text("Loading...", p.width / 2, p.height / 2);
        return;
      }

      img.loadPixels();
      t += 0.03;

      let offsetX = (p.width - img.width) / 2;
      let offsetY = (p.height - img.height) / 2;

      let elapsed = p.millis() / 1000 - startTime;

      // Loop: reset when cycle completes
      if (elapsed >= transitionDuration * 2) {
        startTime = p.millis() / 1000;
        elapsed = 0;
      }

      // First half: ascii dissolves in → out (asciiAmount 1 → 0)
      // Second half: ascii builds back up (asciiAmount 0 → 1)
      let halfDuration = transitionDuration;
      if (elapsed < halfDuration) {
        let progress = elapsed / halfDuration;
        asciiAmount = p.pow(1 - progress, 2.5);
        // Clamp so it never drops to near zero (stays ascii always)
        asciiAmount = p.max(asciiAmount, 0.15);
      } else {
        let progress = (elapsed - halfDuration) / halfDuration;
        asciiAmount = p.pow(progress, 2.5);
        asciiAmount = p.max(asciiAmount, 0.15);
      }

      // Mouse influence: normalize mouse position to [0,1]
      let mx = p.constrain(p.mouseX / p.width, 0, 1);
      let my = p.constrain(p.mouseY / p.height, 0, 1);

      // Mouse drives extra animation speed and symbol chaos
      let mouseSpeed = p.lerp(1, 4, mx);
      let mouseChaos = p.lerp(0, 80, my);
      let mouseStepMod = p.lerp(1.0, 1.8, mx); // denser grid near right

      for (let imgY = 0; imgY < img.height; imgY += stepSize) {
        for (let imgX = 0; imgX < img.width; imgX += stepSize) {
          let index = (imgX + imgY * img.width) * 4;
          let r = img.pixels[index];
          let g = img.pixels[index + 1];
          let b = img.pixels[index + 2];
          let brightnessVal = (r + g + b) / 3;

          let canvasX = imgX + offsetX;
          let canvasY = imgY + offsetY;

          let distFromMouse = p.dist(p.mouseX, p.mouseY, canvasX, canvasY);

          // Ripple & scan effects enhanced by mouse position
          let ripple1 =
            p.sin(distFromMouse * 0.02 - t * 5 * mouseSpeed) *
            (100 + mouseChaos);
          let ripple2 =
            p.cos(distFromMouse * 0.04 - t * 3 * mouseSpeed) *
            (50 + mouseChaos * 0.5);
          let scan =
            p.sin(t * 2 * mouseSpeed + canvasY * 0.15) * (45 + mouseChaos);
          // Extra wave driven by mouse X position
          let extraWave =
            p.sin(t * mouseSpeed * 1.5 + canvasX * 0.08 * (mx * 3 + 0.5)) *
            mouseChaos;

          let animatedBrightness =
            brightnessVal + scan + ripple1 + ripple2 + extraWave;

          let symbolIndex = p.floor(
            p.map(animatedBrightness, 0, 255, 0, symbols.length - 1),
          );
          symbolIndex = p.constrain(symbolIndex, 0, symbols.length - 1);

          let localAsciiAmount = asciiAmount;
          if (distFromMouse < 250) {
            let influence = p.map(distFromMouse, 0, 250, 1, 0);
            influence = p.pow(influence, 2);
            // Increase local ascii near mouse (more chaotic near cursor)
            localAsciiAmount = p.lerp(asciiAmount, 1.0, influence * 0.6);
          }

          if (p.random() < localAsciiAmount) {
            p.push();
            p.translate(canvasX + stepSize / 2, canvasY + stepSize / 2);

            // Mouse proximity effect zone - larger and more intense with mouseY
            let effectRadius = p.lerp(150, 300, my);
            if (distFromMouse < effectRadius) {
              let influence = p.map(distFromMouse, 0, effectRadius, 1, 0);
              let rotation = influence * p.PI * 2 * mouseStepMod;
              p.rotate(rotation + t * influence * mouseSpeed);

              // Hue shift driven by both time and mouse position
              let hueShift = (distFromMouse * 0.5 + t * 50 + mx * 180) % 360;
              let saturation = p.lerp(40, 90, my) * influence;
              p.colorMode(p.HSB, 360, 100, 100);
              p.fill(
                hueShift,
                saturation,
                p.map(brightnessVal, 0, 255, 30, 100),
              );
              p.colorMode(p.RGB, 255);
            } else {
              // Outside mouse radius: slight tint based on mouse X
              let tintR = p.lerp(r, p.map(mx, 0, 1, r, 255), 0.15);
              let tintB = p.lerp(b, p.map(1 - mx, 0, 1, b, 200), 0.15);
              p.fill(tintR, g, tintB);
            }

            p.text(symbols[symbolIndex], -stepSize / 2, stepSize / 2);
            p.pop();
          } else {
            // Pixel blocks also tinted by mouse
            let tintR = p.lerp(r, p.map(mx, 0, 1, r, 255), 0.1);
            let tintB = p.lerp(b, p.map(1 - mx, 0, 1, b, 200), 0.1);
            p.fill(tintR, g, tintB);
            p.rect(canvasX, canvasY, stepSize, stepSize);
          }
        }
      }
    };

    p.mousePressed = function () {
      startTime = p.millis() / 1000;
      asciiAmount = 1;
    };
  };
  new p5(sketch);
}

initAsciiMusic();
