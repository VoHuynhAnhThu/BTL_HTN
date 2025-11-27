import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyAuthDto } from './dto/create-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
export declare class AuthController {
    private readonly authService;
    private readonly mailerService;
    constructor(authService: AuthService, mailerService: MailerService);
    handleLogin(req: any): Promise<{
        user: {
            _id: any;
            name: any;
            email: any;
        };
        access_token: string;
    }>;
    register(registerDto: CreateAuthDto): Promise<{
        _id: any;
    }>;
    testMail(): string;
    getProfile(req: any): any;
    verify(verifyDto: VerifyAuthDto): Promise<any>;
    devReset(body: {
        email: string;
        newPassword: string;
    }): Promise<{
        _id: any;
        email: any;
        isActive: any;
    }>;
}
