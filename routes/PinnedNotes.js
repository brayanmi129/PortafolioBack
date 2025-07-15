const express = require("express");
const router = express.Router();

//DB firestore
const { db } = require("../firebase/firebase.js");

// Endpoint para obtener notas existentes

router.get("/", async (req, res) => {
  const snapshot = await db.collection("notes").get();
  const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  res.json(notes);
});

router.post("/", async (req, res) => {
  const note = req.body;

  const docRef = await db.collection("notes").add(note);
  const newNote = { id: docRef.id, ...note };

  res.status(201).json(newNote);
});

module.exports = router;
