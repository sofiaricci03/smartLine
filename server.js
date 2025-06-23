const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public")); 

let latestQueue = {
  queue_length: 0,
  estimated_time: 0,
};

app.post("/queue", (req, res) => {
  const queue = req.body.queue_length;
  console.log("Queue length received:", queue);

  latestQueue.queue_length = queue;
  latestQueue.estimated_time = queue * 2;

  res.send({ status: "ok" });
});

app.get("/status", (req, res) => {
  res.json(latestQueue);
});

app.listen(PORT, () => {
  console.log(`✅ Server in ascolto su http://localhost:${PORT}`);
});
