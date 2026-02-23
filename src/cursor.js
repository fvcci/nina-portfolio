// ============================================
// COMPOSE IMAGE SETUP & FUNCTIONALITY
// ============================================
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );

if (!isMobile) {
  const composeImg = new Image();
  composeImg.src = "compose.png";
  let imgLoaded = false;

  composeImg.style.position = "fixed";
  composeImg.style.pointerEvents = "none";
  composeImg.style.zIndex = "100000";
  composeImg.style.display = "none";
  composeImg.style.width = "20px"; // Scaled down
  document.body.appendChild(composeImg);

  composeImg.onload = () => {
    imgLoaded = true;
  };
  composeImg.onerror = () => {
    imgLoaded = false;
  };

  let mouseX = 0,
    mouseY = 0;
  let clientX = 0,
    clientY = 0;
  let overSketch = false;
  let currentTarget = null; // Track exactly what we are hovering over

  document.addEventListener("mousemove", (e) => {
    mouseX = e.pageX;
    mouseY = e.pageY;
    clientX = e.clientX;
    clientY = e.clientY;
    currentTarget = e.target; // Capture the element

    // Check if we are over the p5.js canvas
    overSketch =
      e.target.tagName === "CANVAS" || e.target.classList.contains("p5Canvas");
  });

  function animateCursor() {
    if (overSketch) {
      if (imgLoaded) {
        // Hide system mouse on the CANVAS specifically
        if (currentTarget) currentTarget.style.cursor = "none";

        // Show & Position PNG (Top-left corner hits mouse)
        composeImg.style.display = "block";
        composeImg.style.left = `${clientX}px`;
        composeImg.style.top = `${clientY}px`;
      } else {
        // Fallback: Image failed, show system mouse
        if (currentTarget) currentTarget.style.cursor = "auto";
        composeImg.style.display = "none";
      }
    } else {
      // Normal Section: Reset everything
      if (currentTarget) currentTarget.style.cursor = "default";
      composeImg.style.display = "none";
    }

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* ============================================
   COMMENTED OUT: CIRCLE ANIMATED HOVER
   ============================================

const cursor = document.querySelector(".cursor");
const follower = document.querySelector(".cursor-follower");
const cursorText = document.querySelector(".cursor-text");
const hoverElements = document.querySelectorAll(".hover-image");

let posX = 0, posY = 0;
let followX = 0, followY = 0;

function animateCursor() {
  posX += (mouseX - posX) / 9;
  posY += (mouseY - posY) / 9;
  followX += (posX - followX) / 10;
  followY += (posY - followY) / 10;

  if (overSketch) {
    // Hide the Pink Cursor
    cursor.style.display = 'none';
    follower.style.display = 'none';
  } else {
    cursor.style.display = 'block';
    follower.style.display = 'block';

    cursor.style.left = `${posX - cursor.offsetWidth / 2}px`;
    cursor.style.top = `${posY - cursor.offsetHeight / 2}px`;
    follower.style.left = `${followX - follower.offsetWidth / 2}px`;
    follower.style.top = `${followY - follower.offsetHeight / 2}px`;
  }
}

// Hover effect for all elements with the hover-image class
hoverElements.forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursor.classList.add("hovering"); // Add 'hovering' class on hover
    follower.classList.add("hovering");
    cursorText.style.display = "block"; // Show the text

    if (element.querySelector("img")) {
      cursorText.textContent = "Case Study"; // Set cursor text for image elements
    } else if (element.tagName === "IMG" && element.alt === "Music Icon") {
      cursorText.textContent = "About Me"; // Set cursor text for music icon
    } else if (
      element.querySelector("h6") &&
      element.querySelector("h6").textContent === "About"
    ) {
      cursorText.textContent = "About Me"; // Set cursor text for "About"
    } else if (
      element.querySelector("h6") &&
      element.querySelector("h6").textContent === "Projects"
    ) {
      cursorText.textContent = "Projects"; // Set cursor text for "Projects"
    } else if (
      element.querySelector("h6") &&
      element.querySelector("h6").textContent === "Resume"
    ) {
      cursorText.textContent = "Resume"; // Set cursor text for "Resume"
    } else if (
      element.querySelector("h6") &&
      element.querySelector("h6").textContent === "Archive"
    ) {
      cursorText.textContent = "Archive"; // Set cursor text for "Archive"
    } else {
      cursorText.textContent = "View"; // Default text
    }
  });

  element.addEventListener("mouseleave", () => {
    cursor.classList.remove("hovering"); // Remove 'hovering' class when hover ends
    follower.classList.remove("hovering");
    cursorText.style.display = "none"; // Hide the text
  });
});

============================================ */
