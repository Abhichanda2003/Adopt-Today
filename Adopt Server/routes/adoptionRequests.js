const express = require("express");
const router = express.Router();

const { loginCheck } = require("../middleware/auth");
const adoptionRequestsController = require("../controller/adoptionRequests");

router.get("/", loginCheck, adoptionRequestsController.list);
router.delete("/:id", loginCheck, adoptionRequestsController.remove);

module.exports = router;
