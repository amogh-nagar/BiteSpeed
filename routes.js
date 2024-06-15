const express = require("express");
const { identify } = require("./controllers/contacts");
const router = express.Router();

router.post("/identify", identify);

module.exports = router;
