import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy } from 'passport-local';
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Accept 'email' primary, allow fallback 'username'
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    // Fallback to req.body.username if email key not provided
    const effectiveEmail = email || (req.body as any).username;
    if (!effectiveEmail) {
      throw new UnauthorizedException("Missing email/username");
    }
    const user = await this.authService.validateUser(effectiveEmail, password);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.isActive === false) {
      throw new BadRequestException("Account is not active");
    }
    return user;
  }
}