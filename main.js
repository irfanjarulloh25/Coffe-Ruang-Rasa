const navbarToggler = document.querySelector('.navbar-toggler');
const navbarNav = document.querySelector('.navbar-collapse');
const itemDetailModal = document.querySelector('#item-detail-modal');
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
const checkoutContainer = document.querySelector(".checkout-container")


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

const elementsToObserve = document.querySelectorAll(".hero, .section-store, .scroll-animation, .contact-form, .input-group, .about-judul h2, .about-deskripsi h2, .line-head i, .about-visi, .login-button, .modal-content img, .modal-content .product-content, .container-search, .checkout-items, .payment-section");

elementsToObserve.forEach((element) => {
    observer.observe(element);
});

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
        const searchInput = document.getElementById('search-input');
        let displayedItems = 8;
        let cartItemsMap = {};

        function renderProducts(limit) {
            container.innerHTML = "";
            data.slice(0, limit).forEach(item => {
                const productCard = document.createElement("div");
                productCard.classList.add('item-card', 'col-lg-3', 'col-md-4', 'col-6', 'scroll-animation');
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

                const addToCartBtn = itemDetailProducts.querySelector("#add-to-cart-button");
                if (addToCartBtn) {
                    addToCartBtn.setAttribute("data-id", product.id);
                }
            }
        }

        // search
        function searchProducts(keyword) {
            const cards = container.querySelectorAll(".item-card");
            cards.forEach(card => {
                const productName = card.querySelector(".card-text").textContent.toLowerCase();
                if (productName.includes(keyword.toLowerCase())) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            })
        }

        searchInput.addEventListener("input", function() {
            const keyword = this.value;
            searchProducts(keyword);
        })

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
                    itemDetailModal.classList.remove("active");
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

        document.addEventListener("click", function(e) {
            const cartBtn = e.target.closest(".add-to-cart");
            const btnDetail = e.target.closest(".item-detail-button");
            const btnCheckout = e.target.closest(".btn-checkout");
            const kurangQtyBtn = e.target.closest(".kurang-qty");
            const tambahQtyBtn = e.target.closest(".tambah-qty");
            const hapusItemBtn = e.target.closest(".hapus-item");
            if (btnDetail) {
                e.preventDefault();
                const id = btnDetail.getAttribute("data-id");
                showById(id);
            }

            if (cartBtn) {
                e.preventDefault();
                const id = cartBtn.getAttribute("data-id");
                const product = data.find(item => item.id == id);
                if (product) {
                    renderCartShopping(product);
                    itemDetailModal.classList.remove("active");
                }
            }

            const footer = document.querySelector("footer");
            if (btnCheckout) {
                e.preventDefault();
                if (Object.keys(cartItemsMap).length === 0) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Keranjang Kosong!',
                        text: 'Silakan pilih barang terlebih dahulu.',
                        confirmButtonText: 'Oke'
                    });
                    document.querySelector("#store").scrollIntoView({ behavior: "smooth" });
                } else {
                    sections.forEach(section => {
                        if (!section.classList.contains("checkout-container")) {
                            section.classList.add("d-none");
                            footer.classList.add("d-none")
                        } else {
                            section.classList.remove("d-none");
                            cart.classList.add("disable-click");
                        }
                    });
                    renderCheckout();
                }
            }

            if (kurangQtyBtn) {
                e.preventDefault();
                const qtySpan = kurangQtyBtn.nextElementSibling;
                let qty = parseInt(qtySpan.textContent);
                if (qty > 1) {
                    qty--;
                    qtySpan.textContent = qty;
                    updateTotalPrice(qtySpan);
                    updateGrandTotal()
                } else {
                    const checkoutItem = kurangQtyBtn.closest(".checkout-item");
                    const productName = checkoutItem.querySelector("h5").textContent;
                    let productIdToDelete = null;
                    for (const [id, cartData] of Object.entries(cartItemsMap)) {
                        const name = cartData.element.querySelector("h3").textContent;
                        if (name === productName) {
                            productIdToDelete = id;
                            break;
                        }
                    }

                    if (productIdToDelete) {
                        const cartItemElement = cartItemsMap[productIdToDelete].element;
                        cartItemElement.remove();
                        delete cartItemsMap[productIdToDelete];
                        updateCartNotif();
                        const checkoutItemContainer = document.querySelector(".checkout-items");
                        checkoutItemContainer.innerHTML = "";
                        if (Object.keys(cartItemsMap).length === 0) {
                            const emptyMessage = document.createElement("div");
                            emptyMessage.classList.add("empty-message");
                            emptyMessage.innerHTML = "<span>Keranjang Kosong!</span><p>Silakan pilih barang terlebih dahulu.</p>";
                            checkoutItemContainer.appendChild(emptyMessage);
                        }
                    }

                    checkoutItem.remove();
                    updateGrandTotal();
                }
            }

            if (tambahQtyBtn) {
                e.preventDefault();
                const qtySpan = tambahQtyBtn.previousElementSibling;
                let qty = parseInt(qtySpan.textContent);
                qty++;
                qtySpan.textContent = qty;
                updateTotalPrice(qtySpan);
                updateGrandTotal()
            }

            if (hapusItemBtn) {
                e.preventDefault();
                const checkoutItem = hapusItemBtn.closest(".checkout-item");
                const productName = checkoutItem.querySelector("h5").textContent;
                let productIdToDelete = null;
                for (const [id, cartData] of Object.entries(cartItemsMap)) {
                    const name = cartData.element.querySelector("h3").textContent;
                    if (name === productName) {
                        productIdToDelete = id;
                        break;
                    }
                }
            
                if (productIdToDelete) {
                    const cartItemElement = cartItemsMap[productIdToDelete].element;
                    cartItemElement.remove();
                    delete cartItemsMap[productIdToDelete];
                    updateCartNotif();

                    const checkoutItemContainer = document.querySelector(".checkout-items");
                    checkoutItemContainer.innerHTML = "";
                    if (Object.keys(cartItemsMap).length === 0) {
                        const emptyMessage = document.createElement("div");
                        emptyMessage.classList.add("empty-message");
                        emptyMessage.innerHTML = "<span>Keranjang Kosong!</span><p>Silakan pilih barang terlebih dahulu.</p>";
                        checkoutItemContainer.appendChild(emptyMessage);
                    }
                }
            
                checkoutItem.remove();
                updateGrandTotal();
            }
        });

        function renderCheckout() {
            const checkoutItemContainer = document.querySelector(".checkout-items");
            checkoutItemContainer.innerHTML = "";

            Object.entries(cartItemsMap).forEach(([productId, cartItemData]) => {
                const product = cartItemData.element;
                const nama = product.querySelector("h3").textContent;
                const gambar = product.querySelector("img").src;
                const hargaText = product.querySelector(".item-price").textContent.replace("IDR ", "").replace(/\./g, '');
                const harga = parseInt(hargaText);
                const jumlah = cartItemData.jumlah;
                const totalHarga = harga * jumlah;

                const checkoutItem = document.createElement("div");
                checkoutItem.classList.add("checkout-item", "d-flex", "align-items-center");
                checkoutItem.innerHTML = `
                    <img src="${gambar}" alt="${nama}" class="img-thumbnail">
                    <div class="item-info d-flex">
                        <h5>${nama}</h5>
                    </div>
                    <div class="item-actions d-flex">
                        <div class="item-harga me-3">
                            <p class="harga-satuan me-2 mt-3" data-harga="${harga}">Rp.${harga.toLocaleString('id-ID')}</p>
                        </div>
                        <div class="item-qty">  
                            <button class="btn kurang-qty">
                                <i class="fa-solid fa-minus"></i>
                            </button>
                            <span class="total-qty">${jumlah}</span>
                            <button class="btn tambah-qty">
                                <i class="fa-solid fa-plus"></i>
                            </button>
                            <a href="#" class="hapus-item text-decoration-underline"><i class="fa-solid fa-trash"></i></a>
                        </div>
                    </div>
                    <div class="item-total-price d-flex ms-3">
                        <div class="total-price-head">
                            <p class="me-3 mt-3">Total :</p>
                        </div>
                        <div class="total-price">
                            <p class="mt-3">Rp.${totalHarga.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                `;
                checkoutItemContainer.appendChild(checkoutItem);
            });
            updateGrandTotal()
        }

        function updateTotalPrice(qtySpan) {
            const checkoutItem = qtySpan.closest(".checkout-item");
            const hargaSatuanElement = checkoutItem.querySelector(".harga-satuan");
            
            if (!hargaSatuanElement) {
                console.error("Element .harga-satuan tidak ditemukan!");
                return;
            }
    
            const hargaSatuan = parseInt(hargaSatuanElement.getAttribute("data-harga"));
            const jumlah = parseInt(qtySpan.textContent);
            const totalHargaBaru = hargaSatuan * jumlah;
            
            const totalHargaElement = checkoutItem.querySelector(".total-price p");
            if (totalHargaElement) {
                totalHargaElement.textContent = `Rp.${totalHargaBaru.toLocaleString('id-ID')}`;
            }
        }

        function updateGrandTotal() {
            const totalHargaElement = document.querySelectorAll(".total-price p");
            let grandTotal = 0;
            totalHargaElement.forEach(item => {
                const hargaText = item.textContent.replace("Rp.", "").replace(/\./g, '').replace(",", '');
                const harga = parseInt(hargaText) || 0;
                grandTotal += harga;
            });
            const grandTotalElement = document.querySelector(".grand-total");
            if (grandTotalElement) {
                grandTotalElement.textContent = `Rp.${grandTotal.toLocaleString('id-ID')}`;
            }
        }

        showAllButton.addEventListener("click", handleShowAll);
        btnStore.addEventListener("click", handleShowAll);
    }).catch(error => {
        console.error('Error fetching data:', error);
    });
})

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
        if (!checkoutContainer.classList.contains("d-none")) {
            checkoutContainer.classList.add("d-none");
        }
    })
    cart.classList.remove("disable-click");
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
    if (!checkoutContainer.classList.contains("d-none")) {
        checkoutContainer.classList.add("d-none");
    }
    cart.classList.remove("disable-click");
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
    cart.classList.remove("disable-click");
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
  