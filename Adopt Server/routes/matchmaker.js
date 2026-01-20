const express = require("express");
const router = express.Router();

const matchmakerController = require("../controller/matchmaker");

router.post("/explain", matchmakerController.explain);

module.exports = router;
