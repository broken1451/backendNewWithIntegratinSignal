import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private jwtService: JwtService, private readonly configService: ConfigService, private readonly authService: AuthService) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(`There is no token`);
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret: this.configService.get('JWT_SECRET') || '' });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // console.log({payload});
      // request['user'] = payload;
      const user = await this.authService.findUserById(payload.id);
      // console.log({user});
      if (!user) {
        throw new UnauthorizedException(`User not found`);
      }
      if (!user.isActive) {
        throw new UnauthorizedException(`User is not active`);
      }
      // console.log({user})
      request['user'] = user;
    } catch (error) {
      throw new UnauthorizedException();
    }

    return Promise.resolve(true);
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
