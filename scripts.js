document.addEventListener("DOMContentLoaded", function () {
    // ✅ Ensure jQuery is loaded
    if (typeof jQuery === "undefined") {
        console.error("❌ jQuery is not loaded. Include it before scripts.js.");
    }

    // ✅ Mobile Menu Toggle
    let menuToggle = document.querySelector('.menu-toggle');
    let navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            navLinks.classList.toggle('active');
        });
    }

    // ✅ Smooth Scroll
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
            if (overlay) overlay.classList.add('active');
            pauseCarouselAnimation();
        }
    }

    function closeModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            resumeCarouselAnimation();
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
            document.querySelectorAll('.modal.active').forEach(closeModal);
        });
    }

    // ✅ Flip Problem Cards
    document.querySelectorAll('.problem-card').forEach(card => {
        card.addEventListener('click', function () {
            card.classList.toggle('is-flipped');
        });
    });

    // ✅ Work with Us Section Toggle
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
                if (consultantFormSection) consultantFormSection.style.display = 'none';
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

    // ✅ Navbar Background on Scroll
    window.addEventListener("scroll", () => {
        let navbar = document.querySelector(".navbar");
        if (navbar) {
            navbar.style.backgroundColor = window.scrollY > 50 ? "#001122" : "rgba(0, 34, 68, 0.9)";
        }
    });

    // ✅ Fetch and Display Textile News
    fetchNews();
    async function fetchNews() {
        try {
            let response = await fetch("https://raw.githubusercontent.com/Mitesh222/World-Textile-Hub/main/news.json");
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let data = await response.json();
            let container = document.getElementById("news-container");
            if (!container) {
                console.error("❌ news-container not found!");
                return;
            }

            container.innerHTML = ""; // Clear existing content

            Object.keys(data).forEach(category => {
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
            });

        } catch (error) {
            console.error("❌ Error fetching news:", error);
            let container = document.getElementById("news-container");
            if (container) container.innerHTML = "<p>Failed to load news.</p>";
        }
    }

    // ✅ Carousel Pause/Resume Functions
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

    // ✅ GSAP Check
    if (typeof TweenMax === "undefined") {
        console.warn("⚠️ TweenMax is not loaded. Include GSAP if animations require it.");
    } else {
        console.log("✅ TweenMax is loaded.");
    }

    // ✅ Carousel Hover (jQuery)
    if (typeof $ !== "undefined") {
        $(".carousel").hover(pauseCarouselAnimation, resumeCarouselAnimation);
    }

    // ✅ Placeholder: Define startAutoRotate if needed
    function startAutoRotate() {
        // Example placeholder for auto rotation logic if implemented
        // autoRotate = setInterval(() => { ... }, 3000);
    }

    console.log("✅ All scripts initialized successfully.");
});
