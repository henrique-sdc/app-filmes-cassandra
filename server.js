const express = require("express");
const client = require("./cassandra");
const { types } = require("cassandra-driver");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/filmes", async (req, res) => {
  try {
    const query = "SELECT id, nome FROM filmes";
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    res.status(500).json({ erro: "Falha ao buscar filmes." });
  }
});

app.post("/filmes", async (req, res) => {
  try {
    const { nome } = req.body;
    if (!nome) {
      return res.status(400).json({ erro: "O nome do filme é obrigatório." });
    }
    const id = types.Uuid.random();
    const query = "INSERT INTO filmes (id, nome) VALUES (?, ?)";
    const params = [id, nome];
    await client.execute(query, params, { prepare: true });
    res
      .status(201)
      .json({ mensagem: "Filme cadastrado com sucesso!", id, nome });
  } catch (err) {
    console.error("Erro ao cadastrar filme:", err);
    res.status(500).json({ erro: "Falha ao cadastrar filme." });
  }
});

app.post("/avaliar", async (req, res) => {
  try {
    const { id_filme, nota } = req.body;
    if (!id_filme || nota === undefined) {
      return res
        .status(400)
        .json({ erro: "ID do filme e nota são obrigatórios." });
    }
    const data_avaliacao = new Date();
    const id_avaliacao = types.Uuid.random();
    const query =
      "INSERT INTO avaliacoes (id_filme, data_avaliacao, nota, id_avaliacao) VALUES (?, ?, ?, ?)";
    const params = [id_filme, data_avaliacao, nota, id_avaliacao];
    await client.execute(query, params, { prepare: true });
    res.json({ mensagem: "Avaliação registrada com sucesso!" });
  } catch (err) {
    console.error("Erro ao registrar avaliação:", err);
    res.status(500).json({ erro: "Falha ao registrar avaliação." });
  }
});

app.get("/avaliacoes", async (req, res) => {
  try {
    const queryAvaliacoes =
      "SELECT id_filme, data_avaliacao, nota FROM avaliacoes";
    const resultAvaliacoes = await client.execute(queryAvaliacoes);

    const filmesMap = new Map();
    const queryFilmes = "SELECT id, nome FROM filmes";
    const resultFilmes = await client.execute(queryFilmes);
    resultFilmes.rows.forEach((filme) => {
      filmesMap.set(filme.id.toString(), filme.nome);
    });

    const avaliacoesComNome = resultAvaliacoes.rows.map((avaliacao) => ({
      ...avaliacao,
      nome_filme:
        filmesMap.get(avaliacao.id_filme.toString()) || "Filme não encontrado",
    }));

    res.json(avaliacoesComNome);
  } catch (err) {
    console.error("Erro ao buscar avaliações:", err);
    res.status(500).json({ erro: "Falha ao buscar avaliações." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
