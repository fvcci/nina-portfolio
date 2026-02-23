const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = /* html */ `
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      text-decoration: none;
      font-family: "Fragment Mono", monospace;
      letter-spacing: -0.04em;
      font-weight: 400;
    }

    :host {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 50;
    }

    /* ─── CONTAINER ─────────────────────────────────────────── */
    .container {
      width: 100%;
      display: flex;
      justify-content: center;
      pointer-events: none;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }

    .container.hidden {
      opacity: 0;
      transform: translateY(-20px);
      pointer-events: none;
    }

    /* ─── HEADER PILL ───────────────────────────────────────── */
    header {
      background: rgba(252, 252, 252, 1);
      width: auto;
      min-width: min-content;
      margin-top: 1rem;
      padding: 8px;
      border-radius: 20px;
      border: 1px solid #d3d3d3;
      transition: all 0.3s ease;
      pointer-events: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 4px;
    }

    /* ─── NAV LINKS ─────────────────────────────────────────── */
    nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
    }

    .nav-links {
      display: flex;
      gap: 4px;
      list-style: none;
      font-weight: 500;
      align-items: center;
    }

    li { font-size: 14px; }

    .nav-links a {
      color: #8C8A98;
      padding: 8px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: inline-block;
    }

    .nav-links a:hover {
      background-color: #f0f0f0;
      color: #1B191B;
    }

    .nav-links a.active {
      background-color: #1B191B !important;
      color: #fff !important;
    }

    /* ─── PROJECT BUTTON ────────────────────────────────────── */
    .project-button {
      background-color: #1B191B;
      color: #fff;
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      user-select: none;
    }

    .project-button:hover {
      background-color: #333;
    }

    /* ─── CLOSE BUTTON ──────────────────────────────────────── */
    .close-button {
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      transition: background 0.2s;
    }

    .close-button:hover {
      background-color: #f0f0f0;
    }

    .close-button img {
      width: 20px;
      height: 20px;
    }

    /* ─── HAMBURGER BUTTON ──────────────────────────────────── */
    .hamburger-button {
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      transition: background 0.2s;
    }

    .hamburger-button:hover {
      background-color: #f0f0f0;
    }

    .hamburger-button img {
      width: 20px;
      height: 20px;
    }

    /* ─── DROPDOWN ──────────────────────────────────────────── */
    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      top: calc(100% + 0.5rem);
      left: 0;
      background: rgba(252, 252, 252, 1);
      border: 1px solid #d3d3d3;
      border-radius: 12px;
      min-width: 220px;
      z-index: 100;
      padding: 8px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .dropdown-content.show {
      display: block;
    }

    .dropdown-content a {
      color: #8C8A98;
      padding: 10px 16px;
      display: block;
      font-size: 14px;
      transition: all 0.2s;
    }

    .dropdown-content a:hover {
      background-color: #f0f0f0;
      color: #1B191B;
    }

    /* ─── HAMBURGER MENU DROPDOWN ───────────────────────────── */
    .ham-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      background: rgba(252, 252, 252, 1);
      border: 1px solid #d3d3d3;
      border-radius: 12px;
      min-width: 180px;
      z-index: 100;
      padding: 8px 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .ham-dropdown.show {
      display: block;
    }

    .ham-dropdown a {
      color: #8C8A98;
      padding: 10px 16px;
      display: block;
      font-size: 14px;
      transition: all 0.2s;
    }

    .ham-dropdown a:hover {
      background-color: #f0f0f0;
      color: #1B191B;
    }

    /* ─── NAV LAYOUT SLOTS ──────────────────────────────────── */
    .nav-left {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-center {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
    }

    /* Hamburger only shows on mobile (default mode) */
    .hamburger-button {
      display: none;
    }

    /* Project mode: hamburger never shows at all */
    .project-ham {
      display: none !important;
    }

    /* ─── MOBILE ────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .container {
        justify-content: stretch;
      }

      header {
        width: 100%;
        margin-top: 0;
        border-radius: 0;
        padding: 16px;
      }

      /* Hide desktop center nav on mobile */
      .nav-center {
        display: none;
      }

      /* Show hamburger on mobile (default mode only) */
      .hamburger-button {
        display: flex;
      }

      .ham-dropdown {
        right: 0;
        top: calc(100% + 0.75rem);
      }

      .dropdown-content {
        left: 0;
        top: calc(100% + 0.75rem);
      }

      /* Disable hover states on mobile */
      .nav-links a:hover,
      .project-button:hover,
      .close-button:hover,
      .hamburger-button:hover,
      .dropdown-content a:hover,
      .ham-dropdown a:hover {
        background-color: transparent;
        color: inherit;
      }
    }
  </style>

  <div class="container" id="header-container">
    <header>
      <div class="nav-left" id="nav-left"></div>
      <div class="nav-center" id="nav-center"></div>
      <div class="nav-right" id="nav-right"></div>
    </header>
  </div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    this.container = shadowRoot.getElementById("header-container");
    this.navLeft = shadowRoot.getElementById("nav-left");
    this.navCenter = shadowRoot.getElementById("nav-center");
    this.navRight = shadowRoot.getElementById("nav-right");
    this.header = shadowRoot.querySelector("header");

    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    window.addEventListener("scroll", this.handleScroll);

    const isProjectPage = this.hasAttribute("project-page");
    if (isProjectPage) {
      this.setupProjectMode();
    } else {
      this.setupDefaultMode();
    }
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  /* ── DEFAULT MODE ──────────────────────────────────────────── */
  setupDefaultMode() {
    // Desktop center nav
    this.navCenter.innerHTML = `
      <ul class="nav-links">
        <li><a href="index.html">WORKS</a></li>
        <li><a href="archive.html">PLAYGROUND</a></li>
        <li><a href="about.html">ABOUT</a></li>
        <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
      </ul>
    `;
    this.setActiveLink();

    // Mobile right: hamburger that opens the same links
    this.navRight.innerHTML = `
      <div class="hamburger-button" id="ham-btn">
        <img src="ham.svg" alt="Menu" id="ham-icon" />
      </div>
      <div class="ham-dropdown" id="ham-dropdown">
        <a href="index.html">WORKS</a>
        <a href="archive.html">PLAYGROUND</a>
        <a href="about.html">ABOUT</a>
        <a href="mailto:ninalle.65@gmail.com">RESUME</a>
      </div>
    `;

    const hamBtn = this.shadowRoot.getElementById("ham-btn");
    const hamIcon = this.shadowRoot.getElementById("ham-icon");
    const hamDropdown = this.shadowRoot.getElementById("ham-dropdown");

    hamBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = hamDropdown.classList.toggle("show");
      hamIcon.src = open ? "close.svg" : "ham.svg";
    });

    document.addEventListener("click", () => {
      hamDropdown.classList.remove("show");
      if (hamIcon) hamIcon.src = "ham.svg";
    });
  }

  /* ── PROJECT MODE ──────────────────────────────────────────── */
  setupProjectMode() {
    const projectName = this.getAttribute("project-name") || "";

    const allProjects = [
      { name: "Here:after", link: "hereafter.html" },
      { name: "Accessichat", link: "accessichat.html" },
      {
        name: "The Digital Music Box",
        link: "https://editor.p5js.org/ninistar/full/bu9tv-CMp",
      },
      {
        name: "The Purrfect Supper",
        link: "https://editor.p5js.org/ninistar/full/UL27yTVgl",
      },
      { name: "Dear Diary", link: "https://youtu.be/WAzITLPvqEU" },
    ];

    const filteredProjects = allProjects.filter((p) => {
      return !window.location.pathname.includes(p.link.replace(".html", ""));
    });

    const projectLinksHTML = filteredProjects
      .map((p) => `<a href="${p.link}" target="_blank">${p.name}</a>`)
      .join("");

    // LEFT: WORKS/project dropdown
    this.navLeft.innerHTML = `
      <div class="dropdown" id="proj-dropdown-wrap">
        <div class="project-button" id="proj-btn">
          WORKS/${projectName}
        </div>
        <div class="dropdown-content" id="proj-dropdown">
          ${projectLinksHTML}
        </div>
      </div>
    `;

    // CENTER (desktop only): secondary nav
    this.navCenter.innerHTML = `
      <ul class="nav-links">
        <li><a href="archive.html">PLAYGROUND</a></li>
        <li><a href="about.html">ABOUT</a></li>
        <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
      </ul>
    `;
    this.setActiveLink();

    // RIGHT: close only (no hamburger in project mode, on any screen size for mobile)
    this.navRight.innerHTML = `
      <a href="index.html" class="close-button" title="Back to Works">
        <img src="close.svg" alt="Close" />
      </a>
    `;

    // Project dropdown
    const projBtn = this.shadowRoot.getElementById("proj-btn");
    const projDropdown = this.shadowRoot.getElementById("proj-dropdown");

    projBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      projDropdown.classList.toggle("show");
    });

    // Close on outside click
    document.addEventListener("click", () => {
      projDropdown.classList.remove("show");
    });
  }

  /* ── HELPERS ───────────────────────────────────────────────── */
  setActiveLink() {
    const currentPath = window.location.pathname;
    this.shadowRoot.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        href &&
        currentPath.includes(href.replace(".html", "")) &&
        href !== ""
      ) {
        link.classList.add("active");
      } else if (currentPath === "/" && href === "index.html") {
        link.classList.add("active");
      }
    });
  }

  handleScroll() {
    if (window.innerWidth > 768) {
      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const threshold = 600;

      if (scrollY + windowHeight > totalHeight - threshold) {
        this.container.classList.add("hidden");
      } else {
        this.container.classList.remove("hidden");
      }
    } else {
      this.container.classList.remove("hidden");
    }
  }
}

customElements.define("header-component", Header);
