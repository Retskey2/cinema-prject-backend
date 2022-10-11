import {IsEmail, IsString, MinLength} from "@nestjs/class-validator";

export class AuthDto {
    @IsEmail()
    email: string

    @IsString()
    @MinLength(6, {
        message: 'Password cannot than 6 characters!'
    })
    password: string
}