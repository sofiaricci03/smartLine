const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// === MQTT SETUP ===
const brokerUrl = 'mqtt://broker.hivemq.com';
const client = mqtt.connect(brokerUrl);

const topics = [
    'progetto/famila_tdm',
    'progetto/conad_montefiore',
    'progetto/famila_gambettola'
];

client.on('connect', () => {
    console.log('✅ Connesso al broker MQTT pubblico');

    topics.forEach(topic => {
        client.subscribe(topic, (err) => {
        if (!err) {
            console.log(`📡 Iscritto al topic: ${topic}`);
        } else {
            console.error(`❌ Errore nella sottoscrizione a ${topic}:`, err.message);
        }
        });
    });
});

// === EXPRESS STATIC SETUP ===
app.use(cors());
app.use(express.static(path.join(__dirname, 'public'))); // serve i file HTML/CSS/JS

const server = app.listen(PORT, () => {
    console.log(`🚀 Server web in esecuzione su http://localhost:${PORT}`);
});

// === WEBSOCKET SERVER ===
const wss = new WebSocket.Server({ server });
const clients = new Set(); // per tenere traccia dei client connessi

wss.on('connection', (ws) => {
    console.log('🔌 Nuova connessione WebSocket');
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('❎ Connessione WebSocket chiusa');
    });
});

// === FORWARD MQTT MESSAGES TO WEB CLIENTS ===
client.on('message', (topic, message) => {
    const payload = {
        topic,
        data: message.toString()
    };

    console.log(`📥 Ricevuto su ${topic}: ${payload.data}`);

    // Inoltra il messaggio a tutti i client WebSocket connessi
    clients.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
        }
    });
});
