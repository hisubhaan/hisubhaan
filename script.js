lucide.createIcons();

// Theme Toggle Logic
const themeBtn = document.querySelector('.theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');
const htmlEl = document.documentElement;
// Default system config fallback
const savedTheme = localStorage.getItem('theme') || 'dark';

setTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const isDark = htmlEl.getAttribute('data-theme') === 'dark';
  setTheme(isDark ? 'light' : 'dark');
});

function setTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  // Update icon visual
  if (theme === 'dark') {
    themeIcon.setAttribute('data-lucide', 'moon');
  } else {
    themeIcon.setAttribute('data-lucide', 'sun');
  }
  lucide.createIcons(); // redraw icon
}

// Header scroll state + nav metrics
const navEl = document.querySelector('.nav');
function syncNavMetrics() {
  const navHeight = navEl.offsetHeight;
  document.documentElement.style.setProperty('--nav-height', `${navHeight}px`);
}

function handleNavScrollState() {
  const shouldGlass = window.scrollY > 10;
  navEl.classList.toggle('nav-scrolled', shouldGlass);
  syncNavMetrics();
}

handleNavScrollState();
window.addEventListener('scroll', handleNavScrollState, { passive: true });
window.addEventListener('resize', syncNavMetrics);

// Mobile Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
mobileBtn.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  mobileBtn.setAttribute('aria-expanded', String(mobileNav.classList.contains('open')));
});

document.querySelectorAll('#mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
  });
});

// Simple Form Submission Status
async function handleTransmit() {
  const status = document.getElementById('form-status');
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const msg = document.getElementById('message').value;

  if (!name || !email || !msg) {
    status.className = 'error';
    status.textContent = "Data missing. Fill all fields.";
    return;
  }

  status.className = '';
  status.textContent = "Sending...";

  try {
    const response = await fetch("https://formspree.io/f/mnjoweal", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: name, email: email, message: msg })
    });
    
    if (response.ok) {
      status.className = 'success';
      status.textContent = "Message is Sent";
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('message').value = '';
    } else {
      status.className = 'error';
      status.textContent = "Oops! Problem submitting form.";
    }
  } catch (error) {
    status.className = 'error';
    status.textContent = "Oops! Problem submitting form.";
  }

  setTimeout(() => {
    status.textContent = '';
  }, 4000);
}

// Scroll Reveal Animation Initialization
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => {
  observer.observe(el);
});

// Smooth Scrolling Interceptor for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      e.preventDefault();

      const headerOffset = navEl.offsetHeight + 10;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});