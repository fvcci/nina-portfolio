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

    header {
      background: rgba(252, 252, 252, 1);
      width: auto;
      min-width: min-content;
      margin-top: 1rem;
      padding: 8px 20px;
      border-radius: 20px;
      border: 1px solid #d3d3d3;
      transition: all 0.3s ease;
      pointer-events: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    header.project-mode {
      padding: 8px 16px;
    }

    nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-links {
      display: flex;
      gap: 0.5rem;
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

    .project-button {
      background-color: #1B191B !important;
      color: #fff !important;
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .project-button:hover {
      background-color: #333 !important;
    }

    .dropdown {
      position: relative;
      display: inline-block;
    }

    .dropdown-content {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 0.5rem;
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
      text-align: left;
    }

    .dropdown-content a:hover {
      background-color: #f0f0f0;
      color: #1B191B;
    }

    .close-button {
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .close-button:hover {
      background-color: #f0f0f0;
      border-radius: 12px;
    }

    .close-button img {
      width: 20px;
      height: 20px;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-center {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    #hamburger-icon {
      display: none;
      cursor: pointer;
      height: 24px;
    }

    @media (max-width: 768px) {
      .container {
        justify-content: flex-start;
      }
      header {
        width: 100%;
        margin-top: 0;
        border-radius: 0;
        padding: 12px 16px;
        justify-content: space-between;
      }
      header.project-mode {
        padding: 12px 16px;
      }
      nav { 
        display: none;
      }
      #hamburger-icon { 
        display: block;
        order: 1;
      }
      .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(252, 252, 252, 1);
        padding: 16px;
        margin: 8px 16px;
        border-radius: 16px;
        border: 1px solid #d3d3d3;
        gap: 1rem;
        z-index: 100;
      }
      .nav-links.open { display: flex; }
      .nav-links a { width: 100%; text-align: center; }
      
      .mobile-popup {
        display: none;
        position: fixed;
        top: 60px;
        left: 16px;
        right: 16px;
        background: rgba(252, 252, 252, 1);
        border: 1px solid #d3d3d3;
        border-radius: 16px;
        padding: 16px;
        z-index: 200;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .mobile-popup.show {
        display: block;
      }
      
      .mobile-popup .dropdown-content {
        position: static;
        margin-top: 8px;
        border: none;
        box-shadow: none;
        padding-left: 0;
      }

      .project-button-mobile {
        background-color: #1B191B !important;
        color: #fff !important;
        padding: 12px 16px;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
      }

      .project-button-mobile::after {
        content: "▼";
        font-size: 10px;
      }

      .project-button-mobile.expanded::after {
        content: "▲";
      }

      .nav-left, .nav-center, .nav-right {
        display: none;
      }
    }
  </style>

  <div class="container" id="header-container">
    <header>
      <div class="nav-left">
        <img src="ham.svg" id="hamburger-icon" alt="Menu" />
      </div>
      <div class="nav-center">
        <ul class="nav-links">
          <li><a href="index.html">WORKS</a></li>
          <li><a href="archive.html">PLAYGROUND</a></li>
          <li><a href="about.html">ABOUT</a></li>
          <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
        </ul>
      </div>
      <div class="nav-right"></div>
    </header>
  </div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    this.container = shadowRoot.getElementById("header-container");
    this.hamburgerIcon = this.shadowRoot.getElementById("hamburger-icon");
    this.navLinks = shadowRoot.querySelector(".nav-links");
    this.header = shadowRoot.querySelector("header");
    this.navLeft = shadowRoot.querySelector(".nav-left");
    this.navCenter = shadowRoot.querySelector(".nav-center");
    this.navRight = shadowRoot.querySelector(".nav-right");

    this.hamburgerIcon.addEventListener("click", this.toggleMenu.bind(this));
    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    window.addEventListener("scroll", this.handleScroll);
    this.setActiveLink();
    this.setupProjectMode();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  setupProjectMode() {
    const isProjectPage = this.hasAttribute("project-page");
    const projectName = this.getAttribute("project-name") || "";

    if (isProjectPage) {
      this.header.classList.add("project-mode");

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
        const currentPage = window.location.pathname;
        return !currentPage.includes(p.link.replace(".html", ""));
      });

      const projectButtonHTML = `
        <div class="dropdown" id="project-dropdown-container">
          <div class="project-button" id="project-btn">
            WORKS/${projectName}
          </div>
          <div class="dropdown-content" id="project-dropdown">
            ${filteredProjects.map((p) => `<a href="${p.link}" target="_blank">${p.name}</a>`).join("")}
          </div>
        </div>
      `;

      const closeButtonHTML = `
        <a href="index.html" class="close-button" title="Back to Works">
          <img src="close.svg" alt="Close" />
        </a>
      `;

      const centerNavHTML = `
        <ul class="nav-links">
          <li><a href="archive.html">PLAYGROUND</a></li>
          <li><a href="about.html">ABOUT</a></li>
          <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
        </ul>
      `;

      this.navLeft.innerHTML = projectButtonHTML;
      this.navCenter.innerHTML = centerNavHTML;
      this.navRight.innerHTML = closeButtonHTML;

      const projectBtn = this.shadowRoot.getElementById("project-btn");
      const dropdown = this.shadowRoot.getElementById("project-dropdown");

      projectBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      document.addEventListener("click", () => {
        dropdown.classList.remove("show");
      });
    }
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.shadowRoot.querySelectorAll(".nav-links a");

    links.forEach((link) => {
      const linkPath = link.getAttribute("href");

      if (currentPath.includes(linkPath) && linkPath !== "") {
        link.classList.add("active");
      } else if (currentPath === "/" && linkPath === "index.html") {
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

  toggleMenu() {
    const isMenuOpen = this.navLinks.classList.contains("open");
    this.navLinks.classList.toggle("open", !isMenuOpen);
    this.hamburgerIcon.src = isMenuOpen ? "ham.svg" : "close.svg";
  }
}

customElements.define("header-component", Header);
