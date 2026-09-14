import { Router } from "express";
import { CarrinhoController } from "../controllers/carrinho.controller.js";
import { PedidosController } from "../controllers/pedidos.controller.js";

const router = Router();

// GET /api/clientes/:id/carrinho  → carrinho de compras do cliente
router.get("/:id/carrinho", CarrinhoController.obter);

// GET /api/clientes/:id/pedidos   → histórico de pedidos do cliente
router.get("/:id/pedidos", PedidosController.listarPorCliente);

export default router;
