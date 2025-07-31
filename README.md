Wokwi frst try
https://wokwi.com/projects/437823757698406401


🔧 Componenti Hardware Simulati (Wokwi)
Componente	Descrizione
ESP32 DevKit v1	Microcontrollore principale
HC-SR04	Sensore di distanza per rilevare la coda
Pulsante	Simula eventi manuali (es. reset o stato)

⚙ Wiring (Pinout ESP32):
Componente	ESP32 Pin	Funzione
TRIG	D23	Trigger ultrasonico
ECHO	D22	Echo ultrasonico
Button	D18	Input digitale
Alimentazione	3.3V / GND	VCC / GND

🌐 Connessione WiFi + MQTT
Wi-Fi: Connessione automatica alla rete Wokwi (Wokwi-GUEST)

MQTT Broker: broker.hivemq.com

Topic MQTT: progetto/conad_montefiore
            progetto/famila_tdm
            progetto/famila_gambettola

📤 Dati pubblicati (formato JSON)
L'ESP32 simula ogni 5 secondi:

{
  "queue_length": 12,
  "estimated_time": 8,
  "casse": [2, 3, 1, 0, 4]
}
queue_length: numero stimato di persone in fila

estimated_time: tempo medio d'attesa (in minuti)

casse: numero di persone in attesa per ciascuna delle 5 casse

💻 Dashboard Web
La pagina HTML si connette direttamente al broker tramite WebSocket (wss://broker.hivemq.com:8000/mqtt) e aggiorna in tempo reale:

🔢 Numero di persone in coda

⏱️ Tempo stimato d'attesa

📊 Grafici storici e stato delle casse (Chart.js)



▶️ Simulazione (Wokwi)
 Eseguire la simulazione del sistema direttamente su Wokwi caricando il progetto contenente:

diagram.json

main.cpp (sketch ESP32)

Pagina HTML in locale o su live server (npm run dev)

📂 Requisiti e Setup

Node.js (solo se si usa npm run dev con live server o backend)

Broker MQTT pubblico (HiveMQ o Mosquitto)

IDE per caricare il codice su Wokwi o ESP32 fisico

