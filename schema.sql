DROP SCHEMA public CASCADE;

CREATE SCHEMA public;

CREATE TABLE company
(
    id serial PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    cnpj       varchar(50)         NOT NULL UNIQUE,
    name       varchar(50) NOT NULL,
    email      varchar(50) NOT NULL UNIQUE,
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
    password          varchar(256)   NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id_company) REFERENCES company (id)
);

CREATE TABLE squad
(
    id                 int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_manager_employee   int,
    id_company          int NOT NULL,
    name                     varchar(50),
    PRIMARY KEY (id),
    FOREIGN KEY (id_manager_employee) REFERENCES employee (id),
    FOREIGN KEY (id_company) REFERENCES company (id)
);

ALTER  TABLE employee
add id_squad int,
ADD FOREIGN KEY (id_squad) REFERENCES squad(id);

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
    FOREIGN KEY (id_squad) REFERENCES squad(id),
    FOREIGN KEY (id_company) REFERENCES company(id)
);

CREATE TABLE sprint(
    id int GENERATED ALWAYS AS IDENTITY ,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_squad int,
    goal varchar(1000),
    finished_at date,
    PRIMARY KEY (id),
    FOREIGN KEY (id_squad) REFERENCES squad(id)
);

CREATE TABLE task(
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_sprint int,
    id_project int,
    id_employee int,
    name varchar(50) NOT NULL ,
    description TEXT,
    points int,
    status status,
    PRIMARY KEY (id),
    FOREIGN KEY (id_sprint) REFERENCES sprint(id),
    FOREIGN KEY (id_project) REFERENCES project(id),
    FOREIGN KEY (id_employee) REFERENCES employee(id)
);

CREATE TABLE note(
    id int GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    id_task int,
    id_employee int,
    attachment varchar(256),
    comment TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (id_task) REFERENCES task(id),
    FOREIGN KEY (id_employee) REFERENCES employee(id)
);
