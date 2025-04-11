// ANIMASI SCROLL   
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.2 });

const elementsToObserve = document.querySelectorAll(".hero, .section-store, .scroll-animation, .contact-form, .input-group, .about-judul h2, .about-deskripsi h2, .line-head i, .about-visi, .login-button");

elementsToObserve.forEach((element) => {
    observer.observe(element);
});

// Klik di luar elemen untuk menutup navbar
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarNav) { // Pastikan elemen ditemukan
    document.addEventListener('click', function (e) {
        if (navbarToggler.getAttribute('aria-expanded') === "true") {
            if (!navbarToggler.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarToggler.click();
            }
        }
    });
}

// function show login
function showLogin () {
    const sections = document.querySelectorAll("section");
    const footer = document.querySelector("footer");
    const body = document.querySelector("body");

    sections.forEach( section => {
        if (!section.classList.contains("login-container")) {
            section.classList.add("d-none");
            footer.classList.add("d-none");
        } else {
            section.classList.remove("d-none");
            body.classList.add("form-background");
        }
    })
}

// show all section
function showAllSection() {
    const sections = document.querySelectorAll("section");
    const footer = document.querySelector("footer");
    const body = document.querySelector("body");
    const formLogin = document.querySelector(".login-container form");
    const formDaftar = document.querySelector(".daftar-container form");

    sections.forEach( section => {
        if (section.classList.contains("login-container") || section.classList.contains("daftar-container")) {
            section.classList.add("d-none");
            footer.classList.remove("d-none");
        } else {
            section.classList.remove("d-none");
            body.classList.remove("form-background");
        }
    });
    [formLogin, formDaftar].forEach(form => { 
        if (form) form.reset();
    });
}

// show daftar 
function showDaftar() {
    const sections = document.querySelectorAll("section");
    const footer = document.querySelector("footer");
    const body = document.querySelector("body");
    const form = document.querySelector(".daftar-container form, .login-container form");

    sections.forEach(section => {
        if (!section.classList.contains("daftar-container")) {
            section.classList.add("d-none");
            footer.classList.add("d-none");
        } else {
            section.classList.remove("d-none");
            body.classList.add("form-background");
        }
        if (form) {
            form.reset();
        };
    })
}

// show password eye
function toogleShowPassword(icon) {
    const input = icon.previousElementSibling;

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    }
}