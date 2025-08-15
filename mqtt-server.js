const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// === MQTT SETUP ===
const brokerUrl = 'mqtt://broker.hivemq.com:1883'; // Porta corretta per MQTT
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
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Serve anche gli assets

const server = app.listen(PORT, () => {
    console.log(`🚀 Server web in esecuzione su http://localhost:${PORT}`);
});

// === WEBSOCKET SERVER ===
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('🔌 Nuova connessione WebSocket');
    clients.add(ws);

    ws.on('close', () => {
        clients.delete(ws);
        console.log('❎ Connessione WebSocket chiusa');
    });

    ws.on('error', (error) => {
        console.error('❌ Errore WebSocket:', error);
        clients.delete(ws);
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
            try {
                ws.send(JSON.stringify(payload));
            } catch (error) {
                console.error('❌ Errore invio WebSocket:', error);
                clients.delete(ws);
            }
        }
    });
});

client.on('error', (error) => {
    console.error('❌ Errore MQTT:', error);
});

client.on('disconnect', () => {
    console.log('❎ Disconnesso dal broker MQTT');
});