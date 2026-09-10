# UTFPR — Universidade Tecnológica Federal do Paraná

## Atividade Integrada — Módulos 02 e 03

### Ambiente, Matriz Poliglota e Modelagem de Documentos

**Disciplina:** Banco de Dados NoSQL (TSI34E-TSI4)
**Professor:** Prof. Marcelo Vichar
**Tema do Projeto:** PopsMarket

**Integrantes do grupo:**

* Matheus Popolin
* Sara Pereira de Almeida


---

# 1. Identificação dos integrantes e tema do projeto

O **PopsMarket** é um sistema de Marketplace que permite que diferentes vendedores cadastrem e gerenciem seus produtos, enquanto clientes podem pesquisar produtos, consultar suas informações, adicionar itens ao carrinho e realizar compras.

Os principais usuários do sistema são os **clientes**, que utilizam a plataforma para pesquisar e comprar produtos, e os **vendedores**, responsáveis pelo cadastro, atualização e gerenciamento dos produtos disponíveis para venda.

O sistema utilizará diferentes modelos de persistência, escolhidos de acordo com os padrões de acesso e os requisitos de cada domínio.

---

# 2. Confirmação de teste do ambiente local

```j́son
{"timestamp":"2026-09-10T00:31:05.339Z","status_geral":"OK","bancos":{"mongodb":{"status":"ONLINE","database":"gastrohub"},"redis":{"status":"ONLINE","resposta":"PONG"},"elasticsearch":{"status":"ONLINE","cluster_status":"green"}}}
```
---

# 3. Descrição do sistema e Matriz de Persistência Poliglota

## 3.1 Descrição do sistema

O **PopsMarket** terá como objetivo centralizar a oferta e comercialização de produtos de diferentes vendedores. Os clientes poderão consultar produtos, realizar buscas, adicionar itens ao carrinho e efetuar pedidos.

A arquitetura utilizará **persistência poliglota**, empregando diferentes modelos de dados de acordo com o tipo de informação e seu padrão de acesso. A atividade exige a utilização de pelo menos três modelos distintos.

## 3.2 Matriz de Persistência Poliglota

| Domínio / Entidade      | Volume & Frequência de Acesso                        | Requisito Principal                 | Família / Modelo | Tecnologia Indicada | Justificativa Arquitetural                                                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------- | ----------------------------------- | ---------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Produtos**            | Alto volume de leitura e consultas frequentes        | Esquema flexível e leitura agregada | Documentos       | **MongoDB**         | Produtos podem possuir diferentes atributos e características. O modelo de documentos permite armazenar essas informações de forma flexível e realizar a leitura agregada sem depender de múltiplos JOINs. |
| **Carrinho de compras** | Alto volume de leitura e escrita durante a navegação | Baixa latência                      | Chave-Valor      | **Redis**           | O carrinho precisa ser recuperado e atualizado rapidamente. O Redis será utilizado como armazenamento chave-valor para operações rápidas e poderá trabalhar com expiração por TTL.                         |
| **Busca de produtos**   | Alto volume de consultas                             | Busca textual e filtros             | Busca            | **Elasticsearch**   | A busca de produtos exige consultas textuais por nome, descrição e características. O Elasticsearch é adequado para esse padrão de acesso.                                                                 |
| **Pedidos**             | Volume moderado, com necessidade de histórico        | Persistência dos dados da compra    | Documentos       | **MongoDB**         | Um pedido pode ser representado como um documento contendo seus itens, valores e demais informações necessárias para reconstruir o histórico da compra.                                                    |

A escolha dos modelos segue o princípio de que diferentes bancos podem ser utilizados de acordo com os padrões de acesso e os requisitos específicos de cada domínio.

---

# 4. Fonte da Verdade e Estratégia de Sincronização

## 4.1 Fonte da Verdade

A **Fonte da Verdade** dos dados centrais do **PopsMarket** será o **MongoDB**.

Os produtos e pedidos serão persistidos no MongoDB como dados permanentes do sistema. O Redis e o Elasticsearch serão utilizados como mecanismos especializados para atender padrões específicos de acesso.

## 4.2 Estratégia de Sincronização

