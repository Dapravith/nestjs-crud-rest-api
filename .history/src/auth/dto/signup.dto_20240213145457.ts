import { IsNotEmpty, IsString, MinLength } from 'class-validator';


export class SignUpDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: "Please enter correct email "})
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    readonly password: string;
}