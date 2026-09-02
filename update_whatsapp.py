import re

def update_whatsapp_project():
    # Update project-whatsapp-bot.html
    with open('project-whatsapp-bot.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace(
        'A multilingual WhatsApp chatbot powered by Groq AI that seamlessly impersonates the user, auto-detects language, and maintains conversational memory.',
        'A multilingual WhatsApp auto-responder bot that seamlessly impersonates the user using Groq AI. It dynamically maintains conversational memory to act as a highly intelligent personal assistant.'
    )
    
    content = content.replace(
        '<p>\n              The WhatsApp Groq Bot is an intelligent chatbot designed to provide seamless, conversational interactions directly within WhatsApp. Powered by Groq\'s insanely fast inference engine (Llama 3.3), it goes beyond simple rule-based bots by offering full natural language understanding.\n            </p>\n            <p>\n              A key feature of the bot is its multilingual capability and perfect impersonation logic. It automatically detects the language of incoming messages and replies in the exact same language. Additionally, it maintains a conversational memory within a 1-hour window, allowing for natural, flowing interactions rather than isolated question-answer pairs. The bot securely stores its login session in MongoDB to survive ephemeral server restarts on Render.\n            </p>\n            <p>\n              Built entirely on free-tier services, it demonstrates how powerful AI solutions can be deployed cost-effectively for personal use or small business testing.\n            </p>',
        '<p>\n              The WhatsApp Groq Bot is a highly capable auto-responder that acts as a personal assistant directly within WhatsApp. Powered by Groq AI (Llama 3.3), it perfectly mimics my casual texting style to handle conversations on my behalf without revealing it is an AI.\n            </p>\n            <p>\n              A major standout feature is its dynamic state-management. It uses MongoDB for robust session persistence, ensuring that conversational context is maintained securely across ephemeral server restarts. Additionally, the bot is fully multilingual, intelligently detecting and responding in the language of the incoming message.\n            </p>'
    )
    
    content = content.replace(
        '<div class="feature-item">\n                <span class="feature-icon">🌍</span>\n                <div class="feature-text">\n                  <h4>Multilingual</h4>\n                  <p>Automatically detects the language of any incoming text and intelligently replies in the same language.</p>\n                </div>\n              </div>\n              <div class="feature-item">\n                <span class="feature-icon">🧠</span>\n                <div class="feature-text">\n                  <h4>Conversational Memory</h4>\n                  <p>Remembers the context of the conversation within a 1-hour window, enabling multi-turn dialogue.</p>\n                </div>\n              </div>\n              <div class="feature-item">\n                <span class="feature-icon">💬</span>\n                <div class="feature-text">\n                  <h4>Perfect Impersonation</h4>\n                  <p>Tuned to provide short, friendly, and casual WhatsApp-style replies, impersonating the user perfectly without revealing it\'s an AI.</p>\n                </div>\n              </div>\n              <div class="feature-item">\n                <span class="feature-icon">💸</span>\n                <div class="feature-text">\n                  <h4>MongoDB Persistence</h4>\n                  <p>Architected to run entirely on the free tier of Render, utilizing MongoDB Atlas to preserve WhatsApp Web session keys.</p>\n                </div>\n              </div>',
        '<div class="feature-item">\n                <span class="feature-icon">💬</span>\n                <div class="feature-text">\n                  <h4>Perfect Impersonation</h4>\n                  <p>A highly tuned Groq AI system prompt designed to perfectly mimic my casual texting style without revealing it is an AI.</p>\n                </div>\n              </div>\n              <div class="feature-item">\n                <span class="feature-icon">🧠</span>\n                <div class="feature-text">\n                  <h4>Dynamic Session Persistence</h4>\n                  <p>Dynamic state-management using MongoDB for robust session persistence, allowing it to remember past context securely.</p>\n                </div>\n              </div>\n              <div class="feature-item">\n                <span class="feature-icon">🌍</span>\n                <div class="feature-text">\n                  <h4>Multilingual</h4>\n                  <p>Automatically detects the language of any incoming text and intelligently replies in the same language.</p>\n                </div>\n              </div>'
    )
    
    content = content.replace(
        'The bot is built using a lightweight Node.js Express server that handles incoming webhooks from the WhatsApp Cloud API. When a message is received, it extracts the text and sender ID, appending it to the user\'s specific conversational history. This history is then passed to the Groq AI API to generate context-aware responses.',
        'The core of the bot runs on Node.js utilizing the <code>@whiskeysockets/baileys</code> library to interface with WhatsApp. MongoDB handles the state-management and session keys, while the Groq API (Llama 3.3) provides the lightning-fast intelligence.'
    )
    
    content = content.replace(
        '<span>Node.js</span>\n              <span>Express</span>\n              <span>Gemini API</span>\n              <span>WhatsApp API</span>',
        '<span>Node.js</span>\n              <span>Baileys</span>\n              <span>Groq API (Llama 3.3)</span>\n              <span>MongoDB</span>'
    )
    
    with open('project-whatsapp-bot.html', 'w', encoding='utf-8') as f:
        f.write(content)

    # Update index.html
    with open('index.html', 'r', encoding='utf-8') as f:
        index_content = f.read()

    index_content = index_content.replace(
        '<p>A multilingual WhatsApp chatbot powered by Groq AI that auto-detects language and maintains conversational memory.</p>',
        '<p>A multilingual WhatsApp auto-responder bot that seamlessly impersonates the user using Groq AI and dynamically maintains conversational memory.</p>'
    )
    
    index_content = index_content.replace(
        '<span>Node.js</span><span>Groq API</span><span>MongoDB</span>',
        '<span>Node.js</span><span>Groq API</span><span>Baileys</span><span>MongoDB</span>'
    )
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(index_content)

update_whatsapp_project()
