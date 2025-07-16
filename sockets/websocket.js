// /sockets/index.js

module.exports = (io, db) => {
  io.on("connection", async (socket) => {
    console.log("Usuario conectado:", socket.id);

    // ✅ Al conectar, enviar TODAS las notas actuales
    const snapshot = await db.collection("notes").get();
    const notes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    socket.emit("initial-notes", notes);

    // ✅ Crear nota
    socket.on("create-note", async (note) => {
      console.log("Nota creada:", note);
      const docRef = await await db.collection("notes").doc(note.id.toString()).set(note);
      const newNote = { id: docRef.id, ...note };
      io.emit("note-created", newNote);
    });

    socket.on("drag-note", (note) => {
      socket.broadcast.emit("note-dragged", note);
      console.log("Nota arrastrada:", note.x, note.y);
    });

    // ✅ Actualizar nota
    socket.on("update-note", async (note, client) => {
      console.log("Client:", client);
      await db.collection("notes").doc(note.id.toString()).update(note);
      io.emit("note-updated", note, client);
      console.log("Nota actualizada:", note);
    });

    // ✅ Eliminar nota
    socket.on("delete-note", async (id) => {
      await db.collection("notes").doc(id.toString()).delete();
      io.emit("note-deleted", id);
    });

    socket.on("mouse-move", ({ x, y }) => {
      socket.broadcast.emit("mouse-update", { clientId: socket.id, x, y });
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("user-disconnected", socket.id);
      console.log("Usuario desconectado:", socket.id);
    });
  });
};
