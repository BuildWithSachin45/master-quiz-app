/* ==========================================================================
   MASTER QUIZ APP - INDEX LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize App Features
  initNavbarScroll();
  initCategoryLoader();
  initSmoothScroll();
});

/**
 * Navbar Background & Scroll Effects
 */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shadow-lg');
    } else {
      navbar.classList.remove('shadow-lg');
    }
  });
}

/**
 * Dynamic Category & Subcategory Loader
 * Populates accordion items if dynamic fetching is required.
 */
async function initCategoryLoader() {
  const accordionContainer = document.getElementById('categoryAccordion');
  if (!accordionContainer) return;

  // Example Category Configuration Structure
  const categories = [
    {
      id: 'progLang',
      title: 'Programming Languages',
      subcategories: [
        { name: 'C Programming', file: 'c' },
        { name: 'Java', file: 'java' },
        { name: 'Python', file: 'python' },
        { name: 'JavaScript', file: 'javascript' }
      ]
    },
    {
      id: 'webDev',
      title: 'Web Development',
      subcategories: [
        { name: 'HTML & CSS', file: 'html-css' },
        { name: 'Bootstrap', file: 'bootstrap' },
        { name: 'Node.js & Express', file: 'nodejs' },
        { name: 'React', file: 'react' }
      ]
    },
    {
      id: 'devTools',
      title: 'Developer Tools & DevOps',
      subcategories: [
        { name: 'Git & GitHub', file: 'git' },
        { name: 'VS Code & Android Studio', file: 'tools' },
        { name: 'DevOps & CI/CD', file: 'devops' }
      ]
    }
  ];

  // Render Dynamic Categories if accordion is empty
  if (accordionContainer.children.length === 0) {
    accordionContainer.innerHTML = categories
      .map((cat, index) => renderAccordionItem(cat, index === 0))
      .join('');
  }
}

/**
 * Render Accordion Markup
 */
function renderAccordionItem(category, isFirst) {
  const collapseId = `collapse${category.id}`;
  const headingId = `heading${category.id}`;

  const subItems = category.subcategories
    .map(
      (sub) => `
      <a href="quiz.html?category=${sub.file}" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
        ${sub.name}
        <span class="badge bg-warning rounded-pill">Start Quiz &rarr;</span>
      </a>
    `
    )
    .join('');

  return `
    <div class="accordion-item">
      <h2 class="accordion-header" id="${headingId}">
        <button class="accordion-button ${isFirst ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isFirst}" aria-controls="${collapseId}">
          ${category.title}
        </button>
      </h2>
      <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#categoryAccordion">
        <div class="accordion-body p-0">
          <div class="list-group list-group-flush">
            ${subItems}
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Smooth Scroll handling for internal navigation anchors
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // Close mobile navbar menu on selection
        const navbarToggler = document.querySelector('.navbar-toggler');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      }
    });
  });
}
