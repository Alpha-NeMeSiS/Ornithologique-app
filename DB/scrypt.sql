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
/* =========================
   1) TAXONOMIE
   ========================= */

INSERT INTO TAXONOMIE (ordre, famille, genre) VALUES
('Passeriformes', 'Turdidae', 'Turdus'),
('Passeriformes', 'Passeridae', 'Passer'),
('Passeriformes', 'Muscicapidae', 'Erithacus'),
('Passeriformes', 'Paridae', 'Cyanistes');


/* =========================
   2) AUTEUR
   ========================= */

INSERT INTO AUTEUR (nom_auteur, prenom_auteur) VALUES
('Sharp', 'Charles J.'),
('Friel', 'David'),
('Viatour', 'Luc');


/* =========================
   3) PAYS
   ========================= */

INSERT INTO PAYS (nom_pays, code_iso) VALUES
('Royaume-Uni', 'GBR'),
('France', 'FRA'),
('Espagne', 'ESP'),
('Allemagne', 'DEU');


/* =========================
   4) ESPECE
   ========================= */

INSERT INTO ESPECE (
    nom_commun,
    nom_scientifique,
    description,
    taille_cm,
    poids_min_g,
    poids_max_g,
    longevite_ans,
    nombre_individus,
    id_taxonomie
)
VALUES
(
    'Merle noir',
    'Turdus merula',
    'Passereau commun des jardins, parcs, haies et boisements. Le mâle est noir avec un bec jaune-orangé.',
    24.5,
    80,
    100,
    3,
    NULL,
    (SELECT id_taxonomie FROM TAXONOMIE
     WHERE ordre = 'Passeriformes' AND famille = 'Turdidae' AND genre = 'Turdus')
),
(
    'Moineau domestique',
    'Passer domesticus',
    'Petit passereau trapu très lié aux zones urbaines, aux bâtiments et aux espaces agricoles proches de l''homme.',
    14.5,
    24,
    38,
    3,
    NULL,
    (SELECT id_taxonomie FROM TAXONOMIE
     WHERE ordre = 'Passeriformes' AND famille = 'Passeridae' AND genre = 'Passer')
),
(
    'Rouge-gorge familier',
    'Erithacus rubecula',
    'Petit passereau à poitrine rouge, fréquent dans les jardins, parcs et bois ombragés.',
    14.0,
    14,
    21,
    2,
    NULL,
    (SELECT id_taxonomie FROM TAXONOMIE
     WHERE ordre = 'Passeriformes' AND famille = 'Muscicapidae' AND genre = 'Erithacus')
),
(
    'Mésange bleue',
    'Cyanistes caeruleus',
    'Petit passereau coloré bleu, jaune, blanc et vert, commun dans les jardins, parcs et bois.',
    12.0,
    11,
    11,
    3,
    NULL,
    (SELECT id_taxonomie FROM TAXONOMIE
     WHERE ordre = 'Passeriformes' AND famille = 'Paridae' AND genre = 'Cyanistes')
);


/* =========================
   5) IMAGE
   chemin_image = URL de page Commons
   (tu peux remplacer plus tard
   par un chemin local /uploads/...)
   ========================= */

INSERT INTO IMAGE (
    chemin_image,
    date_ajout,
    description_image,
    id_espece,
    id_auteur
)
VALUES
(
    'https://luberon.fr/img/article/merle-noir.jpg',
    DATE '2014-03-29',
    'Photo d''un merle noir adulte mâle.',
    (SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Turdus merula'),
    (SELECT id_auteur FROM AUTEUR WHERE nom_auteur = 'Sharp' AND prenom_auteur = 'Charles J.')
),
(
    'https://www.mnhn.fr/system/files/2023-01/moineau_domestique_passer_domesticus_c_f_croset_lpo.jpg',
    DATE '2008-05-09',
    'Photo d''un moineau domestique mâle.',
    (SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Passer domesticus'),
    (SELECT id_auteur FROM AUTEUR WHERE nom_auteur = 'Friel' AND prenom_auteur = 'David')
),
(
    'https://www.lpo.fr/var/site/storage/images/_aliases/detailed_content/3/2/8/8/48823-78-fre-FR/Rougegorge%20familier%20Erythacus%20rubecula%20JJ_Carlier%200494-720_410pix.jpg',
    DATE '2008-04-15',
    'Photo d''un rouge-gorge familier.',
    (SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Erithacus rubecula'),
    (SELECT id_auteur FROM AUTEUR WHERE nom_auteur = 'Friel' AND prenom_auteur = 'David')
),
(
    'https://www.lpo-idf.fr/site/_img/especemois/MesangeBleue_2_Luc_Viatour.jpg',
    DATE '2008-10-04',
    'Photo d''une mésange bleue.',
    (SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Cyanistes caeruleus'),
    (SELECT id_auteur FROM AUTEUR WHERE nom_auteur = 'Viatour' AND prenom_auteur = 'Luc')
);


/* =========================
   6) ESPECE_PAYS
   Jeu de données seed :
   pays d''Europe occidentale cohérents
   avec la répartition générale des espèces
   ========================= */

INSERT INTO ESPECE_PAYS (id_espece, id_pays)
VALUES
-- Merle noir
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Turdus merula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Royaume-Uni')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Turdus merula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'France')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Turdus merula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Espagne')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Turdus merula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Allemagne')),

-- Moineau domestique
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Passer domesticus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Royaume-Uni')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Passer domesticus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'France')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Passer domesticus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Espagne')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Passer domesticus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Allemagne')),

-- Rouge-gorge familier
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Erithacus rubecula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Royaume-Uni')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Erithacus rubecula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'France')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Erithacus rubecula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Espagne')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Erithacus rubecula'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Allemagne')),

-- Mésange bleue
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Cyanistes caeruleus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Royaume-Uni')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Cyanistes caeruleus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'France')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Cyanistes caeruleus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Espagne')),
((SELECT id_espece FROM ESPECE WHERE nom_scientifique = 'Cyanistes caeruleus'),
 (SELECT id_pays FROM PAYS WHERE nom_pays = 'Allemagne'));