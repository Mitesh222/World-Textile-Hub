// scripts.js - Final Version with Search and Filter for News

// ✅ Carousel Pause/Resume Helpers
let autoRotate;
function pauseCarouselAnimation() {
    let carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.style.animationPlayState = 'paused';
        clearInterval(autoRotate);
    }
}

function resumeCarouselAnimation() {
    let carousel = document.querySelector('.carousel');
    if (carousel) {
        carousel.style.animationPlayState = 'running';
        startAutoRotate();
    }
}

function startAutoRotate() {
    // Placeholder: Add your carousel auto-rotation logic here
    // autoRotate = setInterval(...);
}

// ✅ Debounce Utility for Search Input
function debounce(func, delay) {
    let debounceTimer;
    return function (...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// ✅ DOM Ready
window.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    let menuToggle = document.querySelector('.menu-toggle');
    let navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            let target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Modal Handling
    let overlay = document.getElementById('overlay');
    document.querySelectorAll('[data-modal-target]').forEach(button => {
        button.addEventListener('click', () => {
            let modal = document.querySelector(button.dataset.modalTarget);
            if (modal) {
                modal.classList.add('active');
                overlay?.classList.add('active');
                pauseCarouselAnimation();
            }
        });
    });

    document.querySelectorAll('[data-close-button]').forEach(button => {
        button.addEventListener('click', () => {
            let modal = button.closest('.modal');
            if (modal) {
                modal.classList.remove('active');
                overlay?.classList.remove('active');
                resumeCarouselAnimation();
            }
        });
    });

    overlay?.addEventListener('click', () => {
        document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
        overlay.classList.remove('active');
        resumeCarouselAnimation();
    });

    // Problem Cards Flip
    document.querySelectorAll('.problem-card').forEach(card => {
        card.addEventListener('click', () => card.classList.toggle('is-flipped'));
    });

    // Work with Us Section
    let workWithUsBtn = document.getElementById('work-with-us-btn');
    let consultantFormSection = document.getElementById('consultant-form-section');
    workWithUsBtn?.addEventListener('click', () => {
        if (consultantFormSection?.style.display === 'none') {
            consultantFormSection.style.display = 'block';
            consultantFormSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Form Validation
    let consultantForm = document.getElementById('consultant-form');
    consultantForm?.addEventListener('submit', function (e) {
        e.preventDefault();
        if (validateForm(this)) {
            alert('Thank you for submitting your details. We will contact you soon!');
            this.reset();
            consultantFormSection.style.display = 'none';
        } else {
            alert('Please fill out all required fields.');
        }
    });

    function validateForm(form) {
        let valid = true;
        form.querySelectorAll('input[required], textarea[required]').forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                input.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                input.style.borderColor = '#ccc';
                input.removeAttribute('aria-invalid');
            }
        });
        return valid;
    }

    // Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        let navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.backgroundColor = window.scrollY > 50 ? '#001122' : 'rgba(0, 34, 68, 0.9)';
        }
    });

    // Initialize News Fetch
    fetchNews();
});

// ✅ News Fetching and Filtering
let allNewsData = {}; // Store fetched news globally

async function fetchNews() {
    try {
        let response = await fetch("https://raw.githubusercontent.com/Mitesh222/World-Textile-Hub/main/news.json");
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let data = await response.json();
        if (!data || typeof data !== 'object') {
            throw new Error("Invalid JSON structure. Expected category-based object.");
        }

        allNewsData = data;
        renderNews(data);

    } catch (error) {
        console.error("Error fetching news:", error);
        document.getElementById("news-container").innerHTML = "<p>Failed to load news.</p>";
    }
}

function renderNews(data) {
    const container = document.getElementById("news-container");
    container.innerHTML = "";

    let hasNews = false;

    Object.keys(data).forEach(category => {
        if (Array.isArray(data[category]) && data[category].length > 0) {
            hasNews = true;

            let categoryDiv = document.createElement("div");
            categoryDiv.classList.add("news-category");
            categoryDiv.innerHTML = `<h3>${category}</h3>`;
            container.appendChild(categoryDiv);

            data[category].forEach(news => {
                let newsDiv = document.createElement("div");
                newsDiv.classList.add("news-card");
                newsDiv.innerHTML = `
                    <h4><a href="${news.link}" target="_blank">${news.title}</a></h4>
                    <p>${news.summary}</p>
                    <a href="${news.link}" class="read-more" target="_blank">Read More</a>
                `;
                categoryDiv.appendChild(newsDiv);
            });
        }
    });

    if (!hasNews) {
        container.innerHTML = "<p>No news articles found.</p>";
    }
}

// ✅ Filter Logic with Debounce
const newsFilter = document.getElementById("newsFilter");
const newsSearch = document.getElementById("newsSearch");

newsFilter?.addEventListener("change", applyNewsFilter);
newsSearch?.addEventListener("input", debounce(applyNewsFilter, 300));

function applyNewsFilter() {
    const searchQuery = newsSearch?.value.toLowerCase().trim() || "";
    const selectedCategory = newsFilter?.value || "all";

    let filteredData = {};

    Object.keys(allNewsData).forEach(category => {
        if (selectedCategory === "all" || selectedCategory === category) {
            const filteredArticles = allNewsData[category].filter(news =>
                news.title.toLowerCase().includes(searchQuery) ||
                news.summary.toLowerCase().includes(searchQuery)
            );

            if (filteredArticles.length > 0) {
                filteredData[category] = filteredArticles;
            }
        }
    });

    renderNews(filteredData);
}