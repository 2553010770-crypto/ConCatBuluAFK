const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// ==========================================
// PHẦN 1: WEB SERVER (ĐỂ TREO TRÊN RENDER)
// ==========================================
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Bot Minecraft đang chạy ổn định 24/7!');
});

app.listen(PORT, () => {
    console.log(`[WEB] Server đang lắng nghe tại port ${PORT}`);
});

// ==========================================
// PHẦN 2: CẤU HÌNH BOT MINECRAFT
// ==========================================
const botOptions = {
    host: 'AeDaDen-TWSO.aternos.me', // IP Server của bạn
    port: 25560,                    // Port Server của bạn
    username: 'ConCatBulu',       // Tên bot
    
    // QUAN TRỌNG: Giữ nguyên 1.21.1 để khớp với thư viện hiện tại.
    // (Yêu cầu Server Aternos phải cài plugin ViaVersion + ViaBackwards)
    version: '1.21.1',              
    
    auth: 'offline',                // Chế độ Crack
    
    // Ẩn bot khỏi danh sách người chơi (nếu server hỗ trợ) để tránh bị lag
    hideErrors: false
};

let bot;

function createBot() {
    console.log(`\n[BOT] Đang kết nối tới ${botOptions.host}:${botOptions.port}...`);
    
    bot = mineflayer.createBot(botOptions);

    // 1. KHI BOT VÀO THÀNH CÔNG
    bot.on('login', () => {
        console.log('[BOT] >> Đăng nhập thành công!');
        console.log('[BOT] >> Đang hoạt động ở chế độ: ' + bot.game.gameMode);
        bot.chat('Bot treo 24/7 da online! (Mode: Creative/Adventure)');
    });

    // 2. KHI BOT XUẤT HIỆN -> BẬT CHỐNG AFK
    bot.on('spawn', () => {
        console.log('[BOT] >> Bot đã Spawn. Kích hoạt Anti-AFK.');
        
        // Chu kỳ mỗi 30 giây thực hiện hành động 1 lần
        setInterval(() => {
            // Chỉ thực hiện nếu bot còn kết nối
            if (bot.entity) {
                // Nhảy nhẹ
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                
                // Quay đầu ngẫu nhiên để server biết đang hoạt động
                bot.look(Math.random() * 3, Math.random() * 3);
                
                // Đánh nhẹ vào không khí (swing arm)
                bot.swingArm('right');
            }
        }, 30000); 
    });

    // 3. TỰ ĐỘNG KẾT NỐI LẠI KHI BỊ DISCONNECT
    bot.on('end', (reason) => {
        console.log(`[BOT] >> Mất kết nối: ${reason}`);
        console.log('[BOT] >> Sẽ tự kết nối lại sau 30 giây...');
        
        // Đợi 30s rồi tạo lại bot mới
        setTimeout(createBot, 30000);
    });

    // 4. XỬ LÝ LỖI (Để không bị crash app)
    bot.on('error', (err) => {
        console.log(`[BOT] >> Lỗi: ${err.message}`);
        if (err.message.includes('Version')) {
            console.log('[GỢI Ý] Hãy chắc chắn Server Aternos đã cài ViaVersion và ViaBackwards!');
        }
    });
    
    bot.on('kicked', (reason) => {
        console.log(`[BOT] >> Bị kick khỏi server: ${reason}`);
    });
}

// BẮT ĐẦU CHẠY BOT
createBot();