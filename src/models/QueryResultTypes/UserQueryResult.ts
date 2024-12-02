export type UserQueryResult = {
    idUser: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date | null;
};
