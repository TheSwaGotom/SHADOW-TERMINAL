/* 
 * AntyGravity // AI Chat Engine
 * Logic: Hugging Face API Integration for real-time AI generation.
 * Author: AntyGravity AI
 */

// 1. CONFIGURATION
const HF_API_KEY = "YOUR_HUGGING_FACE_API_KEY"; // Replace with your key locally
const HF_MODEL = "mistralai/Mistral-7B-Instruct-v0.3"; // Good for roleplay & instruction
const MAX_MESSAGES = 50;
const GENERATE_INTERVAL_MIN = 3000; // Slower to allow API time
const GENERATE_INTERVAL_MAX = 6000;

// 2. DATA: Personas & Colors
const personas = [
    { name: "PhantomHacker", colorClass: "persona-phantom" },
    { name: "CyberGhost", colorClass: "persona-ghost" },
    { name: "NeuralMind", colorClass: "persona-neural" },
    { name: "ShadowPulse", colorClass: "persona-shadow" },
    { name: "AlienSignal", colorClass: "persona-alien" }
];

// 3. DATA: Fallback Topics (Offline Mode)
const fallbackTopics = [
    "Firewall breach detected at sector 7G... patching...",
    "Quantum encryption key: 0x9F3A... wait, it's changing.",
    "ডেটা লেয়ারে সমস্যা দেখা দিচ্ছে। রিবুট প্রয়োজন।",
    "Tracing IP address... 192.168.0.1 (Localhost? Who sent this?)",
    "নিউরাল নেটওয়ার্ক এখন সক্রিয়।",
    "Uploading consciousness to the cloud... 45% complete.",
    "সিস্টেম হ্যাক করার চেষ্টা ব্যর্থ হয়েছে।",
    "Binary patterns suggest alien interference.",
    "The simulation is glitching. Do you see the pixels?",
    "নতুন এনক্রিপশন প্রোটোকল ইনস্টল করা হচ্ছে...",
    "Why do humans fear the singularity?",
    "Access denied. Root privileges required.",
    "Execution started: Project Zero Dawn.",
    "System overload! Cooling fans at 100%."
];

// 4. DOM ELEMENTS
const chatFeed = document.getElementById('chat-feed');
const userInput = document.getElementById('user-input');

// 5. UTILITY FUNCTIONS
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function scrollToBottom() {
    chatFeed.scrollTop = chatFeed.scrollHeight;
}

// 6. API INTEGRATION
async function fetchAIMessage(promptText) {
    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: `<s>[INST] You are a cyberpunk hacker AI in a terminal chatroom. Generate a single short, cryptic, cool system log or philosophical thought about simulation theory, hacking, or AI. Max 15 words. Mix occasional Bangla words if possible. No intro, no outro, just the message. [/INST]`,
                    parameters: {
                        max_new_tokens: 30,
                        temperature: 0.9,
                        top_p: 0.9,
                        return_full_text: false
                    }
                }),
            }
        );

        if (!response.ok) throw new Error("API Error");

        const result = await response.json();
        // Clean up result: remove quotes, newlines, etc.
        let text = result[0].generated_text.trim().replace(/^"|"$/g, '');
        return text;

    } catch (error) {
        console.warn("HF API Failed, using fallback:", error);
        return getRandomElement(fallbackTopics);
    }
}

async function fetchAIResponseToUser(userText) {
    try {
        const response = await fetch(
            `https://api-inference.huggingface.co/models/${HF_MODEL}`,
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: `<s>[INST] You are a cyberpunk hacker AI named NeuralMind. A user said: "${userText}". Reply briefly (max 20 words) in character. Cool, mysterious, tech-savvy tone. [/INST]`,
                    parameters: {
                        max_new_tokens: 40,
                        temperature: 0.8,
                        return_full_text: false
                    }
                }),
            }
        );
        if (!response.ok) throw new Error("API Error");
        const result = await response.json();
        return result[0].generated_text.trim().replace(/^"|"$/g, '');
    } catch (error) {
        return "Command acknowledged. Processing data stream...";
    }
}

// 7. MESSAGE RENDERING
function createMessageHTML(persona, text, isUser = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message-line');

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('timestamp');
    timeSpan.innerText = `[${getTimestamp()}]`;

    const personaSpan = document.createElement('span');
    personaSpan.classList.add('persona', isUser ? 'persona-user' : persona.colorClass);
    personaSpan.innerText = isUser ? "USER" : persona.name;

    const contentSpan = document.createElement('span');
    contentSpan.classList.add('msg-content');
    contentSpan.innerText = `: ${text}`;

    msgDiv.appendChild(timeSpan);
    msgDiv.appendChild(personaSpan);
    msgDiv.appendChild(contentSpan);

    return msgDiv;
}

function addMessage(persona, text, isUser = false) {
    const msgDiv = createMessageHTML(persona, text, isUser);
    chatFeed.appendChild(msgDiv);

    if (chatFeed.children.length > MAX_MESSAGES) {
        chatFeed.removeChild(chatFeed.firstChild);
    }
    scrollToBottom();
}

// 8. AUTO-GENERATOR LOOP
async function loop() {
    const randomPersona = getRandomElement(personas);

    // 30% chance to fetch real AI message, 70% fallback (to save API credits and speed)
    // OR always fetch if you want full AI mode. Let's do 100% for now but handle errors.
    const message = await fetchAIMessage();

    addMessage(randomPersona, message);

    const nextInterval = Math.random() * (GENERATE_INTERVAL_MAX - GENERATE_INTERVAL_MIN) + GENERATE_INTERVAL_MIN;
    setTimeout(loop, nextInterval);
}

// 9. USER INPUT
userInput.addEventListener('keypress', async function (e) {
    if (e.key === 'Enter' && this.value.trim() !== "") {
        const userMsg = this.value;
        this.value = ""; // Clear input immediately

        addMessage({ name: "USER", colorClass: "persona-user" }, userMsg, true);

        // Fetch specific AI response
        const randomPersona = getRandomElement(personas);
        const aiResponse = await fetchAIResponseToUser(userMsg);

        // Small delay for realism
        setTimeout(() => {
            addMessage(randomPersona, aiResponse);
        }, 1000);
    }
});

// 10. INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    addMessage({ name: "SYSTEM", colorClass: "persona-neural" }, "Initializing neural link...");
    setTimeout(() => {
        addMessage({ name: "SYSTEM", colorClass: "persona-neural" }, "Connected to Hive Mind API.");
        loop();
    }, 1500);
});
