export interface JwtPayload {
    id: string;
    iat?: Date | number;
    exp?: Date | number;
}