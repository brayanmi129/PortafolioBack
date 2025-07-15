//librerias
const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config(); // Importar la configuración de las variables de entorno
const notesRoutes = require("./routes/PinnedNotes.js");
const IA = require("./routes/IA.js");

//DB firestore
const { db } = require("./firebase/firebase.js");

//variables globales
const port = process.env.PORT || 3000;
// Crear la aplicación Express
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Importa y ejecuta tus sockets
require("./sockets/websocket.js")(io, db);

//configuracion cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//middlewares
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());

app.use("/api/notes", notesRoutes); // Tus rutas serán accesibles como /api/notes
app.use("/api/ia", IA); // Tus rutas de IA serán accesibles como /api/ia

// Ruta / que responde con "Hola"
app.get("/", (req, res) => {
  res.send("Hola");
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
