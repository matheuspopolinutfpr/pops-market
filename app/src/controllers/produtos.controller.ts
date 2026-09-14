import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../database/mongo.js";

/**
 * Controller de Produtos do PopsMarket.
 * Todas as consultas conectam-se diretamente ao MongoDB via driver oficial.
 */
export class ProdutosController {
  /**
   * 1. VITRINE DA HOME — PRODUTOS MELHOR AVALIADOS
   * GET /api/produtos/top
   * Filtro por avaliação, ordenação decrescente e projeção econômica (mobile).
   */
  static async listarTop(req: Request, res: Response): Promise<void> {
    try {
      const col = getCollection("produtos");
      const produtos = await col
        .find(
          { disponivel: true, "avaliacao.media": { $gte: 4.0 } },
          { projection: { nome: 1, preco: 1, avaliacao: 1, imagens: 1, categorias: 1 } }
        )
        .sort({ "avaliacao.media": -1 })
        .limit(10)
        .toArray();

      res.json({ total: produtos.length, dados: produtos });
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao listar produtos em destaque", detalhe: err.message });
    }
  }

  /**
   * 2. PRODUTOS POR CATEGORIA
   * GET /api/produtos?categoria=Eletrônicos
   * Filtro por categoria (array multikey) + disponibilidade, ordenado por preço.
   */
  static async listarPorCategoria(req: Request, res: Response): Promise<void> {
    try {
      const categoria = req.query.categoria as string;
      const filtro: Record<string, unknown> = { disponivel: true };
      if (categoria && categoria.trim().length > 0) {
        filtro.categorias = categoria;
      }

      const col = getCollection("produtos");
      const produtos = await col.find(filtro).sort({ preco: 1 }).toArray();

      res.json({
        categoria: categoria || "todas",
        total: produtos.length,
        dados: produtos,
      });
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao listar produtos por categoria", detalhe: err.message });
    }
  }

  /**
   * 3. DETALHES DO PRODUTO + DADOS DO VENDEDOR
   * GET /api/produtos/:id
   * Aggregation com $lookup (join) na coleção 'vendedores'.
   */
  static async detalhar(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        res.status(400).json({ erro: "ID inválido do MongoDB." });
        return;
      }

      const col = getCollection("produtos");
      const resultado = await col
        .aggregate([
          { $match: { _id: new ObjectId(id) } },
          {
            $lookup: {
              from: "vendedores",
              localField: "vendedor_id",
              foreignField: "_id",
              as: "vendedor",
            },
          },
          { $unwind: { path: "$vendedor", preserveNullAndEmptyArrays: true } },
        ])
        .toArray();

      if (resultado.length === 0) {
        res.status(404).json({ erro: "Produto não encontrado." });
        return;
      }

      res.json({ dados: resultado[0] });
    } catch (err: any) {
      res.status(500).json({ erro: "Erro ao detalhar produto", detalhe: err.message });
    }
  }
}
