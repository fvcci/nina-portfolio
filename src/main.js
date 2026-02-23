const materialIcons = document.createElement("link");
materialIcons.rel = "stylesheet";
materialIcons.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
document.head.appendChild(materialIcons);

// Create tooltip element for "coming soon" cards
const tooltip = document.createElement("div");
tooltip.id = "card-tooltip";
tooltip.style.cssText = `
  position: fixed;
  background: rgba(0, 0, 0, 0.7);
  color: #fcfcfc;
  padding: 8px 16px;
  border-radius: 10px;
  font-family: 'Fragment Mono', monospace;
  font-size: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 1000;
  white-space: nowrap;
`;
tooltip.textContent = "coming soon";
document.body.appendChild(tooltip);

// Mouse tracking for tooltip - only for cards without links, desktop only
document.addEventListener("mousemove", (e) => {
  // Only show tooltip on desktop (md breakpoint and up = 768px)
  if (window.innerWidth < 768) return;

  const tooltipCards = document.querySelectorAll(".has-tooltip");
  let shouldShow = false;

  tooltipCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      shouldShow = true;
    }
  });

  if (shouldShow) {
    tooltip.style.opacity = "1";
    tooltip.style.left = e.clientX + 5 + "px";
    tooltip.style.top = e.clientY - 28 + "px";
  } else {
    tooltip.style.opacity = "0";
  }
});

// Helper to build the media element (video or image)
function getMediaHTML(card, imageClass, hasHover = false) {
  const hoverClass = hasHover
    ? "transition duration-300 ease-in-out hover:scale-110"
    : "";
  if (card.video) {
    return `
      <video
        src="${card.video}"
        class="w-full h-auto ${imageClass} ${hoverClass}"
        autoplay
        muted
        loop
        playsinline
      ></video>
    `;
  }
  return `
    <img
      src="${card.image}"
      alt="${card.title}"
      loading="lazy"
      class="w-full h-auto ${imageClass} ${hoverClass}"
    />
  `;
}

// Unified card creation function
function createCards(sectionSelector, cardsData, isBrandSection = false) {
  const cardsSection = document.querySelector(sectionSelector);
  if (!cardsSection) {
    console.error(`Cards section not found: ${sectionSelector}`);
    return;
  }

  const col1 = document.createElement("div");
  col1.className = "flex flex-col gap-12";
  const col2 = document.createElement("div");
  col2.className = "flex flex-col gap-12";

  cardsData.forEach((card, index) => {
    const heightClass = "h-auto";

    // Create card div
    const cardDiv = document.createElement("div");
    cardDiv.className = "flex flex-col space-y-4";

    // Image class based on the card title
    const imageClass =
      card.title === "Dear Diary" ||
      card.title === "Goodself Design System" ||
      card.title === "The Digital Music Box - Carousel Visualizer" ||
      card.title === "Meiva" ||
      card.title === "The Purrfect Supper"
        ? "object-cover"
        : "object-contain";

    let tagHTML = "";
    if (card.tags) {
      const tagsArray = card.tags.split(" | ");
      const bracketTags = tagsArray.map((tag) => `[${tag.trim()}]`).join(" ");
      tagHTML = `<p class="text-gray-500">${bracketTags}</p>`;
    }

    // Default (no link) card - with tooltip on hover + mobile badge
    cardDiv.innerHTML = /*html*/ `
      <div class="${heightClass} w-full rounded-2xl relative z-10 overflow-hidden bg-[#f3f3f4]">
        <div class="inner-content w-full rounded-2xl overflow-hidden">
          ${getMediaHTML(card, imageClass, true)}
        </div>
        <span class="md:hidden absolute top-3 right-3" style="
          background: rgba(0, 0, 0, 0.7);
          color: #fcfcfc;
          padding: 4px 8px;
          border-radius: 4px;
          font-family: 'Fragment Mono', monospace;
          font-size: 14px;
        ">
          COMING SOON
        </span>
      </div>
      <div class="relative z-10">
        <div>${tagHTML}</div>
        <h4>${card.title}</h4>
        ${card.description ? `<p class="text-gray-500">${card.description}</p>` : ""}
      </div>
    `;

    // Wrap card in a link if the `link` property exists
    if (card.link) {
      const cardContent = /* html */ `
        <div class="relative z-10">
          <div class="flex justify-center items-center rounded-[18px] p-[3px]">
            <div class="${heightClass} w-full rounded-2xl relative z-10 overflow-hidden bg-light">
              <div class="relative group">
                ${getMediaHTML(card, imageClass, true)}
              </div>
            </div>
          </div>
        </div>

        <div class="relative z-10">
          <div>${tagHTML}</div>
          <h4>${card.title}</h4>
          ${card.description ? `<p class="text-gray-500">${card.description}</p>` : ""}
        </div>
      `;
      cardDiv.innerHTML = `<a href="${card.link}" class="space-y-4">${cardContent}</a>`;
    } else {
      // Only add tooltip class for cards WITHOUT links
      cardDiv.classList.add("has-tooltip");
    }

    // Append card to alternating columns
    if (index % 2 === 0) {
      col1.appendChild(cardDiv);
    } else {
      col2.appendChild(cardDiv);
    }
  });

  // Append both columns to the section
  cardsSection.appendChild(col1);
  cardsSection.appendChild(col2);
}

