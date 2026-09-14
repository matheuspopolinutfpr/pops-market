/**
 * ============================================================================
 * MONGODB INITIALIZATION SCRIPT — POPSMARKET
 * ============================================================================
 *
 * Executado automaticamente na primeira inicialização do MongoDB (Docker).
 * Cria o banco, as coleções, os índices e insere os dados iniciais do
 * marketplace PopsMarket (vendedores, produtos, clientes, pedidos e carrinhos).
 */

db = db.getSiblingDB("popsmarket");

// ── 1. COLEÇÃO: vendedores ────────────────────────────────────────────────────
db.createCollection("vendedores");
db.vendedores.createIndex({ "nome": 1 });
db.vendedores.createIndex({ "ativo": 1 });
db.vendedores.createIndex({ "categorias_atuacao": 1 });

const resVendedores = db.vendedores.insertMany([
  {
    nome: "TechStore Guarapuava",
    cnpj: "12.345.678/0001-90",
    endereco: { rua: "Rua XV de Novembro", numero: 1200, cidade: "Guarapuava", cep: "85010-000" },
    categorias_atuacao: ["Eletrônicos", "Informática"],
    avaliacao_media: 4.8,
    ativo: true,
    criado_em: new Date("2025-01-15T10:00:00Z")
  },
  {
    nome: "Casa & Conforto",
    cnpj: "23.456.789/0001-01",
    endereco: { rua: "Av. Manoel Ribas", numero: 850, cidade: "Guarapuava", cep: "85010-100" },
    categorias_atuacao: ["Casa", "Móveis", "Decoração"],
    avaliacao_media: 4.5,
    ativo: true,
    criado_em: new Date("2025-02-20T14:30:00Z")
  },
  {
    nome: "Moda Urbana",
    cnpj: "34.567.890/0001-12",
    endereco: { rua: "Rua Saldanha Marinho", numero: 320, cidade: "Guarapuava", cep: "85010-200" },
    categorias_atuacao: ["Moda", "Calçados", "Acessórios"],
    avaliacao_media: 4.2,
    ativo: true,
    criado_em: new Date("2025-03-05T09:15:00Z")
  },
  {
    nome: "EsporteTotal",
    cnpj: "45.678.901/0001-23",
    endereco: { rua: "Rua Benjamin Constant", numero: 45, cidade: "Guarapuava", cep: "85010-300" },
    categorias_atuacao: ["Esportes", "Fitness"],
    avaliacao_media: 3.9,
    ativo: false,
    criado_em: new Date("2025-04-10T16:45:00Z")
  }
]);

const idTech = resVendedores.insertedIds[0];
const idCasa = resVendedores.insertedIds[1];
const idModa = resVendedores.insertedIds[2];
const idEsporte = resVendedores.insertedIds[3];

// ── 2. COLEÇÃO: produtos (entidade central) ───────────────────────────────────
db.createCollection("produtos");
db.produtos.createIndex({ "vendedor_id": 1 });
db.produtos.createIndex({ "categorias": 1 });
db.produtos.createIndex({ "preco": 1 });
db.produtos.createIndex({ "avaliacao.media": -1 });
db.produtos.createIndex({ "data_criacao": -1 });

