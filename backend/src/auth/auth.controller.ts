import { Controller, Get, Post, Body, Request, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { JwtAuthGuard } from './passport/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService
  ) {}


  @Post("login")
  @Public()
  @ResponseMessage("Login successfully")
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post("register")
  @Public()
  async register(@Body() registerDto: CreateAuthDto) {
    return await this.authService.register(registerDto);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'hoi.phan1712@hcmut.edu.vn',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: "register",
      context: {  
        name: "Yilongma",
        activationCode: 123123123
      }
    })
    .then(() => {
      console.log('mail sent');
    })

    return "ok";
  }
  
  // get me
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post('verify')
  @ResponseMessage("Verify account successfully")
  async verify(@Body() verifyDto: VerifyAuthDto) {
    // Support both email and _id
    if (verifyDto.email) {
      return await this.authService.verify(verifyDto.email, verifyDto.codeId, true);
    } else if (verifyDto._id) {
      return await this.authService.verify(verifyDto._id, verifyDto.codeId, false);
    } else {
      throw new UnauthorizedException('Either email or _id is required');
    }
  }

  // DEV ONLY: password reset without old password
  @Post('reset-temp')
  @Public()
  async devReset(@Body() body: { email: string, newPassword: string }) {
    return await this.authService.devResetPassword(body.email, body.newPassword);
  }
}
