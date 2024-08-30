import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login.response';
import { RegisterDto } from './dto/register.dto';
import { response } from 'express';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Authenticates a user by checking their credentials and generating an authentication token.
   * @param loginDto - The login data containing the email and password.
   * @returns An object containing the authenticated user and the generated authentication token.
   * @throws BadRequestException if the provided credentials are invalid.
   */
  // async login(loginDto: LoginDto, response?: any): Promise<LoginResponse> {
  async login(loginDto: LoginDto): Promise<LoginResponse> {

      const { email, password } = loginDto;

      // 1. Buscar el usuario en la base de datos
      const user = await this.userModel.findOne({ email });

      // 2. Verificar si el usuario existe y si la contraseña es válida
      if (!user || !bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credenciales inválidas');
      }

      // 3. Generar el token de autenticación
      const tokenValido = await this.generateAuthToken({id: user._id.toString()});

      // 4. Devolver el usuario y el token de autenticación
      return { user, token: tokenValido };
  }

  
  async register(createAuthDto: RegisterDto): Promise<LoginResponse | any> {
    const user = await this.create(createAuthDto);
    return this.login({email: user.email, password: createAuthDto.password});
    // return {
    //   user,
    //   token: await this.generateAuthToken({id: user._id.toString()})
    // };
  }



  async generateAuthToken(user: JwtPayload) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  async create(createAuthDto: CreateAuthDto) {
    let { name, email, password, ...rest } = createAuthDto;
    name = name.toLowerCase().trim();
    email = email.toLowerCase().trim();
    password = password.trim();

    let userExist: User;
    if (email) {
      userExist = await this.userModel.findOne({ email });
      if (userExist) {
        throw new BadRequestException(`El Usuario Existe en la db con el correo ${userExist.email}`);
      }
    }

    // 1 encriptar contrasena
    const saltOrRounds = 10;
    password = bcrypt.hashSync(password, saltOrRounds);


    // 2 guardar usuario en la db
    const createUser = await this.userModel.create({
      name,
      email,
      password,
      ...rest
    });
    return await this.userModel.findById(createUser._id).select('-password');


    // 3 generar jwt

    // const {password: _, ...restProperties  } = createUser.toObject();
    // const {password: _, ...restProperties  } = createUser.toJSON();
    // return restProperties
  }

  async findAll(): Promise<{ total: number, users: User[] }> {
    const countsUser = await this.userModel.countDocuments({});
    return {
      total: countsUser,
      users: await this.userModel.find().select('-password')
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async findUserById(id : string){
    const user = await this.userModel.findById(id).select('-password');
    if(!user){
      throw new BadRequestException(`El Usuario con el id ${id} no existe`);
    }
    return user;
  }

  async checkToken(id : string): Promise<LoginResponse> {
    const user = await this.userModel.findById(id).select('-password');
    if(!user){
      throw new BadRequestException(`El Usuario con el id ${id} no existe`);
    }
    return {
      user,
      token: await this.generateAuthToken({id: user._id.toString()})
    };
  }
}