const resProdutos = db.produtos.insertMany([
  {
    vendedor_id: idTech,
    nome: "Notebook Lenovo IdeaPad 3",
    descricao: "Notebook para estudos, trabalho e uso cotidiano.",
    preco: 3499.90,
    estoque: 25,
    disponivel: true,
    data_criacao: new Date("2026-08-01T14:30:00Z"),
    dimensoes: { altura_cm: 1.99, largura_cm: 35.9, profundidade_cm: 23.6, peso_kg: 1.65 },
    especificacoes: { processador: "Intel Core i5", memoria_ram_gb: 16, armazenamento_gb: 512, tipo_armazenamento: "SSD" },
    categorias: ["Informática", "Notebooks", "Eletrônicos"],
    imagens: ["notebook-frente.jpg", "notebook-lateral.jpg"],
    avaliacao: { media: 4.7, total: 128 }
  },
  {
    vendedor_id: idTech,
    nome: "Smartphone Samsung Galaxy A54",
    descricao: "Smartphone 5G com tela AMOLED de 6.4 polegadas.",
    preco: 1899.00,
    estoque: 40,
    disponivel: true,
    data_criacao: new Date("2026-08-10T11:00:00Z"),
    dimensoes: { altura_cm: 15.8, largura_cm: 7.6, profundidade_cm: 0.8, peso_kg: 0.202 },
    especificacoes: { processador: "Exynos 1380", memoria_ram_gb: 8, armazenamento_gb: 256, tela: "AMOLED 120Hz" },
    categorias: ["Eletrônicos", "Celulares"],
    imagens: ["galaxy-a54-frente.jpg"],
    avaliacao: { media: 4.5, total: 96 }
  },
  {
    vendedor_id: idTech,
    nome: "Fone de Ouvido Bluetooth JBL Tune 520",
    descricao: "Fone on-ear sem fio com até 57h de bateria.",
    preco: 249.90,
    estoque: 120,
    disponivel: true,
    data_criacao: new Date("2026-08-15T09:00:00Z"),
    dimensoes: { altura_cm: 18.0, largura_cm: 16.0, profundidade_cm: 7.0, peso_kg: 0.16 },
    especificacoes: { conexao: "Bluetooth 5.3", bateria_horas: 57, cor: "Preto" },
    categorias: ["Eletrônicos", "Áudio"],
    imagens: ["jbl-tune-520.jpg"],
    avaliacao: { media: 4.3, total: 210 }
  },
  {
    vendedor_id: idCasa,
    nome: "Cadeira de Escritório Ergonômica",
    descricao: "Cadeira com apoio lombar ajustável e braços 3D.",
    preco: 899.90,
    estoque: 15,
    disponivel: true,
    data_criacao: new Date("2026-07-20T13:00:00Z"),
    dimensoes: { altura_cm: 120.0, largura_cm: 65.0, profundidade_cm: 65.0, peso_kg: 14.5 },
    especificacoes: { material: "Tela mesh", cor: "Preto", capacidade_kg: 120 },
    categorias: ["Casa", "Móveis", "Escritório"],
    imagens: ["cadeira-ergonomica.jpg"],
    avaliacao: { media: 4.6, total: 54 }
  },
  {
    vendedor_id: idCasa,
    nome: "Luminária de Mesa LED",
    descricao: "Luminária articulada com três níveis de intensidade.",
    preco: 129.90,
    estoque: 60,
    disponivel: true,
    data_criacao: new Date("2026-08-25T10:30:00Z"),
    dimensoes: { altura_cm: 40.0, largura_cm: 15.0, profundidade_cm: 15.0, peso_kg: 0.9 },
    especificacoes: { potencia_w: 7, temperatura_cor: "Ajustável", alimentacao: "USB" },
    categorias: ["Casa", "Decoração", "Iluminação"],
    imagens: ["luminaria-led.jpg"],
    avaliacao: { media: 4.1, total: 33 }
  },
  {
    vendedor_id: idModa,
    nome: "Tênis Casual Masculino",
    descricao: "Tênis confortável para uso diário, solado emborrachado.",
    preco: 219.90,
    estoque: 80,
    disponivel: true,
    data_criacao: new Date("2026-08-05T15:45:00Z"),
    dimensoes: { altura_cm: 12.0, largura_cm: 30.0, profundidade_cm: 20.0, peso_kg: 0.7 },
    especificacoes: { material: "Sintético", cor: "Branco", numeracao: "39-43" },
    categorias: ["Moda", "Calçados"],
    imagens: ["tenis-casual.jpg"],
    avaliacao: { media: 4.4, total: 72 }
  },
  {
    vendedor_id: idModa,
    nome: "Mochila Antifurto",
    descricao: "Mochila com compartimento para notebook e porta USB.",
    preco: 189.90,
    estoque: 0,
    disponivel: false,
    data_criacao: new Date("2026-07-30T08:20:00Z"),
    dimensoes: { altura_cm: 45.0, largura_cm: 30.0, profundidade_cm: 15.0, peso_kg: 0.8 },
    especificacoes: { material: "Poliéster", cor: "Cinza", capacidade_litros: 20 },
    categorias: ["Moda", "Acessórios", "Informática"],
    imagens: ["mochila-antifurto.jpg"],
    avaliacao: { media: 4.0, total: 41 }
  },
  {
    vendedor_id: idEsporte,
    nome: "Kit Halteres Ajustáveis 20kg",
    descricao: "Par de halteres com anilhas removíveis para treino em casa.",
    preco: 399.90,
    estoque: 22,
    disponivel: true,
    data_criacao: new Date("2026-08-18T17:10:00Z"),
    dimensoes: { altura_cm: 20.0, largura_cm: 40.0, profundidade_cm: 20.0, peso_kg: 20.0 },
    especificacoes: { material: "Ferro fundido", peso_total_kg: 20, ajustavel: true },
    categorias: ["Esportes", "Fitness"],
    imagens: ["halteres-20kg.jpg"],
    avaliacao: { media: 4.8, total: 89 }
  }
]);

