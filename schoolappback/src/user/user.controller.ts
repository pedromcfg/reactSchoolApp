import { Controller, Post, Body, Get, Param, UseGuards, Patch, Put } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { NewUserDTO } from './dtos/newUser.dto';
import { UserDetails } from './user.interface';
import { User } from './user.schema';
import { UserService } from './user.service';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async getUsers() {
    const users = await this.userService.getUsers();
    return users;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get("teachers")
  async getTeachers() {
    const users = await this.userService.getTeachers();
    return users;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get("students")
  async getStudents() {
    const users = await this.userService.getStudents();
    return users;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDetails | null> {
    return await this.userService.findByID(id);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async toggleEnableUser(@Param('id') id: string) {
    await this.userService.toggleEnableUser(id);
    return null;
  }
}
