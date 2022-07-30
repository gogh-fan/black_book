export interface UserEntity {
    id: number;
    nick: string;
    email: string;
    verified: boolean;
    secretMember: boolean;
    payments: boolean;
}
