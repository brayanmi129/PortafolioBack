const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const { storage } = require("../firebase/firebase.js");
const filePath = "history.json"; // Ruta del archivo JSON

async function getHistory(userId) {
  const localPath = path.join(__dirname, "..", `ChatHistories/${userId}.json`);
  const firebasePath = `ChatHistories/${userId}.json`;

  try {
    await storage.file(firebasePath).download({ destination: localPath });
    const data = fs.readFileSync(localPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 404) {
      console.log(`Historial no encontrado para ${userId}. Creando uno nuevo...`);

      // Crear historial vacío localmente
      fs.writeFileSync(localPath, JSON.stringify([], null, 2), "utf-8");

      // Subir el archivo vacío al bucket
      await storage.upload(localPath, {
        destination: firebasePath,
        contentType: "application/json",
        gzip: true,
      });

      const data = fs.readFileSync(localPath, "utf-8");
      return JSON.parse(data);
    } else {
      throw error; // otro error
    }
  }
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

router.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  const localPath = path.join(__dirname, "..", `ChatHistories/${userId}.json`);
  const firebasePath = `ChatHistories/${userId}.json`;

  console.log(userId, message);
  if (!userId) return res.status(400).json({ error: "Se requiere userId" });

  // Obtener el historial del usuario
  history = await getHistory(userId);

  try {
    console.log("Entrando al try...");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: history });

    // Enviar mensaje y obtener respuesta
    await chat.sendMessage(message);

    // Guardar historial en archivo
    fs.writeFileSync(localPath, JSON.stringify(history, null, 2), "utf-8");
    console.log("Historial guardado en history.json");

    // Subir el archivo vacío al bucket
    await storage.upload(localPath, {
      destination: firebasePath,
      contentType: "application/json",
      gzip: true,
    });

    // Enviar respuesta al cliente al final
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
    console.error("Error al enviar el mensaje:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/history", async (req, res) => {
  const { userId } = req.query;
  console.log(`Obteniendo historial para  el usuario ${userId}`);
  const history = await getHistory(userId);
  res.json(history);
});

module.exports = router;
