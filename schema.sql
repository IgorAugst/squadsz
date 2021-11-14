DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

CREATE TABLE empresa
(
    id_empresa serial PRIMARY KEY,
    cnpj       int         NOT NULL,
    nome       varchar(50) NOT NULL,
    email      varchar(50) NOT NULL,
    senha      char(256)   NOT NULL
);

CREATE TYPE sexo AS enum ('masculino', 'feminino', 'nb', 'outro');

CREATE TABLE funcionario
(
    id_funcionario int GENERATED ALWAYS AS IDENTITY,
    nome           VARCHAR(50) NOT NULL,
    id_empresa     int         NOT NULL UNIQUE,
    nome_social    varchar(50),
    email          varchar(50) NOT NULL,
    cargo          varchar(50),
    nascimento     date        NOT NULL,
    sexo           sexo        NOT NULL,
    senha          char(256)   NOT NULL,
    PRIMARY KEY (id_funcionario),
    FOREIGN KEY (id_empresa) REFERENCES empresa (id_empresa)
);

CREATE TABLE squad
(
    id_squad                 int GENERATED ALWAYS AS IDENTITY,
    id_funcionario_gerente   int,
    nome                     varchar(50),
    PRIMARY KEY (id_squad),
    FOREIGN KEY (id_funcionario_gerente) REFERENCES funcionario (id_funcionario)
);

ALTER TABLE empresa
    ADD id_squad int,
    ADD FOREIGN KEY (id_squad) REFERENCES squad(id_squad);

ALTER  TABLE funcionario
add id_squad int,
ADD FOREIGN KEY (id_squad) REFERENCES squad(id_squad);

CREATE TYPE status AS ENUM('feito', 'para fazer', 'em progresso');

CREATE TABLE projeto(
    id_projeto int GENERATED ALWAYS AS IDENTITY ,
    id_squad int,
    nome varchar(50) NOT NULL ,
    status status,
    descricao TEXT,
    data_final date,
    data_inicio date NOT NULL,
    PRIMARY KEY (id_projeto),
    FOREIGN KEY (id_squad) REFERENCES squad(id_squad)
);

CREATE TABLE sprint(
    id_sprint int GENERATED ALWAYS AS IDENTITY ,
    id_squad int,
    objetivo varchar(1000),
    data_inicial date NOT NULL ,
    data_final date,
    PRIMARY KEY (id_sprint),
    FOREIGN KEY (id_squad) REFERENCES squad(id_squad)
);

CREATE TABLE atividade(
    id_atividade int GENERATED ALWAYS AS IDENTITY,
    id_sprint int,
    id_projeto int,
    id_funcionario int,
    nome varchar(50) NOT NULL ,
    descricao TEXT,
    data_criacao date NOT NULL ,
    pontos int,
    prioridade int DEFAULT 0,
    status status,
    PRIMARY KEY (id_atividade),
    FOREIGN KEY (id_sprint) REFERENCES sprint(id_sprint),
    FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario)
);

CREATE TABLE observacao(
    id_observacao int GENERATED ALWAYS AS IDENTITY ,
    id_atividade int,
    id_funcionario int,
    anexo varchar(256),
    comentario TEXT,
    PRIMARY KEY (id_observacao),
    FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade),
    FOREIGN KEY (id_funcionario) REFERENCES funcionario(id_funcionario)
);
