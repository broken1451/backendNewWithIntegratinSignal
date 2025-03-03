import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Response } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';
import { LoginResponse } from './interfaces/login.response';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('/login')
  // login(@Body() loginDto: LoginDto, @Response() response) {
  //   return this.authService.login(loginDto, response);
  // }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Request() req: Request) {
    // const user = req['user'];
    return this.authService.findAll();
  }

  @Get('/check-token')
  @UseGuards(AuthGuard)
  checkToken(@Request() req?: Request): Promise<LoginResponse> {
    const id = req['user'].id;
    return this.authService.checkToken(id);
  }


  // @Get('/:id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch('/:id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete('/:id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
