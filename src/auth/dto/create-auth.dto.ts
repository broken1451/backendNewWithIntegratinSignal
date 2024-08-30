import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {

    @IsString()
    @MinLength(1)
    @IsNotEmpty()
    @IsOptional()
    name: string;

    @IsString()
    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @IsOptional()
    password: string;

    @IsDate({ message: "created debe ser una fecha valida" })
    @Type(() => Date)
    @IsOptional()
    created: Date;

}
