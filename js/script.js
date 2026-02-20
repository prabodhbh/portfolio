const canvas = document.getElementById('chromatic-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');

    const config = {
        trailLength: 35,
        width: 10,
        vibration: 2.5,
        speed: 0.15,
    };

    let points = [];
    let mouse = { x: 0, y: 0 };
    let timer = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    mouse.x = window.innerWidth / 2;
    mouse.y = window.innerHeight / 2;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        points.unshift({ x: mouse.x, y: mouse.y });
        if (points.length > config.trailLength) points.pop();
        timer += config.speed;

        ctx.strokeStyle = "rgba(255, 30, 100, 0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(255, 0, 0, 0.5)";
        drawWavePath(0);

        ctx.strokeStyle = "rgba(0, 200, 255, 0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(0, 255, 255, 0.5)";
        drawWavePath(1.5);

        ctx.strokeStyle = "rgba(180, 50, 255, 0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(150, 0, 255, 0.5)";
        drawWavePath(3.0);

        requestAnimationFrame(animate);
    }

    function drawWavePath(phaseOffset) {
        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = config.width;
        for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i];
            const waveAmt = Math.sin((i * 0.4) + timer + phaseOffset) * (i * config.vibration * 0.1);
            ctx.lineTo(p1.x + waveAmt, p1.y + waveAmt);
        }
        ctx.stroke();
    }

    animate();
}

// --- 3D TILT EFFECT ---
document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xRotation = -((y - rect.height / 2) / rect.height * 5);
        const yRotation = ((x - rect.width / 2) / rect.width * 5);
        card.style.transform = `perspective(1000px) scale(1.02) rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) scale(1) rotateX(0) rotateY(0)';
    });
});

// --- HERO PHOTO REVEAL (Change on mouseenter AND mouseleave) ---
const photoBox = document.getElementById('magic-photo-box');
if (photoBox) {
    const slides = Array.from(photoBox.querySelectorAll('.photo-slide'));
    let currentSlide = 0;

    // Hide all slides initially
    slides.forEach(slide => { slide.style.opacity = '0'; });

    photoBox.addEventListener('mouseenter', () => {
        // Show current slide
        slides[currentSlide].style.opacity = '1';
    });

    photoBox.addEventListener('mouseleave', () => {
        // Hide current slide
        slides[currentSlide].style.opacity = '0';

        // Advance to next slide for NEXT hover
        currentSlide = (currentSlide + 1) % slides.length;
    });
}
