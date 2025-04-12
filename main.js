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

// const const
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('.navbar-collapse');

if (navbarToggler && navbarNav) { 
    document.addEventListener('click', function (e) {
        if (navbarToggler.getAttribute('aria-expanded') === "true") {
            if (!navbarToggler.contains(e.target) && !navbarNav.contains(e.target)) {
                navbarToggler.click();
            }
        }
    });
}

// memanggil json
document.addEventListener("DOMContentLoaded", function () {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('product-container');
        const showAllButton = document.querySelector('.btn-lihat-product');
        const btnStore = document.querySelector(".btn-store");
        const sections = document.querySelectorAll("section");
        const sectionStore = document.querySelector(".section-store");
        const containerSearch = document.querySelector(".container-search");
        let displayedItems = 8;

        function renderProducts(limit) {
            container.innerHTML = "";
            data.slice(0, limit).forEach(item => {
                const productCard = document.createElement("div");
                productCard.classList.add('col-lg-3', 'col-md-4', 'col-6', 'scroll-animation');
                productCard.innerHTML = `
                    <button class="card w-100 shadow-sm">
                        <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">
                        <div class="card-body text-center">
                            <p class="card-text fw-bold">- ${item.nama.toUpperCase()} -</p>
                            <div class="product-icons">
                                <a href="#"><i class="fa-solid fa-cart-shopping"></i></a>
                                <a href="#" class="item-detail-button"><i class="fa-solid fa-eye"></i></a>
                            </div>
                            <div class="product-stars text-warning">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <div class="product-price mt-2">
                                <span>IDR ${item.hargaNormal.toLocaleString()}</span> IDR ${item.hargaDiskon.toLocaleString()}
                            </div>
                        </div>
                    </button>
                `;
                container.appendChild(productCard);
                observer.observe(productCard);
            });

                if (limit >= data.length) {
                    showAllButton.classList.add("d-none")
                }
        }

        renderProducts(displayedItems);

        function handleShowAll() {
                renderProducts(data.length);
                sections.forEach( section => {
                    if (!section.classList.contains("section-store")) {
                        section.classList.add("d-none");
                        sectionStore.style.marginTop = "10rem";
                        containerSearch.classList.remove("d-none")
                    }
                });
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
        };
        showAllButton.addEventListener("click", handleShowAll);
        btnStore.addEventListener("click", handleShowAll);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
})

// const const
const sections = document.querySelectorAll("section");
const footer = document.querySelector("footer");
const body = document.querySelector("body");
const containerSearch = document.querySelector(".container-search");
const sectionStore = document.querySelector(".section-store");
const formLogin = document.querySelector(".login-container form");
const formDaftar = document.querySelector(".daftar-container form");
const form = document.querySelector(".daftar-container form, .login-container form");
const btnProduct = document.querySelector('.btn-lihat-product');


// function menampilkan 8 item
function renderInitialProducts(limit = 8) {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('product-container');
            const showAllButton = document.querySelector('.btn-lihat-product');
            container.innerHTML = "";
            data.slice(0, limit).forEach(item => {
                const productCard = document.createElement("div");
                productCard.classList.add('col-lg-3', 'col-md-4', 'col-6', 'scroll-animation');
                productCard.innerHTML = `
                    <button class="card w-100 shadow-sm">
                        <img src="${item.gambar}" class="card-img-top" alt="${item.nama}">
                        <div class="card-body text-center">
                            <p class="card-text fw-bold">- ${item.nama.toUpperCase()} -</p>
                            <div class="product-icons">
                                <a href="#"><i class="fa-solid fa-cart-shopping"></i></a>
                                <a href="#" class="item-detail-button"><i class="fa-solid fa-eye"></i></a>
                            </div>
                            <div class="product-stars text-warning">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <div class="product-price mt-2">
                                <span>IDR ${item.hargaNormal.toLocaleString()}</span> IDR ${item.hargaDiskon.toLocaleString()}
                            </div>
                        </div>
                    </button>
                `;
                container.appendChild(productCard);
                observer.observe(productCard);
            });
            showAllButton.classList.remove("d-none");
        })
        .catch(error => {
            console.error('Error re-fetching data:', error);
        });
}


// function show login
function showLogin () {
    sections.forEach( section => {
        if (!section.classList.contains("login-container")) {
            section.classList.add("d-none");
            footer.classList.add("d-none");
            sectionStore.style.marginTop = "";
        } else {
            section.classList.remove("d-none");
            body.classList.add("form-background");
        }
        if (!containerSearch.classList.contains("d-none")) {
            containerSearch.classList.add("d-none");
            btnProduct.classList.remove("d-none");
            renderInitialProducts(8);
        } 
    })
}

// show all section
function showAllSection() {
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
    if (!containerSearch.classList.contains("d-none")) {
        containerSearch.classList.add("d-none");
        sectionStore.style.marginTop = "";
        btnProduct.classList.remove("d-none");
        renderInitialProducts(8);
    } 
}

// show daftar 
function showDaftar() {
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