const idNotebook = resProdutos.insertedIds[0];
const idSmartphone = resProdutos.insertedIds[1];
const idFone = resProdutos.insertedIds[2];
const idCadeira = resProdutos.insertedIds[3];
const idTenis = resProdutos.insertedIds[5];
const idHalteres = resProdutos.insertedIds[7];

// ── 3. COLEÇÃO: clientes ──────────────────────────────────────────────────────
db.createCollection("clientes");
db.clientes.createIndex({ "email": 1 }, { unique: true });
db.clientes.createIndex({ "telefone": 1 });

const resClientes = db.clientes.insertMany([
  {
    nome: "Ana Silva",
    email: "ana.silva@email.com",
    telefone: "42999001001",
    enderecos: [
      { rua: "Rua Guaíra", numero: 200, cidade: "Guarapuava", cep: "85015-000", principal: true },
      { rua: "Rua Ponta Grossa", numero: 50, cidade: "Guarapuava", cep: "85015-100", principal: false }
    ],
    favoritos: [idNotebook, idFone]
  },
  {
    nome: "Bruno Costa",
    email: "bruno.costa@email.com",
    telefone: "42999002002",
    enderecos: [
      { rua: "Av. Manoel Ribas", numero: 1500, cidade: "Guarapuava", cep: "85010-500", principal: true }
    ],
    favoritos: [idSmartphone]
  },
  {
    nome: "Carla Mendes",
    email: "carla.mendes@email.com",
    telefone: "42999003003",
    enderecos: [
      { rua: "Rua Saldanha Marinho", numero: 800, cidade: "Guarapuava", cep: "85010-300", principal: true }
    ],
    favoritos: [idCadeira, idHalteres]
  },
  {
    nome: "Diego Ramos",
    email: "diego.ramos@email.com",
    telefone: "42999004004",
    enderecos: [
      { rua: "Rua Marechal Floriano", numero: 90, cidade: "Guarapuava", cep: "85010-600", principal: true }
    ],
    favoritos: [idTenis]
  }
]);

const idAna = resClientes.insertedIds[0];
const idBruno = resClientes.insertedIds[1];
const idCarla = resClientes.insertedIds[2];

// ── 4. COLEÇÃO: pedidos ───────────────────────────────────────────────────────
db.createCollection("pedidos");
db.pedidos.createIndex({ "cliente_id": 1 });
db.pedidos.createIndex({ "status": 1 });
db.pedidos.createIndex({ "data": -1 });

