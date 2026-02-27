// =========================
// ELEMENTOS
// =========================
const ghost = document.getElementById("ghost");
const intro = document.querySelector(".intro-text");
const middle = document.querySelector(".middle");
const cta = document.querySelector(".cta");
const ambient = document.getElementById("ambientSound");
const ctaVideo = document.getElementById("ctaVideo");

// =========================
// VARIABLES SCROLL & SONIDO
// =========================
let targetScroll = 0;
let currentScroll = 0;
let soundStarted = false;

// =========================
// FADE-IN TEXTO INICIAL
// =========================
window.addEventListener("load", () => {
  setTimeout(() => {
    intro.style.opacity = 1;
  }, 300);
});

// =========================
// SCROLL CON INERCIA
// =========================
window.addEventListener("scroll", () => {
  targetScroll = window.scrollY;

  // Quitar animación idle del fantasma al hacer scroll
  if (window.scrollY > 5) {
    ghost.classList.remove("idle");
    document.body.style.animation = "none";
  }

  // Activar sonido al interactuar
  if (!soundStarted && window.scrollY > 10) {
    startAmbientSound();
  }
});

function smoothScroll() {
  currentScroll += (targetScroll - currentScroll) * 0.08;
  updateAnimation(currentScroll);
  requestAnimationFrame(smoothScroll);
}

smoothScroll();

// =========================
// ANIMACIÓN PRINCIPAL
// =========================
function updateAnimation(scrollY) {
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = scrollY / maxScroll;

  const moveDistance = window.innerHeight * 1.8;
  const translateY = scrollPercent * moveDistance;
  const rotate = scrollPercent * 15;

  const floatAmplitude = 5; // px
  const rotateAmplitude = 2; // grados

  const floatOffsetX = Math.sin(scrollPercent * Math.PI * 4) * floatAmplitude;
  const rotateOffset = Math.sin(scrollPercent * Math.PI * 3) * rotateAmplitude;

  const glowIntensity = 0.4 + scrollPercent * 0.8;
  const glowValue = `
  0 0 ${5 + scrollPercent * 10}px rgba(244,199,15,${glowIntensity}),
  0 0 ${15 + scrollPercent * 20}px rgba(244,199,15,${glowIntensity * 0.6}),
  0 0 ${30 + scrollPercent * 30}px rgba(244,199,15,${glowIntensity * 0.3})
`;

document.querySelectorAll(".yellow-glow").forEach(el=>{
  el.style.textShadow = glowValue;
});

  let blur;

  // =====================
  // Z-INDEX DINÁMICO DEL FANTASMA
  // =====================
  if (scrollPercent < 0.05) {
    // Fantasma detrás del texto inicial
    ghost.style.zIndex = 0;
  } else if (scrollPercent < 0.85) {
    // Fantasma sobre la sección del medio
    ghost.style.zIndex = 2;
  } else {
    // Fantasma detrás del CTA final
    ghost.style.zIndex = 0;
  }

  // =====================
  // MOVIMIENTO + ROTACIÓN + BLUR
  // =====================
  if (scrollPercent < 0.05) {
    // Inicio: desenfoque fuerte
    blur = 20 - scrollPercent * 400;
  } else {
    // Blur progresivo normal
    blur = scrollPercent * 4;
  }

  

  ghost.style.transform = `
  translateY(${translateY}px)
  translateX(${floatOffsetX}px)
  rotate(${rotate + rotateOffset}deg)
`;
  ghost.style.filter = `blur(${Math.max(blur, 0)}px)`;

  // =====================
  // OPACIDAD TEXTOS
  // =====================
  intro.style.opacity = 1 - scrollPercent * 2;
  middle.style.opacity = scrollPercent * 2;

  // =====================
  // FONDO DINÁMICO
  // =====================
  const darkness = scrollPercent * 80;
  document.body.style.background = `
    radial-gradient(circle at 50% ${50 + scrollPercent * 20}%,
    rgba(${darkness}, 0, ${darkness / 1.5}, 1),
    black 70%)
  `;

  // =====================
  // CTA FINAL + VIDEO
  // =====================
  if (scrollPercent > 0.85) {
    cta.classList.add("active");
    document.body.style.filter = "contrast(1.05) saturate(1.05)";
    if (ctaVideo) ctaVideo.style.display = "block"; // activar video final
  } else {
    cta.classList.remove("active");
    document.body.style.filter = "none";
    if (ctaVideo) ctaVideo.style.display = "none"; // ocultar video
  }
}

// =========================
// SONIDO AMBIENTE
// =========================
function startAmbientSound() {
  ambient.volume = 0;
  ambient.play().then(() => {
    let fadeAudio = setInterval(() => {
      if (ambient.volume < 0.25) {
        ambient.volume += 0.01;
      } else {
        clearInterval(fadeAudio);
      }
    }, 100);
    soundStarted = true;
  }).catch((err) => {
    console.log("Audio bloqueado hasta interacción real:", err);
  });
}

// Partículas flotando sutilmente
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

const particlesCount = 60;
const particlesArr = [];

class Particle {
  constructor(){
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.2; // muy lento
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.alpha = Math.random() * 0.2 + 0.05;
  }
  update(){
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0) this.x = w;
    if(this.x > w) this.x = 0;
    if(this.y < 0) this.y = h;
    if(this.y > h) this.y = 0;
  }
  draw(){
    ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
    ctx.fill();
  }
}

for(let i=0;i<particlesCount;i++){
  particlesArr.push(new Particle());
}

function animateParticles(){
  ctx.clearRect(0,0,w,h);
  particlesArr.forEach(p=>{
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

animateParticles();

window.addEventListener("resize", ()=>{
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

function subtlePulse() {
  const elements = document.querySelectorAll(".yellow-glow");
  
  elements.forEach(el=>{
    el.style.transition = "text-shadow 0.2s ease";
    el.style.textShadow += `, 0 0 60px rgba(244,199,15,0.9)`;
  });

  setTimeout(()=>{
    elements.forEach(el=>{
      el.style.transition = "text-shadow 1.5s ease";
    });
  },200);
}

function randomPulse(){
  const randomTime = 25000 + Math.random()*20000;
  setTimeout(()=>{
    subtlePulse();
    randomPulse();
  }, randomTime);
}

randomPulse();