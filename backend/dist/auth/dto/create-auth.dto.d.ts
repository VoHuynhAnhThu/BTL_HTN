export declare class CreateAuthDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
}
export declare class VerifyAuthDto {
    _id?: string;
    email?: string;
    codeId: string;
}
