// ============================================
// NAVIGATION
// ============================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// HERO SECTION - NAME CLICK COUNTER (Hidden Feature)
// ============================================
let nameClickCount = 0;
const nameTitle = document.getElementById('name-title');
const clickCounter = document.querySelector('.click-counter');
const clickCountSpan = document.getElementById('click-count');

nameTitle.addEventListener('click', () => {
    nameClickCount++;
    clickCountSpan.textContent = nameClickCount;
    
    // Show counter after 5 clicks
    if (nameClickCount === 5) {
        clickCounter.style.display = 'block';
        nameTitle.classList.add('active'); // Add glitch effect
    }
    
    // Special message at 10 clicks
    if (nameClickCount === 10) {
        alert('🎉 You found the click counter! Keep exploring for more secrets!');
    }
    
    // Unlock secret game at 15 clicks
    if (nameClickCount === 15) {
        document.getElementById('secret-game-btn').style.display = 'inline-block';
        alert('🎯 Secret game unlocked! Check the games section!');
    }
});

// ============================================
// KONAMI CODE EASTER EGG
// ============================================
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.startsWith('Arrow') ? e.key : e.code;
    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateMatrixRain();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// ============================================
// MATRIX RAIN EFFECT (Hidden Feature)
// ============================================
function activateMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');
    
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let animationId;
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    animationId = setInterval(draw, 33);
    
    alert('🎊 Matrix Mode Activated! Press OK to continue.');
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(animationId);
        canvas.classList.remove('active');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 10000);
}

// ============================================
// SECRET DEVELOPER CONSOLE MESSAGES
// ============================================
console.log('%c🚀 Welcome to Simon Glisnik\'s Portfolio!', 'font-size: 20px; color: #6366f1; font-weight: bold;');
console.log('%c💡 Hint: Try the Konami Code (↑ ↑ ↓ ↓ ← → ← → B A)', 'font-size: 14px; color: #8b5cf6;');
console.log('%c🎮 Click my name multiple times for a surprise!', 'font-size: 14px; color: #ec4899;');
console.log('%c🔍 Keep exploring - there are more secrets hidden throughout the site!', 'font-size: 14px; color: #10b981;');

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✉️ Thank you for your message! I will get back to you soon.');
    contactForm.reset();
});

// ============================================
// GAMES SECTION
// ============================================
const gameBtns = document.querySelectorAll('.game-btn');
const gameContainers = document.querySelectorAll('.game-container');
const closeGameBtns = document.querySelectorAll('.close-game');

gameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const gameType = btn.getAttribute('data-game');
        gameContainers.forEach(container => container.style.display = 'none');
        
        if (gameType === 'snake') {
            document.getElementById('snake-game').style.display = 'block';
            initSnakeGame();
        } else if (gameType === 'memory') {
            document.getElementById('memory-game').style.display = 'block';
            initMemoryGame();
        } else if (gameType === 'secret') {
            document.getElementById('secret-game').style.display = 'block';
            initPongGame();
        }
    });
});

closeGameBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.game-container').style.display = 'none';
    });
});

// ============================================
// SNAKE GAME
// ============================================
let snakeGame = null;

function initSnakeGame() {
    if (snakeGame) {
        snakeGame.stop();
    }
    
    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const tileCount = 20;
    
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameLoop;
    
    document.getElementById('snake-high-score').textContent = highScore;
    document.getElementById('snake-score').textContent = score;
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw snake
        ctx.fillStyle = '#10b981';
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = '#059669';
            } else {
                ctx.fillStyle = '#10b981';
            }
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
        
        // Draw food
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }
    
    function update() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            gameOver();
            return;
        }
        
        // Check self collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('snake-score').textContent = score;
            generateFood();
        } else {
            snake.pop();
        }
        
        draw();
    }
    
    function generateFood() {
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
            attempts++;
        } while (
            snake.some(segment => segment.x === food.x && segment.y === food.y) && 
            attempts < maxAttempts
        );
    }
    
    function gameOver() {
        clearInterval(gameLoop);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore);
            document.getElementById('snake-high-score').textContent = highScore;
            alert('🎉 New High Score: ' + highScore + '!');
        } else {
            alert('Game Over! Score: ' + score);
        }
    }
    
    function handleKeyPress(e) {
        const key = e.key;
        
        if (key === 'ArrowUp' && dy === 0) {
            dx = 0;
            dy = -1;
        } else if (key === 'ArrowDown' && dy === 0) {
            dx = 0;
            dy = 1;
        } else if (key === 'ArrowLeft' && dx === 0) {
            dx = -1;
            dy = 0;
        } else if (key === 'ArrowRight' && dx === 0) {
            dx = 1;
            dy = 0;
        }
    }
    
    document.addEventListener('keydown', handleKeyPress);
    
    gameLoop = setInterval(update, 100);
    draw();
    
    snakeGame = {
        stop: () => {
            clearInterval(gameLoop);
            document.removeEventListener('keydown', handleKeyPress);
        }
    };
    
    document.getElementById('snake-restart').onclick = initSnakeGame;
}

// ============================================
// MEMORY CARD GAME
// ============================================
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const symbols = ['🎮', '🚀', '💻', '🎨', '🎵', '⚡', '🌟', '🔥'];
    const cards = [...symbols, ...symbols];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    
    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);
    
    board.innerHTML = '';
    document.getElementById('memory-moves').textContent = 0;
    document.getElementById('memory-pairs').textContent = 0;
    
    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
    });
    
    function flipCard(card) {
        if (flippedCards.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }
        
        card.classList.add('flipped');
        card.textContent = card.dataset.symbol;
        flippedCards.push(card);
        
        if (flippedCards.length === 2) {
            moves++;
            document.getElementById('memory-moves').textContent = moves;
            
            setTimeout(checkMatch, 500);
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        
        if (card1.dataset.symbol === card2.dataset.symbol) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            document.getElementById('memory-pairs').textContent = matchedPairs;
            
            if (matchedPairs === symbols.length) {
                setTimeout(() => {
                    alert('🎉 Congratulations! You won in ' + moves + ' moves!');
                }, 300);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.textContent = '';
            card2.textContent = '';
        }
        
        flippedCards = [];
    }
    
    document.getElementById('memory-restart').onclick = initMemoryGame;
}

