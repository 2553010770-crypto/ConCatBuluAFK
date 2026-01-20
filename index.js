const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- WEB SERVER (GIỮ RENDER SỐNG) ---
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Bot V3: Đang chạy chế độ Anti-Idle Pro (Di chuyển thực tế)'));
app.listen(PORT, () => console.log(`[WEB] Server on port ${PORT}`));

// --- CẤU HÌNH BOT ---
const botOptions = {
    host: 'AeDaDen-TWSO.aternos.me',
    port: 25560,
    username: 'ConCatBulu',
    version: '1.21.1',
    auth: 'offline'
};

let bot;

function createBot() {
    console.log(`[BOT] Đang kết nối...`);
    bot = mineflayer.createBot(botOptions);

    bot.on('login', () => {
        console.log('[BOT] >> Đã vào server! Kích hoạt chế độ di chuyển chống AFK.');
        randomBehavior(); 
    });

    bot.on('spawn', () => {
        // Chat một câu ngẫu nhiên khi mới vào
        setTimeout(() => {
            bot.chat('Hello server, bot da online!');
        }, 5000);
    });

    bot.on('end', (reason) => {
        console.log(`[BOT] >> Mất kết nối: ${reason}. Thử lại sau 30s...`);
        // Xóa bot cũ để tránh rò rỉ bộ nhớ
        bot = null;
        setTimeout(createBot, 30000);
    });

    bot.on('error', (err) => console.log(`[BOT] >> Lỗi: ${err.message}`));
    
    bot.on('kicked', (reason) => {
        console.log(`[BOT] >> Bị kick: ${reason}`);
    });
}

// --- HÀM HÀNH ĐỘNG NGẪU NHIÊN (NÂNG CẤP) ---
function randomBehavior() {
    if (!bot || !bot.entity) return;

    // Danh sách hành động mở rộng (Bao gồm di chuyển)
    const actions = [
        'walk_forward', // Đi tới
        'walk_back',    // Đi lùi
        'walk_left',    // Đi trái
        'walk_right',   // Đi phải
        'jump',         // Nhảy
        'rotate',       // Quay đầu
        'swing',        // Đánh tay
        'look_at_player' // Nhìn người gần nhất
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    // Thời gian thực hiện hành động (ngắn để không đi quá xa)
    const duration = 500 + Math.random() * 1000; // 0.5s - 1.5s

    switch (randomAction) {
        case 'walk_forward':
            bot.setControlState('forward', true);
            setTimeout(() => bot.setControlState('forward', false), duration);
            break;
            
        case 'walk_back':
            bot.setControlState('back', true);
            setTimeout(() => bot.setControlState('back', false), duration);
            break;

        case 'walk_left':
            bot.setControlState('left', true);
            setTimeout(() => bot.setControlState('left', false), duration);
            break;

        case 'walk_right':
            bot.setControlState('right', true);
            setTimeout(() => bot.setControlState('right', false), duration);
            break;

        case 'jump':
            bot.setControlState('jump', true);
            setTimeout(() => bot.setControlState('jump', false), duration);
            break;

        case 'rotate':
            const yaw = (Math.random() - 0.5) * Math.PI; 
            const pitch = (Math.random() - 0.5) * Math.PI / 2;
            bot.look(bot.entity.yaw + yaw, pitch);
            break;

        case 'swing':
            bot.swingArm('right');
            break;

        case 'look_at_player':
            // Tìm thực thể gần nhất (người chơi hoặc mob)
            const entity = bot.nearestEntity();
            if (entity) {
                bot.lookAt(entity.position.offset(0, entity.height, 0));
                bot.swingArm('right'); // Vẫy tay chào
            } else {
                // Nếu không có ai thì quay đầu ngẫu nhiên
                bot.look(bot.entity.yaw + 1, 0);
            }
            break;
    }

    // --- THỜI GIAN CHỜ MỚI ---
    // Giảm xuống còn 2 - 8 giây để server thấy bot hoạt động liên tục
    const nextTime = 2000 + Math.random() * 6000; 
    
    console.log(`[Anti-AFK] Hành động: ${randomAction}. Chờ: ${Math.round(nextTime/1000)}s`);
    
    setTimeout(randomBehavior, nextTime);
}

createBot();
