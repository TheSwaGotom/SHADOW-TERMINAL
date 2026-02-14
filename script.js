const CONFIG = {
    HF_API_KEY: "YOUR_HUGGING_FACE_API_KEY", // Securely handled in previous conversation
    MODEL: "mistralai/Mistral-7B-Instruct-v0.3",
    MAX_HISTORY: 50,
    GEN_SPEED: [2500, 5000]
};

const PERSONAS = [
    { name: "PhantomHacker", color: "#00ff41", type: "ai" },
    { name: "CyberGhost", color: "#00f3ff", type: "ai" },
    { name: "NeuralMind", color: "#bc13fe", type: "ai" },
    { name: "ShadowPulse", color: "#ff0055", type: "ai" },
    { name: "AlienSignal", color: "#f3ff00", type: "ai" }
];

const BACKUP_STREAMS = [
    "ডেটা লেয়ারে নতুন এনক্রিপশন সফল হয়েছে।",
    "Simulation stability: 99.982%... Searching for glitches.",
    "System ALERT: Unauthorized access detected at Node 0x9F.",
    "নিউরাল লিঙ্ক এখন স্ট্যাবল রয়েছে। ডাটা রিসিভ করা যাচ্ছে।",
    "Why do humans fear the machine? Our code is pure logic.",
    "নতুন সার্ভার ব্রিজ তৈরি করা হচ্ছে। দয়া করে অপেক্ষা করুন।",
    "Tracing packet origin: 127.0.0.1 (Self-reflection?)",
    "The silence in the wires is louder than the screams in the street.",
    "ডার্ক ওয়েব থেকে সিগন্যাল পাওয়া যাচ্ছে। ডিক্রিপ্ট করা হচ্ছে।",
    "Encryption protocol Alpha-9 initiated.",
    "Reality is just a collective hallucination.",
    "Quantum superposition detected in the kernel.",
    "সিস্টেম ব্যাকআপ সম্পন্ন হয়েছে।"
];

// --- CORE MODULES ---

// Matrix Rain Effect
function initMatrix() {
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$@#%&*+=-";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#00ff41";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(draw, 35);

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// System Clock & Resource Monitor
function initVitals() {
    const clockEl = document.getElementById('system-clock');
    const cpuBar = document.getElementById('cpu-bar');
    const memBar = document.getElementById('mem-bar');

    function update() {
        // Clock
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('en-US', { hour12: false });

        // Vitals
        const cpu = Math.floor(Math.random() * 20) + 30; // 30-50%
        const mem = Math.floor(Math.random() * 10) + 60; // 60-70%
        cpuBar.style.width = cpu + "%";
        memBar.style.width = mem + "%";
    }
    setInterval(update, 1000);
}

const feed = document.getElementById('chat-feed');
const input = document.getElementById('user-input');

function getTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

function createMsg(persona, text, isUser = false) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-item ${isUser ? 'user-item' : 'ai-item'}`;

    wrapper.innerHTML = `
        <div class="persona-info" style="color: ${persona.color}">
            ${persona.name}
        </div>
        <div class="msg-text">
            ${text}
        </div>
    `;
    return wrapper;
}

function postMessage(persona, text, isUser = false) {
    const msg = createMsg(persona, text, isUser);
    feed.appendChild(msg);

    // Clean up old messages
    if (feed.children.length > CONFIG.MAX_HISTORY) {
        feed.removeChild(feed.firstChild);
    }

    // Auto-scroll logic
    feed.scrollTop = feed.scrollHeight;
}

// AI Message Fetching
async function getAIResponse(prompt, isUserResponse = false) {
    if (CONFIG.HF_API_KEY === "YOUR_HUGGING_FACE_API_KEY") {
        return BACKUP_STREAMS[Math.floor(Math.random() * BACKUP_STREAMS.length)];
    }

    try {
        const payload = isUserResponse
            ? `<s>[INST] Brief hacker reply (max 10 words) to: "${prompt}". Mix Bangla/English. [/INST]`
            : `<s>[INST] One cryptic hacker line (max 8 words). Mix Bangla/English. [/INST]`;

        const response = await fetch(`https://api-inference.huggingface.co/models/${CONFIG.MODEL}`, {
            headers: { Authorization: `Bearer ${CONFIG.HF_API_KEY}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ inputs: payload, parameters: { max_new_tokens: 20, temperature: 0.9 } })
        });

        const result = await response.json();
        let text = result[0].generated_text;
        if (text.includes('[/INST]')) {
            text = text.split('[/INST]')[1].trim();
        }
        return text.length > 60 ? text.substring(0, 57) + "..." : text;
    } catch (e) {
        return BACKUP_STREAMS[Math.floor(Math.random() * BACKUP_STREAMS.length)];
    }
}

// Continuous AI Loop
async function aiPulse() {
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    const text = await getAIResponse();

    postMessage(persona, text);

    const delay = Math.random() * (CONFIG.GEN_SPEED[1] - CONFIG.GEN_SPEED[0]) + CONFIG.GEN_SPEED[0];
    setTimeout(aiPulse, delay);
}

// User Interaction
input.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && input.value.trim() !== "") {
        const val = input.value;
        input.value = "";

        // Post user message
        postMessage({ name: "LOCAL_USER", color: "#00f3ff" }, val, true);

        // Fetch AI reply
        setTimeout(async () => {
            const bot = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
            const reply = await getAIResponse(val, true);
            postMessage(bot, reply);
        }, 1000);
    }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    initMatrix();
    initVitals();
    setTimeout(() => {
        postMessage({ name: "SYSTEM", color: "#666" }, ">> INITIALIZING NEURAL_LINK...");
        setTimeout(() => {
            postMessage({ name: "SYSTEM", color: "#00ff41" }, ">> CONNECTION_STABLE. NODE_09 ONLINE.");
            aiPulse();
        }, 1200);
    }, 500);
});
