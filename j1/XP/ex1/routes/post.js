const express = require("express");
const axios = require("axios");
const router = express.Router();

const API_URL = "https://jsonplaceholder.typicode.com/posts";


router.get("/", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const response = await axios.post(API_URL, req.body);
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
