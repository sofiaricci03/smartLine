Wokwi frst try
https://wokwi.com/projects/434297235363032065

1.Uso sensori TCRT5000 su pin 12 e 13 con INPUT_PULLUP.

2.Invio dati MQTT ogni 10s con numero persone (queue_length), tempo stimato (estimated_time) e stato simulato di 10 casse.

Da implementare:

1.Fare debounce, anche semplificato, per evitare che ogni passaggio sia conteggiato più volte
2. Aggiungere id univoco per MQTT.