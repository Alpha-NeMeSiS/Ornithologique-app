CREATE TABLE TAXONOMIE (
    id_taxonomie INTEGER GENERATED ALWAYS AS IDENTITY,
    ordre VARCHAR(100) NOT NULL,
    famille VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    CONSTRAINT pk_taxonomie PRIMARY KEY (id_taxonomie)
);

CREATE TABLE AUTEUR (
    id_auteur INTEGER GENERATED ALWAYS AS IDENTITY,
    nom_auteur VARCHAR(100) NOT NULL,
    prenom_auteur VARCHAR(100),
    CONSTRAINT pk_auteur PRIMARY KEY (id_auteur)
);

CREATE TABLE PAYS (
    id_pays INTEGER GENERATED ALWAYS AS IDENTITY,
    nom_pays VARCHAR(100) NOT NULL,
    code_iso VARCHAR(3),
    CONSTRAINT pk_pays PRIMARY KEY (id_pays),
    CONSTRAINT uq_pays_nom UNIQUE (nom_pays),
    CONSTRAINT uq_pays_code UNIQUE (code_iso)
);

CREATE TABLE ESPECE (
    id_espece INTEGER GENERATED ALWAYS AS IDENTITY,
    nom_commun VARCHAR(150) NOT NULL,
    nom_scientifique VARCHAR(150) NOT NULL,
    description VARCHAR(1000),
    taille_cm DECIMAL(5,2),
    poids_min_g INTEGER,
    poids_max_g INTEGER,
    longevite_ans INTEGER,
    nombre_individus INTEGER,
    id_taxonomie INTEGER NOT NULL,

    CONSTRAINT pk_espece PRIMARY KEY (id_espece),
    CONSTRAINT uq_espece_nom_scientifique UNIQUE (nom_scientifique),

    CONSTRAINT fk_espece_taxonomie
        FOREIGN KEY (id_taxonomie)
        REFERENCES TAXONOMIE(id_taxonomie),

    CONSTRAINT ck_espece_taille
        CHECK (taille_cm IS NULL OR taille_cm > 0),

    CONSTRAINT ck_espece_poids_min
        CHECK (poids_min_g IS NULL OR poids_min_g > 0),

    CONSTRAINT ck_espece_poids_max
        CHECK (poids_max_g IS NULL OR poids_max_g > 0),

    CONSTRAINT ck_espece_poids_coherence
        CHECK (
            poids_min_g IS NULL
            OR poids_max_g IS NULL
            OR poids_min_g <= poids_max_g
        ),

    CONSTRAINT ck_espece_longevite
        CHECK (longevite_ans IS NULL OR longevite_ans >= 0),

    CONSTRAINT ck_espece_population
        CHECK (nombre_individus IS NULL OR nombre_individus >= 0)
);

CREATE TABLE IMAGE (
    id_image INTEGER GENERATED ALWAYS AS IDENTITY,
    chemin_image VARCHAR(255) NOT NULL,
    date_ajout DATE DEFAULT CURRENT_DATE,
    description_image VARCHAR(255),
    id_espece INTEGER NOT NULL,
    id_auteur INTEGER NOT NULL,

    CONSTRAINT pk_image PRIMARY KEY (id_image),

    CONSTRAINT fk_image_espece
        FOREIGN KEY (id_espece)
        REFERENCES ESPECE(id_espece),

    CONSTRAINT fk_image_auteur
        FOREIGN KEY (id_auteur)
        REFERENCES AUTEUR(id_auteur)
);

CREATE TABLE ESPECE_PAYS (
    id_espece INTEGER NOT NULL,
    id_pays INTEGER NOT NULL,

    CONSTRAINT pk_espece_pays PRIMARY KEY (id_espece, id_pays),

    CONSTRAINT fk_espece_pays_espece
        FOREIGN KEY (id_espece)
        REFERENCES ESPECE(id_espece),

    CONSTRAINT fk_espece_pays_pays
        FOREIGN KEY (id_pays)
        REFERENCES PAYS(id_pays)
);