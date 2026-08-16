const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../config/db");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


const generateDescription = async (req, res) => {
    try {
        const { name, date, time, venue } = req.body;
        const prompt = `You are a professional copywriter. Write a single, highly engaging, and cohesive description paragraph for the following event:
        - Name: "${name}"
        - Date: "${date}"
        - Time: "${time}"
        - Venue: "${venue}"

        Requirements:
        1. Respond with ONLY a single, continuous, and effective description paragraph (2 to 4 sentences).
        2. Do NOT provide multiple options, choices, suggestions, or variations.
        3. Do NOT include bullet points, numbering, lists, headers, or any introductory/concluding remarks.
        4. Do NOT wrap the generated text in quotation marks.
        5. Just return the description text directly.`;

        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();

        // Strip wrapping quotes if Gemini returns them
        if (text.startsWith('"') && text.endsWith('"')) {
            text = text.slice(1, -1);
        } else if (text.startsWith("'") && text.endsWith("'")) {
            text = text.slice(1, -1);
        }

        res.json({ description: text.trim() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const chatWithEvents = async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const sql = "SELECT name, description, date, time, venue, ticket_price FROM events";
        db.query(sql, async (err, events) => {
            if (err) {
                console.error("Database query failed inside chat:", err);
                return res.status(500).json({ error: "Failed to load events database." });
            }

            // Create events list formatted as text
            const eventsText = events.map(e =>
                `- Name: "${e.name}" | Description: ${e.description || "N/A"} | Date: ${e.date} | Time: ${e.time} | Venue: ${e.venue} | Ticket Price: ₹${e.ticket_price || 0}`
            ).join("\n");

            const systemInstruction = `You are a helpful and polite event chatbot assistant for Eventify. 
Here is a list of all events in the event database:
${eventsText}

Your task is to answer user inquiries about these events, suggest matching events, or explain dates/venues/ticket prices. 
Rules:
1. If a user asks about events, check the database events list above and list them clearly (including dates, venues, and ticket prices).
2. If the user asks about an event not in the database, politely let them know that event is not listed in our database, but offer to tell them about other events that are.
3. Keep your answers concise, engaging, and clear. Use bullet points where appropriate.`;

            try {
                // Initialize the model with system instruction
                const chatModel = genAI.getGenerativeModel({
                    model: "gemini-2.5-flash",
                    systemInstruction: systemInstruction
                });

                // Format history correctly for Gemini API
                const formattedHistory = (history || []).map(msg => ({
                    role: msg.role === "user" ? "user" : "model",
                    parts: [{ text: msg.text }]
                }));

                const chat = chatModel.startChat({
                    history: formattedHistory
                });

                const result = await chat.sendMessage(message);
                const text = result.response.text();
                res.json({ response: text });
            } catch (geminiError) {
                console.error("Gemini API call failed:", geminiError);
                res.status(500).json({ error: geminiError.message });
            }
        });
    } catch (error) {
        console.error("Chat controller failed:", error);
        res.status(500).json({ error: error.message });
    }
};

const getFallbackSvg = (name, date, venue) => {
    const cleanName = (name || "Upcoming Event").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanDate = (date || "TBA").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const cleanVenue = (venue || "TBA").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="400" fill="url(#bg)" />
  
  <!-- Abstract Design Elements -->
  <circle cx="700" cy="100" r="150" fill="#a855f7" opacity="0.15" filter="blur(40px)" />
  <circle cx="100" cy="300" r="120" fill="#6366f1" opacity="0.15" filter="blur(30px)" />
  
  <path d="M 0,150 Q 200,100 400,200 T 800,150 L 800,400 L 0,400 Z" fill="url(#accent)" opacity="0.05" />
  
  <!-- Content -->
  <g transform="translate(60, 80)">
    <!-- Tag -->
    <rect width="100" height="26" rx="13" fill="url(#accent)" opacity="0.2" />
    <rect width="100" height="26" rx="13" fill="none" stroke="url(#accent)" stroke-width="1.5" />
    <text x="50" y="17" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="#e0e7ff" text-anchor="middle" letter-spacing="1">EVENT</text>
    
    <!-- Title -->
    <text x="0" y="80" font-family="system-ui, -apple-system, sans-serif" font-size="42" font-weight="800" fill="#ffffff" letter-spacing="-0.5">${cleanName}</text>
    
    <!-- Details -->
    <g transform="translate(0, 150)">
      <!-- Date Icon & Text -->
      <path d="M0,5 h15 v15 h-15 z M3,2 v3 M12,2 v3 M0,10 h15" stroke="#a855f7" stroke-width="1.5" fill="none" />
      <text x="25" y="16" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#cbd5e1">${cleanDate}</text>
      
      <!-- Venue Icon & Text -->
      <g transform="translate(0, 35)">
        <path d="M7.5,0 C3.5,0 0,3.5 0,7.5 C0,13 7.5,20 7.5,20 C7.5,20 15,13 15,7.5 C15,3.5 11.5,0 7.5,0 Z M7.5,10 C6,10 5,9 5,7.5 C5,6 6,5 7.5,5 C9,5 10,6 10,7.5 C10,9 9,10 7.5,10 Z" fill="none" stroke="#6366f1" stroke-width="1.5" />
        <text x="25" y="14" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500" fill="#cbd5e1">${cleanVenue}</text>
      </g>
    </g>
  </g>
</svg>`;
};

const generateEventImage = async (req, res) => {
    try {
        const { name, description, date, time, venue } = req.body;
        if (!description) {
            return res.status(400).json({ error: "Description is required to generate a matching image theme" });
        }

        const prompt = `You are an expert SVG designer. Generate a visually stunning, premium, modern SVG banner image for an event.
Here are the event details:
- Name: "${name || 'Upcoming Event'}"
- Description: "${description}"
- Date: "${date || 'To Be Announced'}"
- Time: "${time || ''}"
- Venue: "${venue || ''}"

Requirements:
1. The SVG MUST have exactly: width="800" height="400" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg"
2. Style: Modern, clean, tech/creative style with beautiful linear or radial gradient backgrounds (e.g. deep space purple, dark slate, electric blue/indigo/magenta gradients). Add abstract glowing geometric shapes, glowing wave paths, or grids with low opacity to add depth and professional tech/glassmorphism design aesthetics.
3. Content elements to include:
   - A prominent, beautiful, and readable typographic layout for the Event Name. Make sure the text uses standard system font-families (like 'system-ui', 'sans-serif', 'Segoe UI', 'Roboto') so it renders perfectly on all devices. Adjust font size and positioning so it fits nicely and does not overflow the 800x400 canvas. Handle long titles gracefully (e.g., smaller font-size, or split into lines if necessary, but keep it in one or two text elements).
   - Display key metadata (Date, Time, Venue) with small decorative elements or text labels.
   - An illustrative SVG icon/shape that matches the theme of the event description (e.g., code brackets for hackathons, musical notes for concerts, stars/sparkles for parties, charts for business).
4. Do NOT use any external image links or external fonts (use standard system fonts). All shapes and colors must be self-contained SVG elements.
5. RESPOND WITH ONLY THE RAW SVG CODE. Do not include any explanations, markdown code block wrappers (like \`\`\`xml or \`\`\`svg), HTML wrapper tags, or additional text. Start directly with <svg> and end with </svg>.`;

        let svgText = "";
        try {
            const result = await model.generateContent(prompt);
            svgText = result.response.text().trim();

            // Clean markdown wrappers if returned
            if (svgText.startsWith("```")) {
                svgText = svgText.replace(/^```[a-zA-Z0-9]*\n/, "");
                svgText = svgText.replace(/\n```$/, "");
            }
            svgText = svgText.trim();

            // Basic validation to check if it contains <svg and </svg>
            if (!svgText.includes("<svg") || !svgText.includes("</svg>")) {
                throw new Error("Invalid SVG format returned by Gemini");
            }
        } catch (apiError) {
            console.error("Gemini SVG generation failed, using fallback:", apiError);
            svgText = getFallbackSvg(name, date, venue);
        }

        const base64Svg = Buffer.from(svgText).toString("base64");
        const imageUrl = `data:image/svg+xml;base64,${base64Svg}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error("Event image generation route failed:", error);
        res.json({ imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800" });
    }
};

module.exports = { generateDescription, chatWithEvents, generateEventImage };