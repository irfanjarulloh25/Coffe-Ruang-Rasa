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

const elementsToObserve = document.querySelectorAll(".hero, .section-store, .scroll-animation, .contact-form, .input-group, .about-judul h2, .about-deskripsi h2, .line-head i, .about-visi, .login-button, .modal-content img, .modal-content .product-content, .container-search ");

elementsToObserve.forEach((element) => {
    observer.observe(element);
});

// const const
const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('.navbar-collapse');
const itemDetailModal = document.querySelector('#item-detail-modal');

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
        const itemDetailProducts = document.querySelector('.modal-box');
        const cartSection = document.getElementById("cart-section");
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
                                <a class="add-to-cart" data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i></a>
                                <a class="item-detail-button" data-id="${item.id}"><i class="fa-solid fa-eye"></i></a>
                            </div>
                            <div class="product-stars text-warning">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <div class="product-price mt-2">
                                <span>IDR ${item.hargaNormal.toLocaleString().replace(/,/g, '.')}</span> IDR ${item.hargaDiskon.toLocaleString().replace(/,/g, '.')}
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

        // show modal Box
        function showById(id) {
            itemDetailModal.classList.add("active");
            // console.log("Clicked ID:", id);
            const product = data.find(item => item.id == id);
            if(product) {
                itemDetailProducts.classList.remove("d-none");
        
                itemDetailProducts.querySelector("img").src = product.gambar;
                itemDetailProducts.querySelector("h3").textContent = product.nama;
                itemDetailProducts.querySelector("p").textContent = product.deskripsi;
                itemDetailProducts.querySelector(".product-price").innerHTML = `IDR ${product.hargaDiskon.toLocaleString().replace(/,/g, '.')}<span> IDR ${product.hargaNormal.toLocaleString().replace(/,/g, '.')}</span>`;
            }
        }


        let cartItemsMap = {};
        function renderCartShopping (product){
            if (cartItemsMap[product.id]) return;
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${product.gambar}" alt="${product.nama}"/>
                <div class="item-detail">
                    <h3>${product.nama}</h3>
                    <div class="item-price">IDR ${product.hargaDiskon.toLocaleString().replace(/,/g, '.')}</div>
                </div> 
                <div class="cart-aksi">
                    <button class="kurang-item"><i class="fa-solid fa-minus"></i></button>
                    <h5 class="jumlah-cart">1</h5>
                    <button class="tambah-item"><i class="fa-solid fa-plus"></i></button>
                </div>
            `;

            cartSection.classList.remove("d-none");
            cartSection.appendChild(cartItem);

            cartItemsMap[product.id] = {
                element: cartItem,
                jumlah: 1
            }
            const btnKurang = cartItem.querySelector(".kurang-item");
            const btnTambah = cartItem.querySelector(".tambah-item");
            const jumlahCart = cartItem.querySelector(".jumlah-cart");

            btnTambah.addEventListener("click", () => {
                cartItemsMap[product.id].jumlah++;
                jumlahCart.textContent = cartItemsMap[product.id].jumlah;
                updateCartNotif();
            });
            btnKurang.addEventListener("click", () => {
                // if(cartItemsMap[product.id].jumlah > 1) {
                //     cartItemsMap[product.id].jumlah--;
                //     jumlahCart.textContent = cartItemsMap[product.id].jumlah;
                // } else {
                //     cartItem.remove();
                //     delete cartItemsMap[product.id];
                // }
                if (cartItemsMap[product.id].jumlah <= 1) {
                    cartItem.remove();
                    delete cartItemsMap[product.id];
                    } else {
                        cartItemsMap[product.id].jumlah--;
                        jumlahCart.textContent = cartItemsMap[product.id].jumlah;
                }
                updateCartNotif();
            })

            updateCartNotif();
        }

        function updateCartNotif() {
            const cartNotif = document.querySelector(".cart-notif");
            const totalJenisItem = Object.keys(cartItemsMap).length;
            cartNotif.textContent = totalJenisItem;
        }

        document.addEventListener("click", function (e) {
            const btn = e.target.closest(".item-detail-button");
            if (btn) {
                e.preventDefault();
                const id = btn.getAttribute("data-id");
                showById(id);
            }

            const cartBtn = e.target.closest(".add-to-cart");
            if (cartBtn) {
                e.preventDefault();
                const id = cartBtn.getAttribute("data-id");
                const product = data.find(item => item.id == id);
                if (product) {
                    renderCartShopping(product);
                }
            }
        });

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
const cart = document.querySelector(".cart")
const cartShopping = document.querySelector(".shopping-cart")


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
                                <a data-id="${item.id}"><i class="fa-solid fa-cart-shopping"></i></a>
                                <a class="item-detail-button" data-id="${item.id}"><i class="fa-solid fa-eye"></i></a>
                            </div>
                            <div class="product-stars text-warning">
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i> 
                                <i class="fa-regular fa-star"></i>
                                <i class="fa-regular fa-star"></i>
                            </div>
                            <div class="product-price mt-2">
                                <span>IDR ${item.hargaNormal.toLocaleString().replace(/,/g, '.')}</span> IDR ${item.hargaDiskon.toLocaleString().replace(/,/g, '.')}
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
        if (section.classList.contains("login-container") || section.classList.contains("daftar-container") || section.classList.contains("modal-box")) {
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

// close modal box
document.querySelector('.modal-box .close-icon').onclick = (e) => {
    itemDetailModal.classList.add("d-none");
    e.preventDefault();
};

window.onclick = (e) => {
    if (e.target === itemDetailModal){
        itemDetailModal.classList.add("d-none");
    }
};

// cart shopping
function showCartShopping() {
    cartShopping.classList.remove("d-none");
}

// klik diluar elemen
document.addEventListener("click", function(e) {
    if (!cartShopping.contains(e.target) && !cart.contains(e.target)) {
        cartShopping.classList.add("d-none");
    }
})
  