Para o **Redis**, será utilizada a estratégia **Cache-Aside com TTL**. Quando uma informação for solicitada, a aplicação poderá verificar inicialmente o cache. Caso os dados não estejam disponíveis, a aplicação consulta o MongoDB, retorna o resultado e grava os dados no Redis com um tempo de expiração.

Para o **Elasticsearch**, os dados necessários para pesquisa serão atualizados quando produtos forem inseridos ou alterados no MongoDB, mantendo o mecanismo de busca sincronizado com a fonte principal de dados.

Essa estratégia permite utilizar o MongoDB como fonte permanente, enquanto Redis e Elasticsearch atendem necessidades específicas de desempenho e busca.

A atividade apresenta **Cache-Aside com TTL** como uma das estratégias possíveis de sincronização entre os modelos.

---

# 5. Documento JSON da Entidade Central

A entidade central escolhida para a modelagem no MongoDB é o **Produto**.

O documento abaixo contém os tipos de dados exigidos pela atividade, incluindo strings, números inteiros e decimais, booleanos, data, subdocumentos embutidos, arrays e referência externa por ID.

```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "nome": "Notebook Lenovo IdeaPad 3",
  "descricao": "Notebook para estudos, trabalho e uso cotidiano.",
  "preco": 3499.90,
  "estoque": 25,
  "disponivel": true,
  "data_criacao": "2026-09-01T14:30:00Z",

  "vendedor_id": "64009f1a2b3c4d5e6f7a8b99",

  "dimensoes": {
    "altura_cm": 1.99,
    "largura_cm": 35.9,
    "profundidade_cm": 23.6,
    "peso_kg": 1.65
  },

  "especificacoes": {
    "processador": "Intel Core i5",
    "memoria_ram_gb": 16,
    "armazenamento_gb": 512,
    "tipo_armazenamento": "SSD"
  },

  "categorias": [
    "Informática",
    "Notebooks",
    "Eletrônicos"
  ],

  "imagens": [
    "notebook-frente.jpg",
    "notebook-lateral.jpg",
    "notebook-teclado.jpg"
  ],

  "avaliacao": {
    "media": 4.7,
    "total": 128
  }
}
```

## 5.1 Justificativa de Embedding

Foram embutidos no documento do produto os dados de **dimensões, especificações, avaliação, categorias e imagens**, pois são informações diretamente relacionadas ao produto e normalmente são utilizadas juntamente com ele nas telas da aplicação.

Essa escolha segue o princípio de que **dados acessados juntos devem ser armazenados juntos**, evitando consultas adicionais e permitindo uma leitura agregada do documento. Também são estruturas de tamanho previsível, reduzindo o risco de crescimento descontrolado do documento.

## 5.2 Justificativa de Referencing

O campo **`vendedor_id`** foi definido como uma referência externa porque o vendedor possui **ciclo de vida independente** do produto e pode estar associado a vários produtos.

Dessa forma, os dados completos do vendedor não precisam ser duplicados em cada produto. Quando informações do vendedor forem alteradas, não será necessário atualizar todos os documentos de produtos relacionados. Essa decisão segue a regra de utilizar referências para entidades independentes e dados compartilhados.

## 5.3 Consideração sobre avaliações — Subset Pattern

As avaliações completas não foram armazenadas como um array ilimitado dentro do documento do produto.

O campo:

```json
"avaliacao": {
  "media": 4.7,
  "total": 128
}
```

mantém apenas informações resumidas para a exibição rápida do produto.

As avaliações completas podem ser armazenadas em uma coleção separada, por exemplo:

```text
avaliacoes
```

Essa decisão segue o **Subset Pattern**, apresentado no módulo como uma estratégia para manter no documento principal somente uma parte dos dados mais utilizados, deixando os demais registros em uma coleção separada.

---

# 6. Link do repositório GitHub

O documento JSON da entidade central deverá ser versionado no repositório GitHub do projeto, conforme solicitado na atividade. O professor indica como possibilidade utilizar um arquivo como `docs/schema_principal.json` ou documentar o schema no `README.md`.

**Repositório GitHub do PopsMarket:**

https://github.com/matheuspopolinutfpr/pops-market

**Arquivo do schema:**

```text
docs/schema_principal.json
```