db.pedidos.insertMany([
  {
    cliente_id: idAna,
    itens: [
      { produto_id: idNotebook, nome: "Notebook Lenovo IdeaPad 3", quantidade: 1, preco_unitario: 3499.90 },
      { produto_id: idFone, nome: "Fone de Ouvido Bluetooth JBL Tune 520", quantidade: 1, preco_unitario: 249.90 }
    ],
    valor_total: 3749.80,
    status: "entregue",
    data: new Date("2026-08-20T19:30:00Z"),
    entrega: { endereco: "Rua Guaíra, 200 - Guarapuava", previsao: "3 dias úteis", transportadora: "Correios" }
  },
  {
    cliente_id: idAna,
    itens: [
      { produto_id: idFone, nome: "Fone de Ouvido Bluetooth JBL Tune 520", quantidade: 2, preco_unitario: 249.90 }
    ],
    valor_total: 499.80,
    status: "enviado",
    data: new Date("2026-09-05T10:15:00Z"),
    entrega: { endereco: "Rua Guaíra, 200 - Guarapuava", previsao: "5 dias úteis", transportadora: "Jadlog" }
  },
  {
    cliente_id: idBruno,
    itens: [
      { produto_id: idSmartphone, nome: "Smartphone Samsung Galaxy A54", quantidade: 1, preco_unitario: 1899.00 }
    ],
    valor_total: 1899.00,
    status: "pago",
    data: new Date("2026-09-08T14:00:00Z"),
    entrega: { endereco: "Av. Manoel Ribas, 1500 - Guarapuava", previsao: "4 dias úteis", transportadora: "Correios" }
  },
  {
    cliente_id: idCarla,
    itens: [
      { produto_id: idCadeira, nome: "Cadeira de Escritório Ergonômica", quantidade: 1, preco_unitario: 899.90 },
      { produto_id: idHalteres, nome: "Kit Halteres Ajustáveis 20kg", quantidade: 1, preco_unitario: 399.90 }
    ],
    valor_total: 1299.80,
    status: "pendente",
    data: new Date("2026-09-09T09:45:00Z"),
    entrega: { endereco: "Rua Saldanha Marinho, 800 - Guarapuava", previsao: "7 dias úteis", transportadora: "Jadlog" }
  }
]);

// ── 5. COLEÇÃO: carrinhos ─────────────────────────────────────────────────────
db.createCollection("carrinhos");
db.carrinhos.createIndex({ "cliente_id": 1 }, { unique: true });

db.carrinhos.insertMany([
  {
    cliente_id: idAna,
    itens: [
      { produto_id: idSmartphone, nome: "Smartphone Samsung Galaxy A54", quantidade: 1, preco_unitario: 1899.00 }
    ],
    atualizado_em: new Date("2026-09-10T08:00:00Z")
  },
  {
    cliente_id: idBruno,
    itens: [
      { produto_id: idNotebook, nome: "Notebook Lenovo IdeaPad 3", quantidade: 1, preco_unitario: 3499.90 },
      { produto_id: idFone, nome: "Fone de Ouvido Bluetooth JBL Tune 520", quantidade: 2, preco_unitario: 249.90 }
    ],
    atualizado_em: new Date("2026-09-10T09:30:00Z")
  },
  {
    cliente_id: idCarla,
    itens: [
      { produto_id: idTenis, nome: "Tênis Casual Masculino", quantidade: 1, preco_unitario: 219.90 }
    ],
    atualizado_em: new Date("2026-09-10T07:20:00Z")
  }
]);

// ── 6. COLEÇÃO: avaliacoes ────────────────────────────────────────────────────
// Avaliações individuais (dados completos). O resumo fica embutido em
// produtos.avaliacao (Subset Pattern): media/total exibidos na vitrine,
// enquanto o histórico detalhado vive nesta coleção separada.
db.createCollection("avaliacoes");
db.avaliacoes.createIndex({ "produto_id": 1 });
db.avaliacoes.createIndex({ "cliente_id": 1 });
db.avaliacoes.createIndex({ "nota": 1 });

db.avaliacoes.insertMany([
  {
    produto_id: idNotebook,
    cliente_id: idAna,
    nota: 5,
    comentario: "Excelente custo-benefício, chegou rápido e bem embalado.",
    data: new Date("2026-08-25T12:00:00Z")
  },
  {
    produto_id: idNotebook,
    cliente_id: idBruno,
    nota: 4,
    comentario: "Ótimo notebook, mas a bateria poderia durar mais.",
    data: new Date("2026-08-28T18:30:00Z")
  },
  {
    produto_id: idFone,
    cliente_id: idAna,
    nota: 4,
    comentario: "Som muito bom para o preço, confortável.",
    data: new Date("2026-09-01T09:15:00Z")
  },
  {
    produto_id: idSmartphone,
    cliente_id: idBruno,
    nota: 5,
    comentario: "Tela linda e desempenho ótimo no dia a dia.",
    data: new Date("2026-09-03T20:45:00Z")
  },
  {
    produto_id: idHalteres,
    cliente_id: idCarla,
    nota: 5,
    comentario: "Perfeito para treinar em casa, muito resistente.",
    data: new Date("2026-09-06T07:50:00Z")
  }
]);

print("=== [MongoDB] PopsMarket inicializado com sucesso! ===");