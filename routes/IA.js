const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
const fs = require("fs");

const filePath = "history.json"; // Ruta del archivo JSON

// 1. Leer el archivo JSON
let history = {};
if (fs.existsSync(filePath)) {
  history = JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

router.post("/chat", async (req, res) => {
  const { userId, message } = req.body;
  console.log(userId, message);
  if (!userId) return res.status(400).json({ error: "Se requiere userId" });

  // Inicializar historial si no existe
  if (!history[userId]) {
    history[userId] = [];
  }

  try {
    console.log("Entrando al try...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: history[userId] });

    // Enviar mensaje y obtener respuesta
    await chat.sendMessage(message);

    // Guardar historial en archivo
    fs.writeFileSync(filePath, JSON.stringify(history, null, 2), "utf-8");
    console.log("Historial guardado en history.json");

    // Enviar respuesta al cliente al final
    res.json(history[userId]);

    console.log("Conversación actualizada:");
    history[userId].forEach((element) => {
      console.log(
        element.role === "user"
          ? `Usuario ${userId}: ${element.parts[0].text}`
          : `GeminiIA: ${element.parts[0].text}`
      );
    });
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/historial", (req, res) => {
  const { userId } = req.query;
  console.log(userId);
  res.json(history[userId]);
});

module.exports = router;
