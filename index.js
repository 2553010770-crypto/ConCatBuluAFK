const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- WEB SERVER (GIỮ RENDER SỐNG) ---
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot đang chạy chế độ Giả Lập Người Chơi (Anti-Ban V2)'));
app.listen(PORT, () => console.log(`[WEB] Server on port ${PORT}`));

// --- CẤU HÌNH BOT ---
const botOptions = {
    host: 'AeDaDen-TWSO.aternos.me', // IP Server
    port: 25560,                    // Port Server
    username: 'ConCatBulu',         // Tên Bot (Dùng tên cũ để admin nhận ra)
    version: '1.21.1',              // Phiên bản giả lập
    auth: 'offline'
};

let bot;

function createBot() {
    console.log(`[BOT] Đang kết nối...`);
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('[BOT] >> Đã vào server! Bắt đầu kích hoạt hành vi giả người.');
        // Bắt đầu vòng lặp hành động ngẫu nhiên
        randomBehavior(); 
    });

    bot.on('spawn', () => {
        // Chat một câu ngẫu nhiên khi mới vào để server tin là người
        setTimeout(() => {
            bot.chat('Hello server, bot da online lai roi!');
        }, 5000);
    });

    bot.on('end', (reason) => {
        console.log(`[BOT] >> Mất kết nối: ${reason}. Thử lại sau 60s...`);
        setTimeout(createBot, 60000); // Đợi lâu hơn chút để tránh bị flag spam
    });

    bot.on('error', (err) => console.log(`[BOT] >> Lỗi: ${err.message}`));
    
    bot.on('kicked', (reason) => {
        console.log(`[BOT] >> Bị kick: ${reason}`);
    });
}

// --- HÀM HÀNH ĐỘNG NGẪU NHIÊN (QUAN TRỌNG) ---
function randomBehavior() {
    // Chỉ hoạt động nếu bot còn kết nối
    if (!bot || !bot.entity) return;

    // Danh sách các hành động có thể làm
    const actions = [
        'jump',         // Nhảy
        'rotate',       // Quay đầu nhìn quanh
        'swing',        // Đánh tay
        'sneak',        // Ngồi xuống (Shift)
        'switch_slot'   // Đổi ô đồ trên tay
    ];

    // Chọn bừa 1 hành động
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    // Thực hiện hành động
    switch (randomAction) {
        case 'jump':
            bot.setControlState('jump', true);
            // Nhảy trong khoảng thời gian ngẫu nhiên từ 0.5s đến 1s
            setTimeout(() => bot.setControlState('jump', false), 500 + Math.random() * 500);
            break;

        case 'rotate':
            // Quay đầu ngẫu nhiên một chút
            const yaw = (Math.random() - 0.5) * Math.PI; // Quay trái phải
            const pitch = (Math.random() - 0.5) * Math.PI / 2; // Nhìn lên xuống
            bot.look(bot.entity.yaw + yaw, pitch);
            break;

        case 'swing':
            bot.swingArm('right');
            break;

        case 'sneak':
            bot.setControlState('sneak', true);
            setTimeout(() => bot.setControlState('sneak', false), 1000 + Math.random() * 2000);
            break;
            
        case 'switch_slot':
            // Chọn ngẫu nhiên ô từ 0 đến 8 (thanh hotbar)
            bot.setQuickBarSlot(Math.floor(Math.random() * 9));
            break;
    }

    // --- QUAN TRỌNG NHẤT: THỜI GIAN CHỜ NGẪU NHIÊN ---
    // Không bao giờ lặp lại đúng giờ.
    // Random thời gian chờ từ 10 giây đến 40 giây.
    const nextTime = 10000 + Math.random() * 30000; 
    
    console.log(`[Anti-AFK] Đã làm: ${randomAction}. Hành động tiếp theo sau: ${Math.round(nextTime/1000)}s`);
    
    setTimeout(randomBehavior, nextTime);
}

createBot();
