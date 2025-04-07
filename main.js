// Intersection Observer untuk animasi scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        } else {
            entry.target.classList.remove("show");
        }
    });
}, { threshold: 0.2 });

const elementsToObserve = document.querySelectorAll(".hero, .section-store, .scroll-animation, .contact-form, .input-group, .about-judul h2, .about-deskripsi h2, .line-head i, .about-visi");

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

