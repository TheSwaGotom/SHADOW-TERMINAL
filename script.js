/* 
 * ShadowChatRoom // Brain-AI Core v4.1
 * Neural link logic for handling real-time AI messages and user interaction.
 */

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
    "Encryption protocol Alpha-9 initiated."
];

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
    // If no real API key, use fallback streams
    if (CONFIG.HF_API_KEY === "YOUR_HUGGING_FACE_API_KEY") {
        return BACKUP_STREAMS[Math.floor(Math.random() * BACKUP_STREAMS.length)];
    }

    try {
        const payload = isUserResponse
            ? `<s>[INST] You are a hacker AI. A user said: "${prompt}". Reply in 1 short sentence mixed with Bangla and English. [/INST]`
            : `<s>[INST] Send a mysterious hacker system log or cool cryptic thought. Short, max 15 words. Mix Bangla and English. [/INST]`;

        const response = await fetch(`https://api-inference.huggingface.co/models/${CONFIG.MODEL}`, {
            headers: { Authorization: `Bearer ${CONFIG.HF_API_KEY}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ inputs: payload, parameters: { max_new_tokens: 30, temperature: 0.95 } })
        });

        const result = await response.json();
        let text = result[0].generated_text;
        // Simple extraction
        if (text.includes('[/INST]')) {
            text = text.split('[/INST]')[1].trim();
        }
        return text;
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
    setTimeout(() => {
        postMessage({ name: "SYSTEM", color: "#666" }, ">> INITIALIZING NEURAL_LINK...");
        setTimeout(() => {
            postMessage({ name: "SYSTEM", color: "#00ff41" }, ">> CONNECTION_STABLE. NODE_09 ONLINE.");
            aiPulse();
        }, 1200);
    }, 500);
});
