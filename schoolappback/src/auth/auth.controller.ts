import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ExistingUserDTO } from 'src/user/dtos/existingUser.dto';
import { NewUserDTO } from 'src/user/dtos/newUser.dto';
import { AuthService } from './auth.service';
import { GetCurrentUser } from '../decorators/get-current-user';
import { GetCurrentUserId } from '../decorators/get-current-userID';
import { Tokens } from './types/tokenType';
import { Public } from 'src/decorators/public.decorator';
import { RtGuard } from 'src/guards/rt.guard';

//the predefined guard is AtGuard and that is configured in app.module.ts

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')                   
  @HttpCode(HttpStatus.CREATED)  
  register(@Body() user: NewUserDTO): Promise<Tokens> {
    return this.authService.register(user);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)            
  login(@Body() user: ExistingUserDTO): Promise<Tokens> {
    return this.authService.login(user);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  } 

  // @Public()
  @Post('verify-jwt')
  @HttpCode(HttpStatus.OK)
  verifyJwt(@Body() payload: { jwt: string }) {
    return this.authService.verifyJwt(payload.jwt);
  }

  // @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ): Promise<Tokens> {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
