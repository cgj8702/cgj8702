/* script.js */

// ==========================================
// 1. Particle System (Falling Sakura Petals)
// ==========================================
class SakuraParticle {
    constructor(canvas, initiallyDistributed = false) {
        this.canvas = canvas;
        this.reset();
        if (initiallyDistributed) {
            this.y = Math.random() * canvas.height; // Distribute initially across the viewport
        }
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -20; // Standard reset is just above the screen
        this.size = Math.random() * 12 + 8; // Size of petal
        this.speedY = Math.random() * 1.8 + 1.8; // Energetic, lively downward speed
        this.speedX = Math.random() * 1.5 - 0.5; // Drift
        this.angle = Math.random() * 360;
        this.spin = Math.random() * 2 - 1; // Rotation speed
        this.opacity = Math.random() * 0.4 + 0.3; // Serene transparency
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX + Math.sin(this.y / 30) * 0.5; // Natural swaying
        this.angle += this.spin;

        // Reset if it goes off bottom or sides
        if (this.y > this.canvas.height + 20 || this.x < -20 || this.x > this.canvas.width + 20) {
            this.reset();
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.beginPath();

        const s = this.size;

        // 1. Start at the pointed stem/base at the bottom
        ctx.moveTo(0, s * 0.96);

        // 2. Curve up the right side to the right lobe's peak
        ctx.bezierCurveTo(s * 0.66, s * 0.36, s * 0.73, -s * 0.24, s * 0.29, -s * 0.52);

        // 3. Curve down into the top-middle cleft/notch
        ctx.bezierCurveTo(s * 0.12, -s * 0.73, s * 0.04, -s * 0.62, 0, -s * 0.47);

        // 4. Curve back up to the left lobe's peak
        ctx.bezierCurveTo(-s * 0.04, -s * 0.62, -s * 0.12, -s * 0.73, -s * 0.29, -s * 0.52);

        // 5. Curve down the left side back to the pointed base
        ctx.bezierCurveTo(-s * 0.73, -s * 0.24, -s * 0.66, s * 0.36, 0, s * 0.96);

        ctx.fillStyle = `rgba(249, 192, 211, ${this.opacity})`; // Soft Rose Hue
        ctx.fill();
        ctx.restore();
    }
}

function initSakuraParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'sakura-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const maxParticles = 35; // Balances visual aesthetic and processing performance

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 1. Read persistent choice from localStorage
    const savedState = localStorage.getItem('isPetalsEnabled');
    let isPetalsEnabled = savedState === 'true'; // Defaults to false if null or 'false'
    let animationId = null;

    // 2. Initialize particles
    // If enabled on load, distribute them across the screen. Otherwise, prepare them off-screen.
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new SakuraParticle(canvas, isPetalsEnabled));
    }

    // 3. Animation loop
    function animate() {
        // Stop the loop if it has been disabled
        if (!isPetalsEnabled) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });

        // Request the next frame only if still enabled
        animationId = requestAnimationFrame(animate);
    }

    // 4. Toggle button setup
    const toggleBtn = document.getElementById('toggle-petals-btn');
    const toggleText = document.getElementById('petals-text');

    if (toggleBtn && toggleText) {
        // Apply the correct text and start the animation if it was left ON [1]
        if (isPetalsEnabled) {
            toggleText.textContent = "Turn Petals Off";
            animate(); 
        } else {
            toggleText.textContent = "Turn Petals On";
        }

        toggleBtn.addEventListener('click', () => {
            isPetalsEnabled = !isPetalsEnabled;
            localStorage.setItem('isPetalsEnabled', isPetalsEnabled); // Persist state across pages

            if (isPetalsEnabled) {
                toggleText.textContent = "Turn Petals Off";
                
                // Stagger all particles at different heights above the screen 
                // so they trickle down naturally instead of dropping in a clump
                particles.forEach(p => {
                    p.reset();
                    p.y = -Math.random() * 300 - 20; 
                });

                animate(); // Kickstart the animation loop
            } else {
                toggleText.textContent = "Turn Petals On";
                
                // Stop the animation and immediately clear any frozen petals off the screen
                cancelAnimationFrame(animationId);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });
    }
}

