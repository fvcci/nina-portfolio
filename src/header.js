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
    }

    .container {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 50;
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
      padding: 8px 20px; /* Reduced to balance with button padding */
      border-radius: 20px;
      border: 1px solid #d3d3d3;
      transition: all 0.3s ease;
      pointer-events: auto;
    }

    nav {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .nav-links {
      display: flex;
      gap: 0.5rem; /* Tighter gap because buttons have internal padding now */
      list-style: none;
      font-weight: 500;
      align-items: center;
    }

    li { font-size: 14px; }

    /* Base style for all links to make them look like equal buttons */
    .nav-links a {
      color: #8C8A98;
      padding: 8px 16px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: inline-block;
    }

    /* Hover state: Grey background for all */
    .nav-links a:hover {
      background-color: #f0f0f0; /* Light grey hover */
      color: #1B191B;
    }

    /* Active state: Black background, white text */
    .nav-links a.active {
      background-color: #1B191B !important;
      color: #fff !important;
    }

    #hamburger-icon {
      display: none;
      cursor: pointer;
      height: 24px;
    }

    @media (max-width: 768px) {
      .container { padding: 0 1rem; }
      header {
        width: 100%;
        margin-top: 0.5rem;
        border-radius: 16px;
      }
      nav { justify-content: space-between; }
      #hamburger-icon { display: block; }
      .nav-links {
        display: none;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(252, 252, 252, 1);
        padding: 16px;
        margin: 8px;
        border-radius: 16px;
        border: 1px solid #d3d3d3;
        gap: 1rem;
      }
      .nav-links.open { display: flex; }
      .nav-links a { width: 100%; text-align: center; }
    }
  </style>

  <div class="container" id="header-container">
    <header>
      <nav>
        <img src="ham.svg" id="hamburger-icon" alt="Menu" />
        <ul class="nav-links">
          <li><a href="index.html">WORKS</a></li>
          <li><a href="archive.html">PLAYGROUND</a></li>
          <li><a href="about.html">ABOUT</a></li>
          <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
        </ul>
      </nav>
    </header>
  </div>
`;

class Header extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    this.container = shadowRoot.getElementById("header-container");
    this.hamburgerIcon = shadowRoot.getElementById("hamburger-icon");
    this.navLinks = shadowRoot.querySelector(".nav-links");

    this.hamburgerIcon.addEventListener("click", this.toggleMenu.bind(this));
    this.handleScroll = this.handleScroll.bind(this);
  }

  connectedCallback() {
    window.addEventListener("scroll", this.handleScroll);
    this.setActiveLink();
  }

  disconnectedCallback() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  setActiveLink() {
    const currentPath = window.location.pathname;
    const links = this.shadowRoot.querySelectorAll(".nav-links a");
    
    links.forEach(link => {
      // Get the filename from the href (e.g., "index.html")
      const linkPath = link.getAttribute("href");
      
      if (currentPath.includes(linkPath) && linkPath !== "") {
        link.classList.add("active");
      } else if (currentPath === "/" && linkPath === "index.html") {
        // Edge case for root domain
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