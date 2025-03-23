/* Active Navigation */
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
const menuIcon = document.getElementById('menu-icon');
const nav = document.querySelector('nav');

/* Toggle nav menu on click */
menuIcon.addEventListener('click', () => {
  nav.classList.toggle('active');
});

/* Close nav menu when a link is clicked */
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

/* Highlight active section in navigation on scroll */
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

/* Resume section toggle */
const resumeBtns = document.querySelectorAll('.resume-btn');
resumeBtns.forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const resumeDetails = document.querySelectorAll('.resume-detail');
    resumeBtns.forEach(btn => btn.classList.remove('active'));
    btn.classList.add('active');
    resumeDetails.forEach(detail => detail.classList.remove('active'));
    resumeDetails[idx].classList.add('active');
  });
});

/* Typed text effect */
const words = ["Frontend", "graphic designer", "video editor", "photographer"];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById("typed-text");

const typingSpeed = 100;      // سرعة كتابة سريعة
const deletingSpeed = 75;     // سرعة حذف سريعة
const delayBetweenWords = 1500; // فترة انتظار أقل بين الكلمات

function type() {
  const currentWord = words[currentWordIndex];
  if (isDeleting) {
    typedTextElement.textContent = currentWord.substring(0, currentCharIndex - 1);
    currentCharIndex--;
    if (currentCharIndex === 0) {
      isDeleting = false;
      currentWordIndex = (currentWordIndex + 1) % words.length;
      setTimeout(type, 500); // تأخير بسيط قبل بدء الكلمة التالية
    } else {
      setTimeout(type, deletingSpeed);
    }
  } else {
    typedTextElement.textContent = currentWord.substring(0, currentCharIndex + 1);
    currentCharIndex++;
    if (currentCharIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(type, delayBetweenWords);
    } else {
      setTimeout(type, typingSpeed);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  type();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const filter = btn.dataset.filter;
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
      const category = project.dataset.category;
      if (filter === 'all' || filter === category) {
        project.style.display = 'block';
        setTimeout(() => project.style.opacity = '1', 50);
      } else {
        project.style.opacity = '0';
        setTimeout(() => project.style.display = 'none', 300);
      }
    });
  });
});
