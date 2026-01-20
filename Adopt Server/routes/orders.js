const express = require("express");
const router = express.Router();
const ordersController = require("../controller/orders");
const { loginCheck } = require("../middleware/auth");

router.get("/get-all-orders", loginCheck, ordersController.getAllOrders);
router.post("/order-by-user", ordersController.getOrderByUser);

router.post("/create-order", loginCheck, ordersController.postCreateOrder);
router.post("/update-order", loginCheck, ordersController.postUpdateOrder);
router.post("/delete-order", loginCheck, ordersController.postDeleteOrder);

module.exports = router;
