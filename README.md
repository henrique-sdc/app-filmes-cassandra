# 🎬 Plataforma de Avaliação de Filmes com Cassandra

![Node.js](https://img.shields.io/badge/Node.js-18.x-blue.svg?logo=node.js)![Express.js](https://img.shields.io/badge/Express.js-4.x-green.svg?logo=express)![Cassandra](https://img.shields.io/badge/Cassandra-Apache-blue.svg?logo=apachecassandra)![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg?logo=javascript)

## 📌 Visão Geral

Este projeto é uma atividade da matéria de **NoSQL** que implementa uma aplicação web para avaliação de filmes. O backend foi desenvolvido com **Node.js** e **Express.js**, utilizando **Apache Cassandra** como banco de dados.

A modelagem dos dados foi projetada seguindo os princípios do Cassandra, com foco em padrões de consulta. Foram criadas tabelas otimizadas com chaves de partição e de cluster para garantir a performance nas operações de listagem de filmes e busca de avaliações.

## ✨ Funcionalidades

-   **Frontend Simples:** Interface para cadastrar novos filmes, listar os existentes e registrar avaliações.
-   **API RESTful:** Endpoints para todas as operações de CRUD (Criar, Ler, Atualizar, Deletar).
-   **Persistência com Cassandra:** Utiliza um `keyspace` e tabelas modeladas para performance, armazenando filmes e suas respectivas avaliações.
-   **Estrutura Organizada:** O código separa a lógica de conexão com o banco da lógica do servidor, seguindo boas práticas.

## 🛠️ Tecnologias Utilizadas

-   **Backend:**
    -   [Node.js](https://nodejs.org/) (Runtime JavaScript)
    -   [Express.js](https://expressjs.com/) (Framework para o servidor web)
-   **Banco de Dados:**
    -   [Apache Cassandra](https://cassandra.apache.org/) (Banco de dados NoSQL colunar)
-   **Frontend:**
    -   HTML5, CSS3, JavaScript (Vanilla)
-   **Driver Cassandra:**
    -   `cassandra-driver`: Cliente oficial para a comunicação entre Node.js e Cassandra.

## 📋 Pré-requisitos

-   **[Node.js](https://nodejs.org/en/)** (versão 18 ou superior)
-   **[Git](https://git-scm.com/downloads/)**
-   Uma instância do **Cassandra** em execução. (Recomendado usar [Docker](https://www.docker.com/products/docker-desktop/) com `docker run -d --name cassandra cassandra:latest`).

## 📂 Estrutura do Projeto

```
app-filmes-cassandra/
│
├── public/
│   └── index.html          # Frontend da aplicação
├── cassandra.js            # Módulo de conexão com o Cassandra
├── server.js               # Lógica do backend e endpoints da API
├── .gitignore              # Ignora a pasta node_modules
├── package.json            # Metadados e dependências do projeto
└── README.md                 # Este arquivo
```

## ▶️ Como Executar (Localmente)

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/henrique-sdc/app-filmes-cassandra.git
    cd app-filmes-cassandra
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure e Prepare o Banco de Dados:**
    -   Inicie sua instância do Cassandra.
    -   Acesse o `cqlsh` e execute os comandos abaixo para criar o schema:
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

4.  **Configure a Conexão no Código:**
    -   Abra o arquivo `cassandra.js`.
    -   Altere o placeholder `<IP_DO_SEU_CONTAINER>` para o endereço IP da sua instância Cassandra (ex: `127.0.0.1` se estiver rodando localmente).

5.  **Inicie o servidor:**
    ```bash
    node server.js
    ```

6.  **Acesse a aplicação:**
    Abra seu navegador e acesse `http://localhost:3000`.

<br>

---

<br>

## 🌐 Execução Alternativa no Docker Playground

Este projeto também pode ser executado inteiramente no Docker Playground, seguindo os passos abaixo.

**1. Prepare o Ambiente:**
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
-   Acesse o `cqlsh` do container:
    ```bash
    docker exec -it cassandra cqlsh
    ```
-   Execute os comandos SQL da **Etapa 3** da seção "Como Executar (Localmente)" para criar o `keyspace` e as tabelas. Após terminar, saia com `exit;`.

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
-   Altere o placeholder `<IP_DO_SEU_CONTAINER>` para o IP que você anotou no primeiro passo.
-   Salve o arquivo.

**5. Execute e Acesse:**
-   No terminal, na pasta do projeto, inicie o servidor: `node server.js`.
-   Clique em **[OPEN PORT]**, digite `3000` e confirme.
-   Clique no novo botão azul **3000** que aparecerá para abrir a aplicação! 🎉
