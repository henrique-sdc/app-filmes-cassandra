const cassandra = require("cassandra-driver");

const client = new cassandra.Client({
  contactPoints: ["<IP_DO_SEU_CONTAINER>"], // <-- COLOQUE O IP DO SEU CONTAINER GERADO NO PLAYGROUND AQUI!
  localDataCenter: "datacenter1",
  keyspace: "avaliacao_filmes",
});

module.exports = client;
