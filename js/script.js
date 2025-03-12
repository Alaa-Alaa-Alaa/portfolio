
 // Active Navigation
 const sections = document.querySelectorAll('section');
 const navLinks = document.querySelectorAll('.nav-link');

 // الحصول على عناصر القائمة وأيقونة القائمة
const menuIcon = document.getElementById('menu-icon');
const nav = document.querySelector('nav');

// عند النقر على أيقونة القائمة يتم تبديل الفئة active للقائمة
menuIcon.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// عند النقر على أي رابط داخل النافبار، يتم إغلاق القائمة
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
    });
});

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







const resumeBtns = document.querySelectorAll('.resume-btn');

resumeBtns.forEach((btn, idx)=> {
    btn.addEventListener('click', () => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        resumeBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        btn.classList.add('active');

        resumeDetails.forEach(detail => {
            detail.classList.remove('active');
        });
        resumeDetails[idx].classList.add('active');
    });
});









const words = ["programmer", "graphic designer", "cybersecurity", "video editor"];
let currentWordIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typedTextElement = document.getElementById("typed-text");
// تقليل الفترات لجعل التأثير أسرع
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