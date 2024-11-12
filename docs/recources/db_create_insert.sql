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
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idUser`),
  UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 65
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
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `name`, `email`, `password`, `updated_at`, `created_at`) VALUES (DEFAULT, 'Koen', 'koenfuchs20@gmail.com', 'Neok06GM', NULL, DEFAULT);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `name`, `email`, `password`, `updated_at`, `created_at`) VALUES (DEFAULT, 'Simon', 'pimmet@gamil.com', 'Zoopzoop302', NULL, DEFAULT);
INSERT INTO `pb2sef2425_boomootoocii31_live`.`user` (`idUser`, `name`, `email`, `password`, `updated_at`, `created_at`) VALUES (DEFAULT, 'Richard', 'ricardggg@gmail.com', 'Nooodddd123', NULL, DEFAULT);

COMMIT;
