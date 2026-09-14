import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../database/mongo.js";

/**
 * Controller do Carrinho de compras do PopsMarket.
 * O carrinho é persistido no MongoDB (coleção 'carrinhos'), com os itens
 * embutidos para leitura atômica do documento do cliente.
 */
export class CarrinhoController {
  /**
   * 4. CARRINHO DO CLIENTE
   * GET /api/clientes/:id/carrinho
   * Recupera o carrinho pelo cliente_id e calcula o total dos itens embutidos.
   */
  static async obter(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ erro: "ID de cliente inválido." });
        return;
      }

      const col = getCollection("carrinhos");
      const carrinho = await col.findOne({ cliente_id: new ObjectId(id) });

      if (!carrinho) {
        res.status(404).json({ erro: "Carrinho não encontrado para este cliente." });
        return;
      }

      const itens = (carrinho.itens as any[]) || [];
      const total = itens.reduce(
        (acc, item) => acc + item.preco_unitario * item.quantidade,
        0
      );

      res.json({
        cliente_id: id,
        total_itens: itens.length,
        valor_total: Number(total.toFixed(2)),
        carrinho,
      });
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao obter carrinho", detalhe: err.message });
    }
  }
}
