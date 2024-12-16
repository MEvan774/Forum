export type UserQueryResult = {
    idUser: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
    profilePicture: string | null;
    profession: string | null;
    yearsOfProfession: number | null;
    yearOfBirth: Date | null;
};
