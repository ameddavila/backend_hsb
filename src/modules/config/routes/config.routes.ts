import { Router } from "express";
import * as configController from "@modules/config/controllers/dbConnection.controller";

const router = Router();

router.get("/", configController.getAll);
router.get("/:id", configController.getById);
router.post("/", configController.create);
router.put("/:id", configController.update);
router.delete("/:id", configController.remove);

export default router;
