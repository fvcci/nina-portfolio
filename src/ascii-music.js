function initAsciiMusic() {
  const sketch = function (p) {
    let img;
    let symbols = [
      "@", "#", "&", "＊", "%", "♫", "♪", "!", "+", "=",
      "?", "^", "☆", "♡", "<", "o", "•", ".", "~",
    ];
    let stepSize = 9;
    let t = 0;
    let asciiAmount = 1;
    let transitionDuration = 8;
    let startTime;
    let imgLoaded = false;
    let isMobile = false;

    // Cached pixel data — loaded once so we're not calling loadPixels() every frame
    let cachedPixels = null;
    let cachedImgWidth = 0;
    let cachedImgHeight = 0;

    // Smooth mouse/touch position with lerp to avoid jitter
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    // On mobile, track touch position manually
    let touchX = -1000;
    let touchY = -1000;

    p.preload = function () {
      isMobile = p.windowWidth < 768;
      let resizeFactor = isMobile ? 6 : 3.5;
      img = p.loadImage(
        "music.png",
        () => {
          img.resize(img.width / resizeFactor, img.height / resizeFactor);
          // Cache pixel data once after resize
          img.loadPixels();
          cachedPixels = img.pixels.slice(); // copy
          cachedImgWidth = img.width;
          cachedImgHeight = img.height;
          imgLoaded = true;
        },
        () => {
          console.error("Failed to load image");
        },
      );
    };

    p.setup = function () {
      isMobile = p.windowWidth < 768;
      stepSize = isMobile ? 6 : 9;
      let displayWidth = isMobile ? p.windowWidth : 800;
      let displayHeight = isMobile ? p.windowWidth * 0.5 : 400;
      let cnv = p.createCanvas(displayWidth, displayHeight);
      cnv.parent("ascii-music-container");
      p.textFont("Doto");
      p.textSize(stepSize);
      p.noStroke();
      startTime = p.millis() / 1000;

      smoothMouseX = p.width * 0.5;
      smoothMouseY = p.height * 0.5;
    };

    let resizeTimer = null;
    let lastIsMobile = false;

    function rebuildImageCache(mobile) {
      let resizeFactor = mobile ? 6 : 3.5;
      p.loadImage("music.png", function (freshImg) {
        freshImg.resize(freshImg.width / resizeFactor, freshImg.height / resizeFactor);
        freshImg.loadPixels();
        cachedPixels = freshImg.pixels.slice();
        cachedImgWidth = freshImg.width;
        cachedImgHeight = freshImg.height;
      });
    }

    p.windowResized = function () {
      let nowMobile = p.windowWidth < 768;
      let displayWidth = nowMobile ? p.windowWidth : 800;
      let displayHeight = nowMobile ? p.windowWidth * 0.5 : 400;

      // Resize canvas immediately — no lag while dragging
      p.resizeCanvas(displayWidth, displayHeight);
      isMobile = nowMobile;
      stepSize = nowMobile ? 6 : 9;
      p.textSize(stepSize);

      // Only re-cache pixels if we crossed the mobile/desktop breakpoint
      // Debounced so it doesn't fire on every pixel of drag
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (nowMobile !== lastIsMobile) {
          lastIsMobile = nowMobile;
          rebuildImageCache(nowMobile);
        }
      }, 200);
    };

    // Mobile: track touch position, don't trigger dissolve
    p.touchStarted = function () {
      if (isMobile && p.touches.length > 0) {
        touchX = p.touches[0].x;
        touchY = p.touches[0].y;
      }
      return false; // prevent default scroll
    };

    p.touchMoved = function () {
      if (isMobile && p.touches.length > 0) {
        touchX = p.touches[0].x;
        touchY = p.touches[0].y;
      }
      return false;
    };

    p.touchEnded = function () {
      // Fade touch influence out gradually (set off-screen)
      touchX = -1000;
      touchY = -1000;
      return false;
    };

    // Desktop only: click resets the dissolve cycle
    p.mousePressed = function () {
      if (!isMobile) {
        startTime = p.millis() / 1000;
        asciiAmount = 1;
      }
    };

    p.draw = function () {
      p.background("#fcfcfc");

      if (!imgLoaded || !cachedPixels) {
        p.fill(0);
        p.text("Loading...", p.width / 2, p.height / 2);
        return;
      }

      t += 0.055; // fast tick

      // Smooth the effective pointer position
      let targetX, targetY;
      if (isMobile) {
        targetX = touchX;
        targetY = touchY;
      } else {
        targetX = p.mouseX;
        targetY = p.mouseY;
      }

      // Lerp towards target — prevents jarring jumps
      smoothMouseX = p.lerp(smoothMouseX, targetX, 0.12);
      smoothMouseY = p.lerp(smoothMouseY, targetY, 0.12);

      let offsetX = (p.width - cachedImgWidth) / 2;
      let offsetY = (p.height - cachedImgHeight) / 2 - (isMobile ? 20 : 0);

      let elapsed = p.millis() / 1000 - startTime;

      // Loop every full cycle
      if (elapsed >= transitionDuration * 2) {
        startTime = p.millis() / 1000;
        elapsed = 0;
      }

      let halfDuration = transitionDuration;
      if (elapsed < halfDuration) {
        let progress = elapsed / halfDuration;
        asciiAmount = p.pow(1 - progress, 2.5);
        asciiAmount = p.max(asciiAmount, 0.15);
      } else {
        let progress = (elapsed - halfDuration) / halfDuration;
        asciiAmount = p.pow(progress, 2.5);
        asciiAmount = p.max(asciiAmount, 0.15);
      }

      // Normalize smooth pointer
      let mx = p.constrain(smoothMouseX / p.width, 0, 1);
      let my = p.constrain(smoothMouseY / p.height, 0, 1);

      // Reduce chaos values significantly for less glitchiness
      let mouseSpeed = p.lerp(2, 5, mx);           // faster base + range
      let mouseChaos = p.lerp(20, 60, my);          // more chaos always present
      let mouseStepMod = p.lerp(1.2, 1.8, mx);

      for (let imgY = 0; imgY < cachedImgHeight; imgY += stepSize) {
        for (let imgX = 0; imgX < cachedImgWidth; imgX += stepSize) {
          let index = (imgX + imgY * cachedImgWidth) * 4;
          let r = cachedPixels[index];
          let g = cachedPixels[index + 1];
          let b = cachedPixels[index + 2];
          let a = cachedPixels[index + 3];

          // Skip fully transparent pixels early
          if (a < 10) continue;

          let brightnessVal = (r + g + b) / 3;

          // Skip very bright (near-white) background pixels for speed
          if (brightnessVal > 245 && a < 50) continue;

          let canvasX = imgX + offsetX;
          let canvasY = imgY + offsetY;

          let distFromMouse = p.dist(smoothMouseX, smoothMouseY, canvasX, canvasY);

          // Smoother, reduced amplitude ripples
          let ripple1 = p.sin(distFromMouse * 0.02 - t * 6 * mouseSpeed) * (70 + mouseChaos);
          let ripple2 = p.cos(distFromMouse * 0.035 - t * 4 * mouseSpeed) * (40 + mouseChaos * 0.5);
          let scan = p.sin(t * 3 * mouseSpeed + canvasY * 0.12) * (40 + mouseChaos * 0.7);
          let extraWave = p.sin(t * mouseSpeed * 1.5 + canvasX * 0.06 * (mx * 2 + 0.5)) * (mouseChaos * 0.7);

          let animatedBrightness = brightnessVal + scan + ripple1 + ripple2 + extraWave;

          let symbolIndex = p.floor(p.map(animatedBrightness, 0, 255, 0, symbols.length - 1));
          symbolIndex = p.constrain(symbolIndex, 0, symbols.length - 1);

          let localAsciiAmount = asciiAmount;
          if (distFromMouse < 200) {
            let influence = p.map(distFromMouse, 0, 200, 1, 0);
            influence = p.pow(influence, 2);
            localAsciiAmount = p.lerp(asciiAmount, 1.0, influence * 0.5);
          }

          if (p.random() < localAsciiAmount) {
            p.push();
            p.translate(canvasX + stepSize / 2, canvasY + stepSize / 2);

            let effectRadius = p.lerp(120, 240, my);
            if (distFromMouse < effectRadius) {
              let influence = p.map(distFromMouse, 0, effectRadius, 1, 0);
              // Gentler rotation — less spinny
              let rotation = influence * p.PI * 0.8 * mouseStepMod;
              p.rotate(rotation + t * influence * mouseSpeed * 0.5);

              let hueShift = (distFromMouse * 0.4 + t * 40 + mx * 180) % 360;
              let saturation = p.lerp(30, 70, my) * influence;
              p.colorMode(p.HSB, 360, 100, 100);
              p.fill(hueShift, saturation, p.map(brightnessVal, 0, 255, 30, 100));
              p.colorMode(p.RGB, 255);
            } else {
              let tintR = p.lerp(r, p.map(mx, 0, 1, r, 255), 0.1);
              let tintB = p.lerp(b, p.map(1 - mx, 0, 1, b, 200), 0.1);
              p.fill(tintR, g, tintB);
            }

            p.text(symbols[symbolIndex], -stepSize / 2, stepSize / 2);
            p.pop();
          } else {
            let tintR = p.lerp(r, p.map(mx, 0, 1, r, 255), 0.08);
            let tintB = p.lerp(b, p.map(1 - mx, 0, 1, b, 200), 0.08);
            p.fill(tintR, g, tintB);
            p.rect(canvasX, canvasY, stepSize, stepSize);
          }
        }
      }
    };
  };
  new p5(sketch);
}

initAsciiMusic();