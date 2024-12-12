CREATE TABLE AnswerRating (
    idRating INT(11) AUTO_INCREMENT PRIMARY KEY,
    idAnswer INT NOT NULL,
    idUser INT NOT NULL,
    rating INT NOT NULL CHECK (rating IN (1, -1)),
    FOREIGN KEY (idAnswer) REFERENCES answer(idAnswer) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES user(idUser) ON DELETE CASCADE,
    UNIQUE KEY idUniqueAnswer (idAnswer, idUser)
);
