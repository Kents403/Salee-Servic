// bot.js - Telegram bot
class SaleeBot {
    constructor() {
        // Token to'g'ridan
        this.BOT_TOKEN = '8426398720:AAEd-mMqpc_dPNQSqmAMht67t3I16nc2b3A';
        this.CHANNEL_ID = '@salee_servis';
        this.API_URL = 'https://api.telegram.org/bot';
        
        console.log('🤖 Salee Bot yuklandi');
    }
    
    // Kanalga yuborish
    async sendToChannel(orderData) {
        try {
            console.log('📤 Kanalga yuborish:', orderData.id);
            
            const message = this.formatMessage(orderData);
            
            const response = await fetch(`${this.API_URL}${this.BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: this.CHANNEL_ID,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });
            
            const result = await response.json();
            
            if (result.ok) {
                console.log('✅ Kanalga yuborildi!');
                return true;
            } else {
                console.error('❌ Telegram xatosi:', result.description);
                return false;
            }
            
        } catch (error) {
            console.error('🔥 Bot xatosi:', error);
            return false;
        }
    }
    
    // Xabarni formatlash
    formatMessage(order) {
        let message = `<b>🆕 YANGI BUYURTMA #${order.id}</b>\n\n`;
        message += `<b>👤 Mijoz:</b> ${order.customerName}\n`;
        message += `<b>📱 Telegram:</b> ${order.telegramUsername}\n`;
        message += `<b>🎮 O'yin ID:</b> ${order.gameId}\n\n`;
        message += `<b>📦 Mahsulotlar:</b>\n`;
        
        order.items.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            message += `${index + 1}. <b>${item.name}</b>\n`;
            message += `   Narxi: ${item.price.toLocaleString('uz-UZ')} UZS\n`;
            message += `   Soni: ${item.quantity} ta\n`;
            message += `   Summa: ${itemTotal.toLocaleString('uz-UZ')} UZS\n\n`;
        });
        
        message += `<b>💰 JAMI:</b> ${order.totalAmount.toLocaleString('uz-UZ')} UZS\n`;
        
        const date = new Date(order.date);
        const time = date.toLocaleTimeString('uz-UZ', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        const sana = date.toLocaleDateString('uz-UZ');
        message += `<b>📅 Sana:</b> ${sana}\n`;
        message += `<b>⏰ Vaqt:</b> ${time}\n`;
        message += `<i>⚡ Salee Servis</i>`;
        
        return message;
    }
}

// Global bot obyekti
window.saleeBot = new SaleeBot();

// Oddiy xabarnoma
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; padding: 12px 20px; border-radius: 8px; background: ${type === 'success' ? '#4CAF50' : '#F44336'}; color: white; font-size: 14px;">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);