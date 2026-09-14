import { Router } from "express";
import { ProdutosController } from "../controllers/produtos.controller.js";

const router = Router();

// GET /api/produtos/top  → produtos melhor avaliados (antes de /:id)
router.get("/top", ProdutosController.listarTop);

// GET /api/produtos?categoria=  → produtos por categoria
router.get("/", ProdutosController.listarPorCategoria);

// GET /api/produtos/:id  → detalhes do produto + vendedor ($lookup)
router.get("/:id", ProdutosController.detalhar);

export default router;
