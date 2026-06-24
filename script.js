// ── NAVBAR SCROLL ──────────────────────────────────────────────
// Adds 'scrolled' class to navbar when user scrolls down
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── HAMBURGER MENU ─────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobileMenu');
const mobLinks    = document.querySelectorAll('.mob-link');

// Toggle menu open/close
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ON SCROLL ──────────────────────────────────
// Highlights the nav link of the section currently on screen
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove active from all links
      navLinks.forEach(link => link.classList.remove('active'));
      // Add active to the matching link
      const id = entry.target.getAttribute('id');
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, { threshold: 0.4 }); // triggers when 40% of section is visible

sections.forEach(section => sectionObserver.observe(section));

// ── SCROLL REVEAL ──────────────────────────────────────────────
// Animates elements in as they enter the viewport
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger child elements slightly so they animate one after another
      const delay = entry.target.classList.contains('reveal-child') ? index * 80 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target); // only animate once
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-child').forEach(el => {
  revealObserver.observe(el);
});

// ── PROGRESS BAR ANIMATION ─────────────────────────────────────
// Animates skill progress bars when skills section comes into view
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Find all progress fills inside the skills section
      entry.target.querySelectorAll('.progress-fill').forEach(fill => {
        const targetWidth = fill.getAttribute('data-width');
        setTimeout(() => {
          fill.style.width = targetWidth + '%';
        }, 300);
      });
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const skillsSection = document.getElementById('skills');
if (skillsSection) progressObserver.observe(skillsSection);

// ── TYPING ANIMATION ───────────────────────────────────────────
// Cycles through words in the hero heading
const words   = ['websites.', 'clean code.', 'fast pages.', 'real things.'];
const typedEl = document.getElementById('typed');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    // Remove one character
    typedEl.textContent = currentWord.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Add one character
    typedEl.textContent = currentWord.slice(0, charIndex + 1);
    charIndex++;
  }

  // Finished typing the word — pause then start deleting
  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => { isDeleting = true; type(); }, 1800);
    return;
  }

  // Finished deleting — move to next word
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  // Speed: deleting is faster than typing
  const speed = isDeleting ? 60 : 100;
  setTimeout(type, speed);
}

// Start typing after a short delay
setTimeout(type, 800);

// ── CONTACT FORM ───────────────────────────────────────────────
// Handles Formspree form submission with fetch (no page reload)
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // stop normal form submit (page reload)

  // Update button state
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Success
      formStatus.textContent = '✓ Message sent! I\'ll get back to you within 24 hours.';
      formStatus.className = 'form-status success';
      form.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // Error — remind them to set up Formspree
    formStatus.textContent = '✗ Something went wrong. Make sure you set up Formspree first (see comment in HTML).';
    formStatus.className = 'form-status error';
  }

  // Reset button
  submitBtn.textContent = 'Send Message';
  submitBtn.disabled = false;
});