// Data for UX/UI cards
const uxuiCardsData = [
  {
    title: "Genesys Cloud",
    tags: "INTERNSHIP",
    image: "gen.png",
    description: "Interactive music visualization using p5.js",
  },
  {
    title: "Goodself Design System",
    tags: "DESIGN SYSTEM | UI LIBRARIES | ACCESSIBILITY | MOBILE, DESKTOP & TABLET",
    image: "ds.png",
    description: "Accessible component library for multi-platform products",
  },
  {
    title: "Here:after",
    image: "here.png",
    link: "hereafter.html",
    tags: "WINNER | RGD CANADA '23 | UX RESEARCH | MOBILE",
    description: "End-of-life planning app for documenting final wishes",
  },
  {
    title: "The Digital Music Box - Carousel Visualizer",
    tags: "CODE | MUSIC VISUALIZATION",
    link: "https://editor.p5js.org/ninistar/full/bu9tv-CMp",
    video: "ponie2.mp4",
    description: "Interactive music visualization using p5.js",
  },

  {
    title: "Accessichat",
    image: "accessi.png",
    link: "accessichat.html",
    tags: "HONOURABLE MENTION | RGD CANADA '24 | HACKATHON | MOBILE",
    description: "AI chat interface built with accessibility-first approach",
  },
];

// Data for Brand cards
const brandCardsData = [
  {
    title: "Lost in Translation",
    tags: "TYPOGRAPHY | PRINT",
    image: "sound.png",
    description: "Typographic study of language barriers",
  },
  {
    title: "How to Plant Plum Trees",
    tags: "ILLUSTRATION | DATA VISUALIZATION",
    image: "tree.png",
    description: "Botanical guide with data storytelling",
  },
];

// Data for Play cards
const playCardsData = [
  {
    title: "The Purrfect Supper",
    tags: "CODE | MINI-GAME",
    link: "https://editor.p5js.org/ninistar/full/UL27yTVgl",
    video: "pur.mov",
    description: "Playful mini-game built in p5.js",
  },
  {
    title: "Exomis Design + Development",
    tags: "RESPONSIVE DESIGN | UX RESEARCH | MOBILE & DESKTOP",
    image: "exomis.png",
    description: "Responsive website design with UX research",
  },
  {
    title: "Meiva",
    tags: "MOBILE & DESKTOP",
    image: "meiva.png",
    description: "Cross-platform app for mobile and desktop",
  },
  {
    title: "Dear Diary",
    tags: "ILLUSTRATION | WEB DESIGN | DESKTOP",
    link: "https://youtu.be/WAzITLPvqEU",
    video: "red.mov",
    description: "Illustrated web experience with personal narratives",
  },
];

// Main execution
document.addEventListener("DOMContentLoaded", () => {
  createCards(".cards-section", uxuiCardsData);
  createCards(".cards-section2", brandCardsData, true);
  createCards(".cards-section3", playCardsData, true);
});
