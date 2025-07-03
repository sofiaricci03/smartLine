const mqtt = require('mqtt');

// Connessione al broker pubblico oppure installare mosquitto per localhost con mqtt
const brokerUrl = 'mqtt://test.mosquitto.org';
const client = mqtt.connect(brokerUrl);

// Topic per inviare e ricevere
const topic = 'progetto/queue';

// se connesso
client.on('connect', () => {
    console.log('🔌 Connesso al broker MQTT pubblico');

    // si iscrive al topic
    client.subscribe(topic, (err) => {
        if (!err) {
        console.log(` Iscritto al topic: ${topic}`);
        } else {
        console.error('❌ Errore nella sottoscrizione:', err.message);
        }
    });

    // Pubblica un messaggio ogni 5 secondi
    setInterval(() => {
        const payload = {
        timestamp: new Date().toISOString(),
        people: Math.floor(Math.random() * 10) + 1 // numero casuale tra 1 e 10
        };

        const json = JSON.stringify(payload);
        client.publish(topic, json);
        console.log(`📤 Pubblicato su ${topic}: ${json}`);
    }, 5000);
});

// Quando riceve un messaggio
client.on('message', (topic, message) => {
    console.log(`📩 Messaggio ricevuto su ${topic}: ${message.toString()}`);
});

// Gestione errori
client.on('error', (err) => {
    console.error('❌ Errore nella connessione MQTT:', err.message);
});
