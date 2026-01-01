const express = require("express");
const router = express.Router();
const sendd = require("../controller/Send-email")

router.post("/handler",sendd.handler );

module.exports = router;