// ==========================================
// 2. Waitlist Submission Logic
// ==========================================
function setupWaitlists() {
    const forms = document.querySelectorAll('.waitlist-form');
    forms.forEach((form) => {
        const input = form.querySelector('input');
        const container = form.querySelector('.sakura-glass');
        const button = form.querySelector('button');
        const parentContainer = form.parentElement;

        // Outer input shell outline focus mapping
        if (input && container) {
            input.addEventListener('focus', () => container.classList.add('waitlist-focused'));
            input.addEventListener('blur', () => container.classList.remove('waitlist-focused'));
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!input.value) return;

            // Loading state
            button.disabled = true;
            button.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
        </svg>
      `;

            // Simulation of API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Transition to success state
            form.classList.add('opacity-0');
            
            await new Promise(resolve => setTimeout(resolve, 300));
            form.style.display = 'none';

            const successDiv = document.createElement('div');
            successDiv.className = 'text-center font-bold text-lg text-primary flex items-center gap-2 justify-center transition-all duration-500 transform scale-95 opacity-0';
            successDiv.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>A petal has fallen. You're on the list.</span>
          `;
            parentContainer.appendChild(successDiv);
            
            // Trigger animation frame
            requestAnimationFrame(() => {
                successDiv.classList.remove('scale-95', 'opacity-0');
                successDiv.classList.add('scale-100', 'opacity-100');
            });
        });
    });
}

// ==========================================
// 3. Interactive Mock Chat Logic
// ==========================================
function setupInteractiveChat() {
    const chatInput = document.getElementById('chat-input');
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatForm || !chatInput || !chatMessages) return;

    const responses = [
        "Thank you for sharing that with me. It is completely okay to feel that way.",
        "Breathe with me for a moment. Inhale softly... and let it drift away.",
        "Your feelings are valid. Let's take today step by step, like falling blossoms.",
        "I'm right here with you. What can I do to make this moment a little softer?",
        "Every petal details its own path. You are doing much better than you realize."
    ];

    function addMessage(text, isUser = false) {
        const bubbleWrapper = document.createElement('div');
        bubbleWrapper.className = `flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3 w-full opacity-0 translate-y-3 transition-all duration-300`;

        const bubbleHtml = isUser
            ? `
        <div class="bubble-user py-3 px-5 shadow-sm font-sans max-w-[75%]">
          ${text}
        </div>
      `
            : `
        <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary flex-shrink-0 shadow-sm mt-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path>
          </svg>
        </div>
        <div class="bubble-momo py-3 px-5 shadow-sm font-sans max-w-[75%]">
          ${text}
        </div>
      `;

        bubbleWrapper.innerHTML = bubbleHtml;
        chatMessages.appendChild(bubbleWrapper);

        // Dynamic scroll locking
        requestAnimationFrame(() => {
            bubbleWrapper.classList.remove('opacity-0', 'translate-y-3');
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
    }

    function addTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'typing-indicator';
        indicator.className = 'flex justify-start items-center gap-3 w-full transition-all duration-200';
        indicator.innerHTML = `
      <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary flex-shrink-0 shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path>
        </svg>
      </div>
      <div class="bubble-momo opacity-80 py-3 px-5 shadow-sm rounded-[16px] flex items-center gap-1">
        <span class="w-1.5 h-1.5 bg-textColor/60 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
        <span class="w-1.5 h-1.5 bg-textColor/60 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
        <span class="w-1.5 h-1.5 bg-textColor/60 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
      </div>
    `;
        chatMessages.appendChild(indicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return indicator;
    }

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        chatInput.value = '';

        const typing = addTypingIndicator();

        // Natural processing pause
        await new Promise(resolve => setTimeout(resolve, 1500));
        typing.remove();
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, false);
    });
}

// ==========================================
// 4. Global Initialization
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initSakuraParticles();
    setupWaitlists();
    setupInteractiveChat();
});
