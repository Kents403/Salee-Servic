// script.js - SALEE SERVIS

// ========== MAHSULOTLAR ==========
const products = {
    pubg: [
        { id: 1, name: "60 UC", price: 13000, icon: "fas fa-gamepad" },
        { id: 2, name: "120 UC", price: 25000, icon: "fas fa-gamepad" },
        { id: 3, name: "180 UC", price: 37000, icon: "fas fa-gamepad" },
        { id: 4, name: "325 UC", price: 59000, icon: "fas fa-gamepad" },
        { id: 5, name: "385 UC", price: 71000, icon: "fas fa-gamepad" },
        { id: 6, name: "445 UC", price: 83000, icon: "fas fa-gamepad" },
        { id: 7, name: "660 UC", price: 116000, icon: "fas fa-gamepad" },
        { id: 8, name: "720 UC", price: 127000, icon: "fas fa-gamepad" },
        { id: 9, name: "985 UC", price: 172000, icon: "fas fa-gamepad" },
        { id: 10, name: "1800 UC", price: 286000, icon: "fas fa-gamepad" }
    ]
};

const telegramProducts = {
    premium: [
        { id: 11, name: "Premium 1oy", price: 44000, icon: "fab fa-telegram" },
        { id: 12, name: "Premium 3oy", price: 160000, icon: "fab fa-telegram" },
        { id: 13, name: "Premium 6oy", price: 215000, icon: "fab fa-telegram" },
        { id: 14, name: "Premium 1yil", price: 395000, icon: "fab fa-telegram" }
    ],
    
    stars: [
        { id: 15, name: "50 Stars", price: 11000, icon: "fas fa-star" },
        { id: 16, name: "100 Stars", price: 22000, icon: "fas fa-star" },
        { id: 17, name: "150 Stars", price: 33000, icon: "fas fa-star" },
        { id: 18, name: "200 Stars", price: 43000, icon: "fas fa-star" },
        { id: 19, name: "300 Stars", price: 65000, icon: "fas fa-star" },
        { id: 20, name: "500 Stars", price: 105000, icon: "fas fa-star" },
        { id: 21, name: "1000 Stars", price: 210000, icon: "fas fa-star" }
    ]
};

// ========== GLOBAL O'ZGARUVCHILAR ==========
let cart = JSON.parse(localStorage.getItem('salee_cart')) || [];

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 SALEE SERVIS yuklanmoqda...');
    
    // 1. Mobile menu
    initMobileMenu();
    
    // 2. Cart modal
    initCartModal();
    
    // 3. Telegram button
    const sendBtn = document.getElementById('sendTelegramBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('✅ Telegram button BOSILDI!');
            sendOrderToTelegram();
        });
    }
    
    // 4. Mahsulotlarni yuklash
    loadAllProducts();
    
    // 5. Savatni yangilash
    updateCart();
    
    console.log('✅ Sayt to\'liq yuklandi!');
});

// ========== FUNKSIYALAR ==========

// Mobile menu
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
}

// Cart modal
function initCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.querySelector('.close-cart');
    
    if (!cartIcon || !cartModal) return;
    
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        updateCart();
    });
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

