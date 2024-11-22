CREATE TABLE CodeTag (
	idTag INT(11) PRIMARY KEY auto_increment,
    tagType VARCHAR(45) NOT NULL,
	idAnswer INT(11) NOT NULL
);

ALTER TABLE pb2sef2425_boomootoocii31_live.codetag ADD CONSTRAINT FOREIGN KEY(idAnswer) REFERENCES pb2sef2425_boomootoocii31_live.answer(idAnswer); 
