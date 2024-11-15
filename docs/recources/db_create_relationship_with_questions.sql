-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema pb2sef2425_boomootoocii31_live
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pb2sef2425_boomootoocii31_live
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pb2sef2425_boomootoocii31_live` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
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
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`idUser`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `pb2sef2425_boomootoocii31_live`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pb2sef2425_boomootoocii31_live`.`question` (
  `idQuestion` INT(11) NOT NULL AUTO_INCREMENT,
  `titel` VARCHAR(45) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `idUser` INT(11) NOT NULL,
  PRIMARY KEY (`idQuestion`),
  INDEX `idUser_idx` (`idUser` ASC) VISIBLE,
  CONSTRAINT `idUser`
    FOREIGN KEY (`idUser`)
    REFERENCES `pb2sef2425_boomootoocii31_live`.`user` (`idUser`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


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
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `titel`, `description`, `created_at`, `idUser`) VALUES (1, 'Hoe gebruik ik mysql', 'ik weet niet hoe dat moet', DEFAULT, 2);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `titel`, `description`, `created_at`, `idUser`) VALUES (2, 'Wat is ESLint?', 'Ik weet niet wat eslint is', DEFAULT, 3);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`question` (`idQuestion`, `titel`, `description`, `created_at`, `idUser`) VALUES (3, 'Waar donwload ik vscode?', 'Ik weet niet waar ik vscode donwload', DEFAULT, 2);

COMMIT;

