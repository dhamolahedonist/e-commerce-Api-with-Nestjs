import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UserSignInDto{
    @IsNotEmpty({message: 'Email cannot be null'})
    @IsEmail({}, {message: 'Please provide a vaild email'})
    email:string;

    @IsNotEmpty({message: 'Password cannot be null'})
    @MinLength(5, {message: 'Password minimum character should be 5'})
    password:string
}