DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

CREATE TABLE company
(
    id serial PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cnpj       varchar(50)         NOT NULL UNIQUE,
    name       varchar(50) NOT NULL,
    email      varchar(50) NOT NULL UNIQUE,
    type           int         DEFAULT 0,
    password   varchar(256)   NOT NULL
);

CREATE TYPE sexo AS enum ('Masculino', 'Feminino', 'Não-binário', 'Outro');

CREATE TABLE employee
(
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    name           VARCHAR(50) NOT NULL,
    id_company     int         NOT NULL,
    social_name    varchar(50),
    email          varchar(50) NOT NULL UNIQUE,
    office          varchar(50) NOT NULL,
    birth_date     date        NOT NULL,
    gender           sexo        NOT NULL,
    type            int         DEFAULT 1,
    password          varchar(256)   NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_company) REFERENCES company (id) ON DELETE CASCADE
);

CREATE TABLE squad
(
    id                 int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_manager_employee   int,
    id_company          int NOT NULL,
    name                     varchar(50),
    PRIMARY KEY (id),
    FOREIGN KEY (id_manager_employee) REFERENCES employee (id) ON DELETE SET NULL,
    FOREIGN KEY (id_company) REFERENCES company (id) ON DELETE CASCADE
);

ALTER  TABLE employee
add id_squad int,
ADD FOREIGN KEY (id_squad) REFERENCES squad(id) ON DELETE SET NULL;

CREATE TYPE priority AS ENUM ('Baixa', 'Média', 'Alta', 'Crítica');
CREATE TYPE status AS ENUM('feito', 'para fazer', 'em progresso');

CREATE TABLE project(
    id int GENERATED ALWAYS AS IDENTITY ,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_squad int,
    id_company int NOT NULL,
    name varchar(50) NOT NULL ,
    status status,
    description TEXT,
    finished_at date,
    PRIMARY KEY (id),
    FOREIGN KEY (id_squad) REFERENCES squad(id) ON DELETE SET NULL,
    FOREIGN KEY (id_company) REFERENCES company(id) ON DELETE CASCADE
);

CREATE TABLE sprint(
    id int GENERATED ALWAYS AS IDENTITY ,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_squad int NOT NULL,
    id_company int NOT NULL,
    goal varchar(1000),
    finished_at date,
    PRIMARY KEY (id),
    FOREIGN KEY (id_squad) REFERENCES squad(id) ON DELETE CASCADE,
    FOREIGN KEY (id_company) REFERENCES company(id) ON DELETE CASCADE
);

ALTER  TABLE squad
add id_sprint int,
ADD FOREIGN KEY (id_sprint) REFERENCES sprint(id) ON DELETE SET NULL;

CREATE TABLE stage(
    id int GENERATED ALWAYS AS IDENTITY ,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    done boolean,
    creatable boolean,
    name varchar(50) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE task(
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_sprint int NOT NULL,
    id_project int NOT NULL,
    id_stage int NOT NULL,
    id_employee int,
    name varchar(50) NOT NULL,
    priority priority,
    description TEXT,
    points int,
    PRIMARY KEY (id),
    FOREIGN KEY (id_sprint) REFERENCES sprint(id) ON DELETE CASCADE,
    FOREIGN KEY (id_project) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (id_employee) REFERENCES employee(id),
    FOREIGN KEY (id_stage) REFERENCES stage(id)
);

INSERT INTO stage (name, description, creatable) VALUES ('To-do', 'Tarefas para iniciar', TRUE);
INSERT INTO stage (name, description) VALUES ('Em andamento', 'Tarefas que estão sendo feitas');
INSERT INTO stage (name, description) VALUES ('Bloqueada', 'Tarefas que não podem ser feitas por algum motivo');
INSERT INTO stage (name, description) VALUES ('Validação', 'Tarefas que precisam ser validadas');
INSERT INTO stage (name, description) VALUES ('Deploy', 'Tarefas prontas para deploy');
INSERT INTO stage (name, description, done) VALUES ('Concluída', 'Tarefas que já foram concluídas', TRUE);

