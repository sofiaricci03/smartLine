const mqtt = require('mqtt');

// Connessione al broker pubblico oppure installare mosquitto per localhost con mqtt
const brokerUrl = 'mqtt://test.mosquitto.org';
const client = mqtt.connect(brokerUrl);

// Array di topic per ogni punto vendita
const topics = [
    'progetto/famila_tdm',
    'progetto/conad_montefiore',
    'progetto/famila_gambettola'
];

client.on('connect', () => {
    console.log('Connesso al broker MQTT pubblico');

    // Iscrizione a tutti i topic
    topics.forEach(topic => {
        client.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Iscritto al topic: ${topic}`);
            } else {
                console.error(`Errore nella sottoscrizione a ${topic}:`, err.message);
            }
        });
    });

    // ora pubblica i dati casuali su ogni topic, non più solo queue
    setInterval(() => {
        topics.forEach(topic => {
            const payload = {
                timestamp: new Date().toISOString(),
                queue_length: Math.floor(Math.random() * 20) + 1,
                estimated_time: Math.floor(Math.random() * 10) + 1,
                casse: Array.from({ length: 10 }, () => Math.floor(Math.random() * 6)) // 10 casse con 0-5 persone
            };

            const json = JSON.stringify(payload);
            client.publish(topic, json);
            console.log(` Pubblicato su ${topic}: ${json}`);
        });
    }, 5000);
});

// Quando riceve un messaggio
client.on('message', (topic, message) => {
    console.log(`Ricevuto su ${topic}: ${message.toString()}`);
});

// Gestione errori
client.on('error', (err) => {
    console.error('Errore nella connessione MQTT:', err.message);
});
