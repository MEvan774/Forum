-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pb2sef2425_boomootoocii31_live
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pb2sef2425_boomootoocii31_live
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pb2sef2425_boomootoocii31_live` DEFAULT CHARACTER SET utf8 ;
USE `pb2sef2425_boomootoocii31_live` ;

-- -----------------------------------------------------
-- Table `pb2sef2425_boomootoocii31_live`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2sef2425_boomootoocii31_live`.`user` (
  `idUser` INT(11) NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pb2sef2425_boomootoocii31_live`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2sef2425_boomootoocii31_live`.`question` (
  `idQuestion` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idUser` INT(11) NOT NULL,
  PRIMARY KEY (`idQuestion`),
  INDEX `idUser_idx` (`idUser` ASC) VISIBLE,
  CONSTRAINT `idUser`
    FOREIGN KEY (`idUser`)
    REFERENCES `pb2sef2425_boomootoocii31_live`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pb2sef2425_boomootoocii31_live`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2sef2425_boomootoocii31_live`.`answer` (
  `idAnswer` INT(11) NOT NULL AUTO_INCREMENT,
  `description` VARCHAR(300) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idQuestion` INT(11) NOT NULL,
  `idUser` INT(11) NOT NULL,
  PRIMARY KEY (`idAnswer`),
  INDEX `fk_question_id_idx` (`idQuestion` ASC) VISIBLE,
  INDEX `fk_user_id_idx` (`idUser` ASC) VISIBLE,
  CONSTRAINT `fk_question_id`
    FOREIGN KEY (`idQuestion`)
    REFERENCES `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_id`
    FOREIGN KEY (`idUser`)
    REFERENCES `pb2sef2425_boomootoocii31_live`.`user` (`idUser`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `pb2sef2425_boomootoocii31_live`.`user`
-- -----------------------------------------------------
START TRANSACTION;
USE `pb2sef2425_boomootoocii31_live`;
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `userName`, `email`, `password`, `created_at`, `updated_at`) VALUES (1, 'Koen', 'koenfuchs20@gmail.com', 'borbrdw', DEFAULT, NULL);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `userName`, `email`, `password`, `created_at`, `updated_at`) VALUES (2, 'Simon', 'asdd@gmail.com', '343fdff', DEFAULT, NULL);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `userName`, `email`, `password`, `created_at`, `updated_at`) VALUES (3, 'Sjoerd', 'ewrwf@ghmail.com', '23424sads', DEFAULT, NULL);

COMMIT;


-- -----------------------------------------------------
-- Data for table `pb2sef2425_boomootoocii31_live`.`question`
-- -----------------------------------------------------
START TRANSACTION;
USE `pb2sef2425_boomootoocii31_live`;
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `title`, `description`, `created_at`, `idUser`) VALUES (1, 'Hoe gebruik ik mysql', 'ik weet niet hoe dat moet', DEFAULT, 2);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `title`, `description`, `created_at`, `idUser`) VALUES (2, 'Wat is ESLint?', 'Ik weet niet wat eslint is', DEFAULT, 3);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `title`, `description`, `created_at`, `idUser`) VALUES (3, 'Waar donwload ik vscode?', 'Ik weet niet waar ik vscode donwload', DEFAULT, 2);

COMMIT;

-- -----------------------------------------------------
-- Data for table `pb2sef2425_boomootoocii31_live`.`answer`
-- -----------------------------------------------------
START TRANSACTION;
USE `pb2sef2425_boomootoocii31_live`;
INSERT INTO `pb2sef2425_boomootoocii31_live`.`answer` (`idAnswer`, `description`, `created_at`, `idQuestion`, `idUser`) VALUES (1, 'Oh das makkelijk, gewoon googelen', DEFAULT, 1, 1);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`answer` (`idAnswer`, `description`, `created_at`, `idQuestion`, `idUser`) VALUES (2, 'Dat weet ik ook niet hoor...', DEFAULT, 2, 3);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`answer` (`idAnswer`, `description`, `created_at`, `idQuestion`, `idUser`) VALUES (3, 'Moet je maar aan iemand anders vragen.', DEFAULT, 2, 2);

COMMIT;
