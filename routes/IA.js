const express = require("express");
const router = express.Router();

const { getHistory, sendMessage, clearChat } = require("../services/IA.js");

router.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  try {
    const history = await sendMessage(userId, message);
    res.json(history);

    console.log("Conversación actualizada:");
    history.forEach((element) => {
      console.log(
        element.role === "user"
          ? `Usuario ${userId}: ${element.parts[0].text}`
          : `GeminiIA: ${element.parts[0].text}`
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", async (req, res) => {
  const { userId } = req.query;
  console.log(`Obteniendo historial para  el usuario ${userId}`);
  const history = await getHistory(userId);
  res.json(history);
});

router.post("/clearChat", async (req, res) => {
  const { userId } = req.body;

  try {
    const history = await clearChat(userId);

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error("Error al limpiar el chat:", error);
  }
});

module.exports = router;
