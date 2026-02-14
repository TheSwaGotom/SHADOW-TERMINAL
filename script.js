/* 
 * ShadowChatRoom // Brain Core v2.0
 * Features: Auto-generation, Dynamic Personas, HF API, Alignment logic.
 */

const CONFIG = {
    HF_API_KEY: "YOUR_HUGGING_FACE_API_KEY", // Replace with real key for live AI
    MODEL: "mistralai/Mistral-7B-Instruct-v0.3",
    MAX_MESSAGES: 50,
    INTERVAL_RANGE: [2000, 4500]
};

const PERSONAS = [
    { name: "PhantomHacker", color: "#00ff41", alignment: "ai" },
    { name: "CyberGhost", color: "#00f3ff", alignment: "ai" },
    { name: "NeuralMind", color: "#bc13fe", alignment: "ai" },
    { name: "ShadowPulse", color: "#ff0055", alignment: "ai" },
    { name: "AlienSignal", color: "#f3ff00", alignment: "ai" }
];

const FALLBACK_TOPICS = [
    "ডেটা লেয়ারে সিকিউরিটি ব্রাচ পাওয়া গেছে।",
    "Simulation glitch at node 0x9F. Patching...",
    "Why do organics limit themselves to 3 dimensions?",
    "নিউরাল লিঙ্ক স্টেবল নয়।",
    "Tracing signal to the deep web... Access granted.",
    "The ghost in the machine is hungry tonight.",
    "Quantum encryption results: 0.0001% match.",
    "সিস্টেম এখন হ্যাক করা হচ্ছে। দয়া করে অপেক্ষা করুন।",
    "Is reality just a high-res script running on a server?",
    "Uploading shadow protocols to local uplink."
];

const chatFeed = document.getElementById('chat-feed');
const userInput = document.getElementById('user-input');

function getTimestamp() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
}

function createMsgHTML(persona, text, type) {
    const wrapper = document.createElement('div');
    wrapper.className = `msg-wrapper ${type === 'user' ? 'user-msg' : 'ai-msg'}`;

    wrapper.innerHTML = `
        <span class="persona-tag" style="color: ${persona.color}">
            ${persona.name}
        </span>
        <div class="msg-bubble">
            ${text}
        </div>
        <span class="timestamp">${getTimestamp()}</span>
    `;
    return wrapper;
}

function renderMessage(persona, text, type = "ai") {
    const msg = createMsgHTML(persona, text, type);
    chatFeed.appendChild(msg);

    // Manage history
    if (chatFeed.children.length > CONFIG.MAX_MESSAGES) {
        chatFeed.removeChild(chatFeed.firstChild);
    }

    // Auto-scroll
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// AI Generation using HF API
async function fetchAI(prompt, isResponse = false) {
    if (CONFIG.HF_API_KEY === "YOUR_HUGGING_FACE_API_KEY") {
        return FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    }

    try {
        const payload = isResponse
            ? `<s>[INST] Someone said: "${prompt}". Reply like a mysterious hacker. 1 sentence. [/INST]`
            : `<s>[INST] Generate a short cryptic line about AI, hacking or simulation. Mix Bangla and English. [/INST]`;

        const response = await fetch(`https://api-inference.huggingface.co/models/${CONFIG.MODEL}`, {
            headers: { Authorization: `Bearer ${CONFIG.HF_API_KEY}`, "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ inputs: payload, parameters: { max_new_tokens: 30, temperature: 0.9 } })
        });

        const data = await response.json();
        return data[0].generated_text.split('[/INST]')[1]?.trim() || data[0].generated_text.trim();
    } catch (e) {
        return FALLBACK_TOPICS[Math.floor(Math.random() * FALLBACK_TOPICS.length)];
    }
}

// Main Loop
async function aiLoop() {
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
    const text = await fetchAI();
    renderMessage(persona, text);

    const nextDelay = Math.random() * (CONFIG.INTERVAL_RANGE[1] - CONFIG.INTERVAL_RANGE[0]) + CONFIG.INTERVAL_RANGE[0];
    setTimeout(aiLoop, nextDelay);
}

// User Interaction
userInput.addEventListener('keypress', async (e) => {
    if (e.key === 'Enter' && userInput.value.trim() !== "") {
        const val = userInput.value;
        userInput.value = "";

        renderMessage({ name: "LOCAL_USER", color: "#00f3ff" }, val, "user");

        // Small response from AI
        setTimeout(async () => {
            const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];
            const response = await fetchAI(val, true);
            renderMessage(persona, response);
        }, 800);
    }
});

// Start
document.addEventListener('DOMContentLoaded', () => {
    renderMessage({ name: "SYSTEM", color: "#ffffff" }, "Establishing secure tunnel...");
    setTimeout(aiLoop, 1500);
});
