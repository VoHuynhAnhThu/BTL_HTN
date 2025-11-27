"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const util_1 = require("../helpers/util/util");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../modules/users/users.service");
let AuthService = class AuthService {
    constructor(userService, jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }
    async signIn(username, pass) {
        const user = await this.userService.findOneByEmail(username);
        const isValidPassword = await (0, util_1.comparePasswordHelper)(pass, user.password);
        if (!isValidPassword) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const payload = { sub: user.id, username: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async validateUser(username, pass) {
        const user = await this.userService.findOneByEmail(username);
        if (!user) {
            console.log(`[AUTH] validateUser: user not found for email=${username}`);
            return null;
        }
        const isValidPassword = await (0, util_1.comparePasswordHelper)(pass, user.password);
        console.log(`[AUTH] validateUser: email=${username} matchPassword=${isValidPassword}`);
        if (!isValidPassword) {
            return null;
        }
        console.log("username=", username);
        console.log("user from DB=", user);
        return user;
    }
    async login(user) {
        const payload = { username: user.email, sub: user._id };
        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            access_token: await this.jwtService.sign(payload),
        };
    }
    async register(resgisterDto) {
        return await this.userService.handleRegister(resgisterDto);
    }
    async verify(identifier, codeId, isEmail = false) {
        let user;
        if (isEmail) {
            user = await this.userService.findOneByEmail(identifier);
        }
        else {
            user = await this.userService.findOneById(identifier);
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid user');
        }
        console.log(user.codeId);
        if (user.isActive === true) {
            throw new common_1.UnauthorizedException('This account is already activated!');
        }
        if (user?.codeId !== codeId) {
            throw new common_1.UnauthorizedException('Invalid codeId');
        }
        return this.userService.activateUser(user._id);
    }
    async devResetPassword(email, newPassword) {
        return await this.userService.devResetPasswordByEmail(email, newPassword);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map