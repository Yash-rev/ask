const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");
const noBtn = document.querySelector(".no-btn");
const yesBtn = document.querySelector(".btn[alt='Yes']");
const music = document.getElementById("bg-music");
const yayySound = document.getElementById("yay");
const warningText = document.getElementById("warning-text");
const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const canvas = document.getElementById("effect-canvas");
const ctx = canvas.getContext("2d");
let particles = [];
let hearts = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Enhanced Chaos: Hearts & Flowers
function createHeart() {
    const symbols = ["❤", "🌸", "🌹", "🌷", "💖"];
    return {
        x: Math.random() * canvas.width,
        y: canvas.height + 50,
        size: Math.random() * 20 + 20,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
    };
}

function drawEffects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    hearts.forEach((h, i) => {
        h.y -= h.speed;
        h.rotation += h.rotationSpeed;
        ctx.save();
        ctx.translate(h.x, h.y);
        ctx.rotate(h.rotation);
        ctx.globalAlpha = h.opacity;
        ctx.fillStyle = "#ff4d6d"; 
        ctx.font = `${h.size}px serif`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#ff4d6d";
        ctx.fillText(h.symbol, -h.size/2, h.size/2);
        ctx.restore();
        if (h.y < -50) hearts[i] = createHeart();
    });

    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; 
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size); 
        if (p.y > canvas.height || p.x < 0 || p.x > canvas.width) particles.splice(i, 1);
    });

    requestAnimationFrame(drawEffects);
}

// Start with high heart density
for(let i=0; i<60; i++) {
    hearts.push(createHeart());
    hearts[i].y = Math.random() * canvas.height;
}
drawEffects();

envelope.addEventListener("click", () => {
    music.play().catch(() => {});
    envelope.style.display = "none";
    letter.style.display = "flex";
    setTimeout(() => { document.querySelector(".letter-window").classList.add("open"); }, 50);
});

noBtn.addEventListener("mouseover", () => {
    warningText.style.setProperty("display", "block", "important");
    setTimeout(() => { warningText.style.setProperty("display", "none", "important"); }, 800);
    const distance = 250;
    const angle = Math.random() * Math.PI * 2;
    noBtn.style.transform = `translate(${Math.cos(angle)*distance}px, ${Math.sin(angle)*distance}px)`;
});

yesBtn.addEventListener("click", () => {
    yayySound.volume = 0.4;
    yayySound.play().catch(() => {});
    title.textContent = "Yippeeee!";
    catImg.src = "cat_dance.gif";
    
    const colors = ["#ff4d6d", "#ffffff", "#ffb3c1", "#ff758f"];
    for (let i = 0; i < 100; i++) { // Slightly reduced from 500 for performance
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20,
            size: Math.random() * 4 + 2, // Smaller particles draw faster
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1.0 // Add a life property
        });
    }
    document.querySelector(".letter-window").classList.add("final");
    buttons.style.display = "none";
    finalText.style.display = "block";
})