// Mahsulotlarni yuklash
function loadAllProducts() {
    // PUBG mahsulotlari
    const gameContainer = document.getElementById('gameProducts');
    if (gameContainer) {
        gameContainer.innerHTML = products.pubg.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <i class="${product.icon}"></i>
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-body">
                    <div class="product-price">${product.price.toLocaleString('uz-UZ')} UZS</div>
                    <button class="btn-buy" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Barcha Telegram mahsulotlari
    const telegramContainer = document.getElementById('telegramProducts');
    if (telegramContainer) {
        let allTelegram = [...telegramProducts.premium, ...telegramProducts.stars];
        telegramContainer.innerHTML = allTelegram.map(product => `
            <div class="product-card">
                <div class="product-header">
                    <i class="${product.icon}"></i>
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-body">
                    <div class="product-price">${product.price.toLocaleString('uz-UZ')} UZS</div>
                    <button class="btn-buy" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Savatga qo'shish (global funksiya)
window.addToCart = function(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCart();
    saveCart();
    showNotification(`${productName} savatga qo'shildi!`);
}

// Savatni yangilash
function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const orderTotal = document.getElementById('orderTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Savat bo\'sh</p>';
        cartTotal.textContent = '0';
        if (orderTotal) orderTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} UZS × ${item.quantity}</p>
                </div>
                <div>
                    <p style="font-weight: 600; color: var(--accent);">${itemTotal.toLocaleString()} UZS</p>
                    <button onclick="removeFromCart(${item.id})" 
                            style="background: #f72585; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toLocaleString();
    if (orderTotal) orderTotal.textContent = total.toLocaleString();
}

// Savatdan olib tashlash
window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    showNotification('Mahsulot savatdan ochirildi!');
}

// Savatni saqlash
function saveCart() {
    localStorage.setItem('salee_cart', JSON.stringify(cart));
}

// Xabarnoma
function showNotification(message, type = 'success') {
    const oldNotif = document.querySelector('.notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4cc9f0' : '#f72585'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== BUYURTMA YUBORISH ==========

// Buyurtma ID generator
function generateOrderId() {
    let lastCounter = parseInt(localStorage.getItem('salee_last_order_counter')) || 0;
    lastCounter++;
    const orderNumber = lastCounter.toString().padStart(3, '0');
    const orderId = `SALE-${orderNumber}`;
    localStorage.setItem('salee_last_order_counter', lastCounter);
    return orderId;
}

// Telegramga yuborish
function sendOrderToTelegram() {
    console.log('🔥 sendOrderToTelegram ishlayapti!');
    
    // Form ma'lumotlari
    const customerName = document.getElementById('customerName')?.value.trim();
    const telegramUsername = document.getElementById('telegramUsername')?.value.trim();
    const gameId = document.getElementById('gameId')?.value.trim();
    
    console.log('Form:', { customerName, telegramUsername, gameId });
    
    // Validatsiya
    if (!customerName || !telegramUsername || !gameId) {
        alert('Iltimos, barcha maydonlarni to\'ldiring!');
        return;
    }
    
    if (cart.length === 0) {
        alert('Savat bo\'sh!');
        return;
    }
    
    // Buyurtma ID va summa
    const orderId = generateOrderId();
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    console.log('Buyurtma ID:', orderId, 'Summa:', totalAmount);
    
    // Buyurtma ma'lumotlari
    const orderData = {
        id: orderId,
        customerName: customerName,
        telegramUsername: telegramUsername.startsWith('@') ? telegramUsername : '@' + telegramUsername,
        gameId: gameId,
        items: [...cart],
        totalAmount: totalAmount,
        date: new Date().toISOString()
    };
    
    console.log('Buyurtma ma\'lumotlari:', orderData);
    
    // 1. Bot orqali kanalga yuborish
    if (window.saleeBot && typeof window.saleeBot.sendToChannel === 'function') {
        console.log('🤖 Bot orqali yuborilmoqda...');
        window.saleeBot.sendToChannel(orderData)
            .then(success => {
                if (success) {
                    console.log('✅ Bot orqali kanalga yuborildi!');
                } else {
                    console.log('❌ Bot orqali yuborishda xato!');
                }
            });
    } else {
        console.error('❌ saleeBot topilmadi!');
    }
    
    // 2. Mijozni admin ga yuborish
    const adminMessage = formatOrderMessage(orderData);
    const adminUrl = `https://t.me/salee_uz?text=${encodeURIComponent(adminMessage)}`;
    
    alert('Buyurtma qabul qilindi! Telegram ochilmoqda... Admin ga yuboriladi!');
    
    setTimeout(() => {
        window.open(adminUrl, '_blank');
        
        // Tozalash
        completeOrder(orderId);
        
    }, 1000);
}

// Xabarni formatlash
function formatOrderMessage(orderData) {
    let message = `🆕 *YANGI BUYURTMA* #${orderData.id}\n\n`;
    message += `👤 *Mijoz:* ${orderData.customerName}\n`;
    message += `📱 *Telegram:* ${orderData.telegramUsername}\n`;
    message += `🎮 *PUBG ID:* ${orderData.gameId}\n`;
    message += `💰 *Jami summa:* ${orderData.totalAmount.toLocaleString()} UZS\n\n`;
    message += `📦 *Mahsulotlar:*\n`;
    
    orderData.items.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name} - ${item.quantity} dona (${itemTotal.toLocaleString()} UZS)\n`;
    });
    
    message += `\n📅 *Sana:* ${new Date().toLocaleString('uz-UZ')}\n`;
    message += `⚡ *Xizmat:* SALEE SERVIS`;
    
    return message;
}

// Buyurtmani yakunlash
function completeOrder(orderId) {
    // Savatni tozalash
    cart = [];
    localStorage.setItem('salee_cart', JSON.stringify([]));
    updateCart();
    
    // Formani tozalash
    document.getElementById('customerName').value = '';
    document.getElementById('telegramUsername').value = '';
    document.getElementById('gameId').value = '';
    
    // Modalni yopish
    document.getElementById('cartModal').style.display = 'none';
    
    // Xabarnoma
    showNotification(`✅ Buyurtma #${orderId} yuborildi!`, 'success');
}

// Mahsulotlarni yuklash funksiyasini o'zgartiring:
function loadAllProducts() {
    // PUBG mahsulotlari
    const gameContainer = document.getElementById('gameProducts');
    if (gameContainer) {
        gameContainer.innerHTML = products.pubg.map(product => `
            <div class="product-card pubg-card">
                <div class="product-header">
                    <i class="${product.icon}"></i>
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-body">
                    <div class="product-price">${product.price.toLocaleString('uz-UZ')} UZS</div>
                    <button class="btn-buy pubg-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Telegram Premium mahsulotlari
    const telegramPremiumContainer = document.getElementById('telegramPremium');
    if (telegramPremiumContainer) {
        telegramPremiumContainer.innerHTML = telegramProducts.premium.map(product => `
            <div class="product-card telegram-premium-card">
                <div class="product-header">
                    <i class="fab fa-telegram"></i>
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-body">
                    <div class="product-price">${product.price.toLocaleString('uz-UZ')} UZS</div>
                    <button class="btn-buy telegram-premium-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Telegram Stars mahsulotlari
    const telegramStarsContainer = document.getElementById('telegramStars');
    if (telegramStarsContainer) {
        telegramStarsContainer.innerHTML = telegramProducts.stars.map(product => `
            <div class="product-card telegram-stars-card">
                <div class="product-header">
                    <i class="fas fa-star"></i>
                    <h3 class="product-title">${product.name}</h3>
                </div>
                <div class="product-body">
                    <div class="product-price">${product.price.toLocaleString('uz-UZ')} UZS</div>
                    <button class="btn-buy telegram-stars-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `).join('');
    }
}