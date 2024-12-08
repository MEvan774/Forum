-- gives rating to a question with a upvote or downvote from a user
CREATE TABLE QuestionRating (
    idRating INT(11) AUTO_INCREMENT PRIMARY KEY,
    idQuestion INT NOT NULL,
    idUser INT NOT NULL,
    rating INT NOT NULL CHECK (rating IN (1, -1)),
    FOREIGN KEY (idQuestion) REFERENCES question(idQuestion) ON DELETE CASCADE,
    FOREIGN KEY (idUser) REFERENCES user(idUser) ON DELETE CASCADE,
    UNIQUE KEY idUserQuestion (idQuestion, idUser)
);