// ============================================
// SECRET PONG GAME
// ============================================
let pongGame = null;

function initPongGame() {
    if (pongGame) {
        pongGame.stop();
    }
    
    const canvas = document.getElementById('pong-canvas');
    const ctx = canvas.getContext('2d');
    
    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballSize = 10;
    
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let cpuY = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 5;
    let ballSpeedY = 3;
    let playerScore = 0;
    let cpuScore = 0;
    let gameLoop;
    
    document.getElementById('pong-player-score').textContent = playerScore;
    document.getElementById('pong-cpu-score').textContent = cpuScore;
    
    function draw() {
        // Clear canvas
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw center line
        ctx.strokeStyle = '#6366f1';
        ctx.setLineDash([5, 15]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw paddles
        ctx.fillStyle = '#10b981';
        ctx.fillRect(20, playerY, paddleWidth, paddleHeight);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(canvas.width - 30, cpuY, paddleWidth, paddleHeight);
        
        // Draw ball
        ctx.fillStyle = '#fff';
        ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);
    }
    
    function update() {
        // Move ball
        ballX += ballSpeedX;
        ballY += ballSpeedY;
        
        // Ball collision with top/bottom
        if (ballY <= 0 || ballY >= canvas.height) {
            ballSpeedY = -ballSpeedY;
        }
        
        // Ball collision with paddles
        if (ballX <= 30 && ballY >= playerY && ballY <= playerY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Increase speed slightly but cap at maximum
            const maxSpeed = 12;
            if (Math.abs(ballSpeedX) < maxSpeed) {
                ballSpeedX *= 1.05;
            }
        }
        
        if (ballX >= canvas.width - 30 && ballY >= cpuY && ballY <= cpuY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            // Increase speed slightly but cap at maximum
            const maxSpeed = 12;
            if (Math.abs(ballSpeedX) < maxSpeed) {
                ballSpeedX *= 1.05;
            }
        }
        
        // Scoring
        if (ballX < 0) {
            cpuScore++;
            document.getElementById('pong-cpu-score').textContent = cpuScore;
            resetBall();
        }
        
        if (ballX > canvas.width) {
            playerScore++;
            document.getElementById('pong-player-score').textContent = playerScore;
            resetBall();
        }
        
        // CPU AI
        const cpuCenter = cpuY + paddleHeight / 2;
        if (cpuCenter < ballY - 35) {
            cpuY += 4;
        } else if (cpuCenter > ballY + 35) {
            cpuY -= 4;
        }
        
        // Keep CPU paddle in bounds
        cpuY = Math.max(0, Math.min(canvas.height - paddleHeight, cpuY));
        
        draw();
    }
    
    function resetBall() {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        ballSpeedY = (Math.random() - 0.5) * 6;
    }
    
    function handleKeyPress(e) {
        if (e.key === 'w' || e.key === 'W') {
            playerY = Math.max(0, playerY - 20);
        } else if (e.key === 's' || e.key === 'S') {
            playerY = Math.min(canvas.height - paddleHeight, playerY + 20);
        }
    }
    
    function handleMouseMove(e) {
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        playerY = Math.max(0, Math.min(canvas.height - paddleHeight, mouseY - paddleHeight / 2));
    }
    
    document.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('mousemove', handleMouseMove);
    
    gameLoop = setInterval(update, 1000 / 60);
    
    pongGame = {
        stop: () => {
            clearInterval(gameLoop);
            document.removeEventListener('keydown', handleKeyPress);
            canvas.removeEventListener('mousemove', handleMouseMove);
        }
    };
    
    document.getElementById('pong-restart').onclick = initPongGame;
}

// Add event listener for secret game button
document.getElementById('secret-game-btn').addEventListener('click', () => {
    document.querySelectorAll('.game-container').forEach(container => container.style.display = 'none');
    document.getElementById('secret-game').style.display = 'block';
    initPongGame();
});

// ============================================
// SMOOTH SCROLLING & ACTIVE LINK HIGHLIGHTING
// ============================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-menu a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all project cards, skill categories, and stat cards
document.querySelectorAll('.project-card, .skill-category, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s, transform 0.5s';
    observer.observe(el);
});

// ============================================
// ADDITIONAL EASTER EGG: TYPING "SECRET" IN CONSOLE
// ============================================
window.revealSecret = function() {
    console.log('%c🎊 SECRET REVEALED!', 'font-size: 30px; color: #ec4899; font-weight: bold;');
    console.log('%c📝 Here are all the hidden features:', 'font-size: 16px; color: #8b5cf6;');
    console.log('%c1. Click my name 5 times to see a click counter', 'font-size: 14px; color: #10b981;');
    console.log('%c2. Click my name 15 times to unlock a secret game', 'font-size: 14px; color: #10b981;');
    console.log('%c3. Use the Konami Code for Matrix rain effect', 'font-size: 14px; color: #10b981;');
    console.log('%c4. Check the console for hidden messages', 'font-size: 14px; color: #10b981;');
    console.log('%cType revealSecret() in the console to see this message again!', 'font-size: 12px; color: #6366f1; font-style: italic;');
};

console.log('%c💡 Pro tip: Type revealSecret() in the console for a list of hidden features!', 'font-size: 12px; color: #fbbf24;');
