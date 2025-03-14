// ✅ Fix: Ensure DOM is fully loaded before running scripts
document.addEventListener("DOMContentLoaded", function () {
    
    // ✅ Fix: Ensure jQuery is loaded before using `$`
    if (typeof jQuery === "undefined") {
        console.error("jQuery is not loaded. Make sure to include it before scripts.js.");
    }

    // ✅ Mobile Menu Toggle
    let menuToggle = document.querySelector('.menu-toggle');
    let navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // ✅ Smooth Scroll Functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            let target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ✅ Modal Functionality
    let openButtons = document.querySelectorAll('[data-modal-target]');
    let closeButtons = document.querySelectorAll('[data-close-button]');
    let overlay = document.getElementById('overlay');

    function openModal(modal) {
        if (modal) {
            modal.classList.add('active');
            overlay.classList.add('active');
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    openButtons.forEach(button => {
        button.addEventListener('click', () => {
            let modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            let modal = button.closest('.modal');
            closeModal(modal);
        });
    });

    if (overlay) {
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.modal.active').forEach(modal => closeModal(modal));
        });
    }

    console.log("✅ Initial scripts loaded successfully!");
});
// ✅ Fix: Carousel Controls
let autoRotate;
function pauseCarouselAnimation() {
    let carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.style.animationPlayState = 'paused'; // Pause CSS animation
        clearInterval(autoRotate); // Stop JS rotation
    }
}

function resumeCarouselAnimation() {
    let carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.style.animationPlayState = 'running'; // Resume CSS animation
        startAutoRotate(); // Restart JS rotation
    }
}

// ✅ Pause carousel when modal opens
document.querySelectorAll('[data-modal-target]').forEach(button => {
    button.addEventListener('click', () => {
        pauseCarouselAnimation();
    });
});

// ✅ Resume carousel when modal closes
document.querySelectorAll('[data-close-button]').forEach(button => {
    button.addEventListener('click', () => {
        resumeCarouselAnimation();
    });
});

// ✅ Flip Problem Cards
document.querySelectorAll('.problem-card').forEach(card => {
    card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
    });
});

// ✅ Work with Us - Ensure Elements Exist
let workWithUsBtn = document.getElementById('work-with-us-btn');
let consultantFormSection = document.getElementById('consultant-form-section');

if (workWithUsBtn && consultantFormSection) {
    workWithUsBtn.addEventListener('click', () => {
        if (consultantFormSection.style.display === 'none') {
            consultantFormSection.style.display = 'block';
            consultantFormSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}
// ✅ Form Validation
let consultantForm = document.getElementById('consultant-form');
if (consultantForm) {
    consultantForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm(consultantForm)) {
            alert('Thank you for submitting your details. We will contact you soon!');
            consultantForm.reset();
            document.getElementById('consultant-form-section').style.display = 'none';
        } else {
            alert('Please fill out all required fields.');
        }
    });
}

function validateForm(form) {
    let valid = true;
    form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        if (!input.value.trim()) {
            valid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '#ccc';
        }
    });
    return valid;
}

// ✅ Dynamic Navbar Background on Scroll
window.addEventListener('scroll', () => {
    let navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.style.backgroundColor = window.scrollY > 50 ? '#001122' : 'transparent';
    }
});
/// ✅ Fetch and Display Textile News from GitHub
async function fetchNews() {
    try {
        let response = await fetch("https://raw.githubusercontent.com/Mitesh222/World-Textile-Hub/main/news.json");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        let data = await response.json();
        let container = document.getElementById("news-container");

        if (!container) {
            console.error("❌ news-container not found!");
            return;
        }

        container.innerHTML = ""; // Clear previous content

        // Iterate over news articles (assuming flat list format)
        data.forEach(news => {
            let newsDiv = document.createElement("div");
            newsDiv.classList.add("news-card");
            newsDiv.innerHTML = `
                <h4><a href="${news.link}" target="_blank">${news.title}</a></h4>
                <p>${news.summary}</p>
                <small>Source: <a href="${news.source}" target="_blank">${new URL(news.source).hostname}</a></small>
            `;
            container.appendChild(newsDiv);
        });

    } catch (error) {
        console.error("❌ Error fetching news:", error);
        let container = document.getElementById("news-container");
        if (container) {
            container.innerHTML = "<p>Failed to load news.</p>";
        }
    }
}

// ✅ Load news when the page loads
document.addEventListener("DOMContentLoaded", fetchNews);

// ✅ GSAP (TweenMax) Carousel Fix
if (typeof TweenMax === "undefined") {
    console.error("TweenMax is not loaded. Make sure to include GSAP in index.html.");
} else {
    console.log("✅ TweenMax is loaded.");
}

// ✅ Ensure jQuery is loaded for carousel interactions
$(document).ready(function () {
    $(".carousel").hover(pauseCarouselAnimation, resumeCarouselAnimation);
});
