import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../database/mongo.js";

/**
 * Controller de Pedidos do PopsMarket.
 * Consultas conectadas diretamente ao MongoDB via driver oficial.
 */
export class PedidosController {
  /**
   * 5. HISTÓRICO DE PEDIDOS DO CLIENTE
   * GET /api/clientes/:id/pedidos
   * Lista os pedidos do cliente ordenados do mais recente ao mais antigo.
   */
  static async listarPorCliente(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ erro: "ID de cliente inválido." });
        return;
      }

      const col = getCollection("pedidos");
      const pedidos = await col
        .find({ cliente_id: new ObjectId(id) })
        .sort({ data: -1 })
        .toArray();

      const totalGasto = pedidos.reduce(
        (acc, pedido) => acc + (pedido.valor_total as number),
        0
      );

      res.json({
        cliente_id: id,
        total_pedidos: pedidos.length,
        total_gasto: Number(totalGasto.toFixed(2)),
        dados: pedidos,
      });
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao listar pedidos do cliente", detalhe: err.message });
    }
  }
}
