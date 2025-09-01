const express = require("express");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("User logged in:", email);
});

module.exports = router;
