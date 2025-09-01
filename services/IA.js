const path = require("path");
const fs = require("fs");
const { storage } = require("../firebase/firebase.js");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_KEY);

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

async function sendMessage(userId, message) {
  const localPath = path.join(__dirname, "..", `ChatHistories/${userId}.json`);
  const firebasePath = `ChatHistories/${userId}.json`;

  console.log(userId, message);

  // Obtener el historial del usuario
  const history = await getHistory(userId);

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
    return history;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    throw error;
  }
}

async function clearChat(userId) {
  const localPath = path.join(__dirname, "..", `ChatHistories/${userId}.json`);
  const firebasePath = `ChatHistories/${userId}.json`;

  // Dejar el historial vacío
  fs.writeFileSync(localPath, JSON.stringify([], null, 2), "utf-8");

  // Subir el archivo vacío al bucket
  await storage.upload(localPath, {
    destination: firebasePath,
    contentType: "application/json",
    gzip: true,
  });
}

module.exports = { getHistory, sendMessage, clearChat };
