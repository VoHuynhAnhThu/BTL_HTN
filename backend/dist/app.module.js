"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/passport/jwt-auth.guard");
const transorm_interceptor_1 = require("./core/transorm.interceptor");
const garden_info_module_1 = require("./modules/garden-info/garden-info.module");
const humidity_records_module_1 = require("./modules/humidity-records/humidity-records.module");
const light_records_module_1 = require("./modules/light-records/light-records.module");
const pump_records_module_1 = require("./modules/pump-records/pump-records.module");
const temperature_records_module_1 = require("./modules/temperature-records/temperature-records.module");
const mqtt_module_1 = require("./modules/mqtt/mqtt.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const health_controller_1 = require("./health.controller");
const ai_module_1 = require("./modules/ai/ai.module");
const core_1 = require("@nestjs/core");
const coreiot_module_1 = require("./modules/coreiot/coreiot.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                useFactory: async (configService) => {
                    const uri = configService.get('MONGODB_URI');
                    if (!uri)
                        throw new Error('Missing MONGODB_URI in .env');
                    return { uri };
                },
                inject: [config_1.ConfigService],
            }),
            notifications_module_1.NotificationsModule,
            mqtt_module_1.MqttModule,
            light_records_module_1.LightRecordsModule,
            coreiot_module_1.CoreIotModule,
            users_module_1.UsersModule,
            humidity_records_module_1.HumidityRecordsModule,
            pump_records_module_1.PumpRecordsModule,
            temperature_records_module_1.TemperatureRecordsModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => {
                    const user = configService.get('MAIL_USER');
                    const pass = configService.get('MAIL_PASS');
                    if (!user || !pass)
                        throw new Error('Missing MAIL_USER or MAIL_PASS');
                    return {
                        transport: {
                            host: 'smtp.gmail.com',
                            port: 465,
                            secure: true,
                            auth: { user, pass },
                        },
                        defaults: { from: '"No Reply" <no-reply@localhost>' },
                        template: {
                            dir: process.cwd() + '/src/mail/templates',
                            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                            options: { strict: true },
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            garden_info_module_1.GardenInfoModule,
            ai_module_1.AiModule
        ],
        controllers: [app_controller_1.AppController, health_controller_1.HealthController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_INTERCEPTOR, useClass: transorm_interceptor_1.TransformInterceptor }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map