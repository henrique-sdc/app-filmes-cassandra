# 🎬 Plataforma de Avaliação de Filmes com Cassandra

![Node.js](https://img.shields.io/badge/Node.js-18.x-blue.svg?logo=node.js)![Express.js](https://img.shields.io/badge/Express.js-5.x-green.svg?logo=express)![Cassandra](https://img.shields.io/badge/Cassandra-Apache-blue.svg?logo=apachecassandra)![Docker](https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white)

## 📌 Visão Geral

Este projeto é uma atividade da matéria de **NoSQL** que implementa uma aplicação web para avaliação de filmes. O backend foi desenvolvido com **Node.js** e **Express.js**, utilizando **Apache Cassandra** como banco de dados.

A modelagem dos dados foi projetada seguindo os princípios do Cassandra, com foco em padrões de consulta. Foram criadas tabelas otimizadas com chaves de partição e de cluster para garantir a performance nas operações de listagem de filmes e busca de avaliações. A aplicação é totalmente containerizada com Docker para facilitar a execução e garantir a consistência do ambiente.

## 🛠️ Tecnologias Utilizadas

-   **Backend:** Node.js, Express.js
-   **Banco de Dados:** Apache Cassandra
-   **Containerização:** Docker
-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
-   **Driver:** `cassandra-driver`

## 📋 Pré-requisitos

-   **[Node.js](https://nodejs.org/en/)** (versão 18 ou superior) - *Opcional se usar Docker*
-   **[Git](https://git-scm.com/downloads/)**
-   **[Docker Desktop](https://www.docker.com/products/docker-desktop/)** - **Essencial para o método de execução principal.**

## 📂 Estrutura do Projeto

```
app-filmes-cassandra/
│
├── public/
│   └── index.html          # Frontend da aplicação
├── cassandra.js            # Módulo de conexão com o Cassandra
├── server.js               # Lógica do backend e endpoints da API
├── Dockerfile              # Instruções para construir a imagem da aplicação
├── .gitignore              # Ignora a pasta node_modules
├── package.json            # Metadados e dependências do projeto
└── README.md                 # Este arquivo
```

## ▶️ Como Executar com Docker (Método Recomendado)

Este método utiliza Docker para criar um ambiente completo e isolado na sua máquina local, garantindo que tudo funcione sem a necessidade de instalar Node.js ou Cassandra diretamente.

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/henrique-sdc/app-filmes-cassandra.git
    cd app-filmes-cassandra
    ```

2.  **Construa e Inicie os Containers:**
    Execute os comandos abaixo na ordem. Eles criarão uma rede, iniciarão o banco de dados e, em seguida, construirão e iniciarão a aplicação.
    ```bash
    # 1. Cria a rede para comunicação entre os containers
    docker network create cassandra-net

    # 2. Inicia o container do Cassandra
    docker run -d --name cassandra --hostname cassandra --network cassandra-net cassandra:latest

    # 3. Constrói a imagem da aplicação Node.js a partir do Dockerfile
    docker build -t app-filmes-cassandra .

    # 4. Inicia o container da aplicação, conectando-o à mesma rede
    docker run -d -p 3000:3000 --name app-filmes --network cassandra-net app-filmes-cassandra
    ```

3.  **Prepare o Banco de Dados (Schema CQL):**
    O container do Cassandra pode levar um minuto para inicializar. **Aguarde um pouco** antes de executar o próximo passo.
    -   Para verificar se o Cassandra está pronto, execute `docker logs -f cassandra` e espere pela mensagem `Starting listening for CQL clients`.
    -   Quando estiver pronto, execute o comando abaixo para entrar no shell do Cassandra:
    ```bash
    docker exec -it cassandra cqlsh
    ```
    -   Dentro do `cqlsh`, cole o bloco de código abaixo para criar o `keyspace` e as tabelas:
    ```sql
    CREATE KEYSPACE IF NOT EXISTS avaliacao_filmes
    WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

    USE avaliacao_filmes;

    CREATE TABLE filmes (id UUID, nome TEXT, PRIMARY KEY (id));

    CREATE TABLE avaliacoes (
        id_filme UUID,
        data_avaliacao TIMESTAMP,
        nota INT,
        id_avaliacao UUID,
        PRIMARY KEY (id_filme, data_avaliacao)
    ) WITH CLUSTERING ORDER BY (data_avaliacao DESC);
    ```
    -   Saia do `cqlsh` com o comando `exit;`.

4.  **Acesse a Aplicação:**
    Pronto! Abra seu navegador e acesse `http://localhost:3000`.

<br>

---

<br>

## 🌐 Execução Alternativa no Docker Playground

Para um ambiente online e temporário, siga estes passos.

**1. Prepare o Ambiente no Playground:**
-   Acesse o [Docker Playground](https://labs.play-with-docker.com/) e crie **uma nova instância**.
-   No terminal, inicie o container do Cassandra:
    ```bash
    docker network create cassandra-net
    docker run -d --name cassandra --hostname cassandra --network cassandra-net cassandra:latest
    ```
-   **Anote o endereço de IP do container:**
    ```bash
    docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cassandra
    ```

**2. Configure o Banco de Dados:**
-   Aguarde um minuto para o Cassandra iniciar.
-   Acesse o `cqlsh` do container: `docker exec -it cassandra cqlsh`.
-   Execute os comandos SQL da **Etapa 3** da seção "Como Executar com Docker" para criar o schema. Saia com `exit;`.

**3. Configure a Aplicação:**
-   No terminal principal, instale as ferramentas, clone este repositório e instale as dependências:
    ```bash
    apk add nodejs npm git
    git clone https://github.com/henrique-sdc/app-filmes-cassandra.git
    cd app-filmes-cassandra
    npm install
    ```

**4. Conecte a Aplicação ao Cassandra:**
-   Use o editor do Docker Playground (botão **EDITOR**) para abrir o arquivo `cassandra.js`.
-   **Importante:** Altere a linha `contactPoints: ['cassandra']` para `contactPoints: ['<IP_QUE_VOCE_ANOTOU>']`.
-   Salve o arquivo.

**5. Execute e Acesse:**
-   No terminal, inicie o servidor: `node server.js`.
-   Clique em **[OPEN PORT]**, digite `3000` e confirme.
-   Clique no novo botão azul **3000** para abrir a aplicação! 🎉
