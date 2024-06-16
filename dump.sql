-- MariaDB dump 10.19  Distrib 10.5.21-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: languageapp
-- ------------------------------------------------------
-- Server version	10.5.21-MariaDB

CREATE TABLE IF NOT EXISTS User (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `username` VARCHAR NOT NULL,
  `nickname` VARCHAR,
  `password` VARCHAR NOT NULL,
  `email` VARCHAR,
  `created_at` TIMESTAMP NOT NULL,
  `last_login` TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS Verb (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `name` VARCHAR NOT NULL,
  `translation` VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS ConjugationPresentScore (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `score` INTEGER NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `solved_in` TIMESTAMP NOT NULL,
  `user_id` INTEGER NOT NULL,
  `verb_id` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES User (`id`),
  FOREIGN KEY (`verb_id`) REFERENCES Verb (`id`)
);

CREATE TABLE IF NOT EXISTS ConjugationPresent (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  `je` VARCHAR NOT NULL,
  `tu` VARCHAR NOT NULL,
  `ilelle` VARCHAR NOT NULL,
  `nous` VARCHAR NOT NULL,
  `vous` VARCHAR NOT NULL,
  `ilselles` VARCHAR NOT NULL,
  `example` VARCHAR NOT NULL,
  `verb_id` INTEGER NOT NULL,
  FOREIGN KEY (`verb_id`) REFERENCES Verb (`id`)
);

--
-- Dumping data for table `conjugation_present`
--

INSERT INTO `Verb` VALUES 
(1,'avoir','to have'), 
(2,'être','to be'), 
(3,'aller','to go'), 
(4,'faire','to do'), 
(5,'dire','to say'), 
(6,'voir','to see'), 
(7,'savoir','to know'), 
(8,'pouvoir','can'), 
(9,'vouloir','to want'), 
(10,'venir','to come'), 
(11, 'prendre','to take'),
(12, 'arriver','to arrive'), 
(13,'croire','to believe to guess'), 
(14,'mettre','to put'), 
(15,'passer','to pass'), 
(16,'devoir','must');

INSERT INTO `ConjugationPresent` VALUES 
(1,'ai','as','a','avons','avez','ont','Elle a un chien.',1),
(2,'suis','es','est','sommes','êtes','sont','Je suis sympa.',2),
(3,'vais','vas','va','allons','allez','vont','Nous allons au supermarché.',3),
(4,'fais','fais','fait','faisons','faites','font','Je fais du yoga.',4),
(5,'dis','dis','dit','disons','dites','disent','Je dis la vérité.',5),
(6,'vois','vois','voit','voyons','voyez','voient','Vous voyez les goélands.',6),
(7,'sais','sais','sait','savons','savez','savent','Je ne sais pas.',7),
(8,'peux','peux','peut','pouvons','pouvez','peuvent','Tu peux le faire.',8),
(9,'veux','veux','veut','voulons','voulez','veulent','Je veux de la glace.',9),
(10,'viens','viens','vient','venons','venez','viennent','Viens avec moi.',10),
(11,'prends','prends','prend','prenons','prenez','prennent','Tu prends un café.',11),
(12,'arrive','arrives','arrive','arrivons','arrivez','arrivent','J’arrive dans dix minutes.',12),
(13,'crois','crois','croit','croyons','croyez','croient','Je crois que c’est vrai.',13),
(14,'mets','mets','met','mettons','mettez','mettent','Tu mets des glaçons dans ton verre.',14),
(15,'passe','passes','passe','passons','passez','passent','Il passe devant la maison.',15),
(16,'dois','dois','doit','devons','devez','doivent','Je dois partir bientôt.',16);