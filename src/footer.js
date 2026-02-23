class FooterComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">

      <style>
        * {
          box-sizing: border-box;
          font-family: "Darker Grotesque", sans-serif;
        }

        footer {
          background: #1B191B;
          padding: 40px 80px;
          border-top: 1px solid #272630;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        /* Each section takes equal width */
        .footer-brand {
          flex: 1;
        }

        .footer-nav {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .footer-social {
          flex: 1;
          display: flex;
          justify-content: flex-end;
        }

        header {
          font-size: 20px;
          color: #FFFFFF;
          font-weight: 500;
          white-space: nowrap;
        }

        .nav-links {
          display: flex;
          gap: 0.25rem;
          list-style: none;
          margin: 0;
          padding: 0;
          font-weight: 500;
          align-items: center;
        }

        .nav-links a {
          color: #8C8A98;
          font-size: 14px;
          font-family: "Fragment Mono", monospace;
          display: inline-block;
          padding: 6px 10px;
          text-decoration: none;
          border-radius: 6px;
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .nav-links a:hover {
          color: #FFFFFF;
        }

        .social-links {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .social-links a {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.25rem;
          height: 2.25rem;
          font-size: 1rem;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.25s ease, transform 0.2s ease;
          color: white;
          background: #2a2830;
          flex-shrink: 0;
        }

        .social-links a:hover {
          transform: translateY(-2px);
        }

        .social-links a.linkedin:hover {
          background: #6f76c8;
        }

        .social-links a.email:hover {
          background: #33b0b0;
        }

        /* instagram / behance — commented out but ready */
        .social-links a.instagram:hover {
          background: rgb(255, 95, 158);
        }
        .social-links a.behance:hover {
          background: #5e3c49;
        }

        @media (min-width: 1536px) {
          header {
            font-size: 28px;
          }
        }

        @media (max-width: 900px) {
          footer {
            padding: 36px 64px;
          }
          .nav-links a {
            padding: 6px 7px;
          }
        }

        @media (max-width: 768px) {
          footer {
            flex-direction: column;
            align-items: center;
            padding: 32px 16px;
            gap: 20px;
            text-align: center;
          }

          .footer-brand,
          .footer-nav,
          .footer-social {
            flex: unset;
            width: 100%;
            display: flex;
            justify-content: center;
          }

          .nav-links {
            flex-wrap: wrap;
            justify-content: center;
            gap: 0;
          }

          .social-links {
            justify-content: center;
            gap: 0.75rem;
          }
        }
      </style>

      <footer>
        <div class="footer-brand">
          <header>© 2026, Developed in JS by me :)</header>
        </div>

        <nav class="footer-nav">
          <ul class="nav-links">
            <li><a href="index.html">HOME</a></li>
            <li><a href="archive.html">PLAYGROUND</a></li>
            <li><a href="about.html">ABOUT</a></li>
            <li><a href="mailto:ninalle.65@gmail.com">RESUME</a></li>
          </ul>
        </nav>

        <div class="footer-social">
          <div class="social-links">
            <a class="linkedin" href="https://www.linkedin.com/in/ninale65/" target="_blank" aria-label="LinkedIn">
              <i class="fa-brands fa-linkedin-in"></i>
            </a>
            <!-- <a class="instagram" href="https://www.instagram.com/ninmedias/" target="_blank" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a> -->
            <!-- <a class="behance" href="https://www.behance.net/ninale1" target="_blank" aria-label="Behance">
              <i class="fa-brands fa-behance"></i>
            </a> -->
            <a class="email" href="mailto:ninalle.65@gmail.com" aria-label="Email">
              <i class="fa-solid fa-envelope"></i>
            </a>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("footer-component", FooterComponent);
