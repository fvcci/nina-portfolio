class ScrollComponent extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <!-- External stylesheets -->
      <link rel="stylesheet" href="./global.styles.css">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=north" />
      
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        #scroll {
          position: fixed;
          right: 44px;
          bottom: 108px;
          width: 100px;
          height: 100px;
          border-radius: 50%; /* Circle shape */
          background-color: #1B191B;
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
          visibility: hidden; /* Initially hidden */
          opacity: 0; /* Start as invisible */
        }

        /* Bounce and Fade-in Animation */
        @keyframes bounceIn {
          0% {
            transform: scale(0.5);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        #scroll.visible {
          visibility: visible; /* Show the button */
          opacity: 1; /* Make it fully visible */
          animation: bounceIn 0.6s ease-out; /* Apply bounce-in effect */
        }

        #scroll:hover {
          background-color: #2a2830;
          transform: translateY(-4px); /* Slightly raise on hover */
        }

        .material-symbols-outlined {
          font-variation-settings:
            'FILL' 0,
            'wght' 200,
            'GRAD' 0;
          font-size: 60px; /* Icon size */
        }
          
        @media (max-width: 768px) {
          #scroll {
            width: 60px;
            height: 60px;
            right: 32px;
            bottom: 32px;
          }

          .material-symbols-outlined {
            font-size: 30px; /* Smaller icon size */
          }
        }
      </style>
      
      <!-- Content inside the shadow DOM -->
      <div id="scroll">
        <span class="material-symbols-outlined">north</span> 
      </div>
    `;

    // Add scroll-to-top functionality
    const scrollButton = shadow.querySelector("#scroll");
    scrollButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Smooth scroll
      });
    });

    // scroll position and toggle visibility
    window.addEventListener("scroll", () => {
      if (window.scrollY > 2000) {
        // If scrolled down 100px or more
        scrollButton.classList.add("visible");
      } else {
        scrollButton.classList.remove("visible");
      }
    });
  }
}

customElements.define("scroll-component", ScrollComponent);
