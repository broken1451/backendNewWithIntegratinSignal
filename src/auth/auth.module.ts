import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserShema } from './entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    // sincrono
    // ConfigModule.forRoot(),
    // JwtModule.register({
    //   global: true,
    //   secret: process.env.JWT_SECRET || '',
    //   signOptions: {
    //     expiresIn: '4h'
    //   }
    // }),
    // sincrono
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => { // se inyecta el servicio como en cualquier constructor o cualquier clases, solo q aca es una funcion 
        return {
          secret: configService.get('JWT_SECRET') || '',
          signOptions: {
            expiresIn: '4h'
          }
        }
      } // es la funcion que voy a mandar a llamar cuando se intente registrar de manera asincrono el modulo 
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserShema, collection: 'users' }])
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [ConfigModule, JwtModule]
})
export class AuthModule { }

// JwtModule.registerAsync({
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) => { // se inyecta el servicio como en cualquier constructor o cualquier clases, solo q aca es una funcion 
//     return {
//       secret: configService.get('JWT_SECRET') || '', 
//       signOptions: {
//         expiresIn: '4h'
//       }
//     }
//   } // es la funcion que voy a mandar a llamar cuando se intente registrar de manera asincrono el modulo 
// }),