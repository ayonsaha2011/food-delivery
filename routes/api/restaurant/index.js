const express = require("express");
const controller = require("./restaurant.controller");
const auth = require("../auth/auth.service");

const router = express.Router();

router.get("/", auth.hasRole("user"), controller.index);
router.get("/:id", auth.hasRole("user"), controller.show);
router.post("/", auth.hasRole("owner"), controller.create);
router.put("/:id", auth.hasRole("owner"), controller.update);
router.patch("/:id", auth.hasRole("owner"), controller.update);
router.delete("/:id", auth.hasRole("owner"), controller.destroy);

module.exports = router;
