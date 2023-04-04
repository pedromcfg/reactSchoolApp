import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import * as argon2 from 'argon2';
import { NewUserDTO } from 'src/user/dtos/newUser.dto';
import { ExistingUserDTO } from 'src/user/dtos/existingUser.dto';
import { UserDetails } from 'src/user/user.interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from './models/role.enum';
import { JwtPayload } from './types/jwtPayload';
import { Tokens } from './types/tokenType';
import { UserDocument } from 'src/user/user.schema';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

                                           
  async register(user: Readonly<NewUserDTO>): Promise<Tokens> {
    let { firstName, lastName, email, password, role = Role.TEACHER, enabled, hashedRefreshToken = null } = user;
    const existingUser = await this.userService.findByEmail(email);

    if (existingUser)
      throw new HttpException('Email already exists!', HttpStatus.CONFLICT);

    const hashedPassword = await this.hashData(password);

    const newUser = await this.userService.createUser(
      firstName,
      lastName,
      email,
      hashedPassword,
      role,
      enabled,
      hashedRefreshToken
    );

    const tokens = await this.getTokens(newUser.id,
      newUser.email, 
      newUser.role, 
      newUser.enabled,
      newUser.firstName,
      newUser.lastName);

    newUser.hashedRefreshToken = tokens.refresh_token;
    newUser.save();

    return tokens;
  }

  async login (existingUser: ExistingUserDTO): Promise<Tokens> {
    const {email,password} = existingUser;
    const user = await this.validateUser(email, password);

    if (!user) 
    throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED);

    const userInstance = await this.userService.findByEmail(email);
    const tokens = await this.getTokens(userInstance.id,
      userInstance.email, 
      userInstance.role, 
      userInstance.enabled,
      userInstance.firstName,
      userInstance.lastName);
    
    //update refresh token
    userInstance.hashedRefreshToken = tokens.refresh_token;
    userInstance.save();

    /* const jwt = await this.jwtService.signAsync({user});
    return {token: jwt}; */
    return tokens;
  }

  async logout (id: string): Promise<boolean> {
    const userDetails: UserDetails =  await this.userService.findByID(id);
    const user: UserDocument = await this.userService.findByEmail(userDetails.email);

    user.hashedRefreshToken = null;
    user.save();
    return true;
  }

  async refreshTokens (id: string, rt: string): Promise<Tokens> {
    //get the user
    const userDetails: UserDetails =  await this.userService.findByID(id);
    const user: UserDocument = await this.userService.findByEmail(userDetails.email);

    if (!user || !user.hashedRefreshToken) throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED);

    //compare Refresh Tokens
    const rtMatches = (rt === user.hashedRefreshToken)
    if (!rtMatches) throw new HttpException('Access denied!', HttpStatus.UNAUTHORIZED);

    //get new tokens
    const tokens = await this.getTokens(user.id,
      user.email, 
      user.role, 
      user.enabled,
      user.firstName,
      user.lastName);
    
    //update refresh token
    user.hashedRefreshToken = tokens.refresh_token;
    user.save();

    return tokens;

  }

  //this will return the expiration time of the Jwt token of the user for it to be compared (in the frontend) with the current time, if it's over the expiration time, the protected routes are no longer acessible
  async verifyJwt(jwt: string): Promise<{ exp: number }> {
    try {
      const { exp } = await this.jwtService.verifyAsync(jwt, {secret: 'at-secret'});
      return { exp };
    } catch (error) {
      throw new HttpException('Invalid JWT', HttpStatus.UNAUTHORIZED);
    }
  }

  /* UTILITY FUNCTIONS */

  async validateUser(email:string, password:string): Promise<UserDetails | null> {
    const user = await this.userService.findByEmail(email);
    const userExist = !!user;

    if (!userExist) return null;

    const passwordMatch = await this.passwordMatcher(password, user.password);

    if (!passwordMatch) return null;
    if (user.role === 'teacher' && !user.enabled) return null;


    return this.userService.getUserDetails(user);
  }

  async passwordMatcher (password: string, hashedPassword: string): Promise<boolean> {
    return await argon2.verify(hashedPassword, password );
  }

  async hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  async getTokens(id: string, email: string, role: string, enabled: boolean, firstName: string, lastName: string) 
  {
    const jwtPayload: JwtPayload = {id, email, role, enabled, firstName, lastName };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: 'at-secret',
        expiresIn: '1h',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: 'rt-secret',
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
