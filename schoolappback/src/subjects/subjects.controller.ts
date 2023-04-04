import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards
} from '@nestjs/common';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/models/role.enum';
import { SubjectsService } from './subjects.service';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  async addSubject(
    @Body('name') subjectName: string,
    @Body('description') subjectDescription: string,
    @Body('user_id') subjectUserID: string
  ) {
    const subjectId = await this.subjectsService.insertSubject(
      subjectName,
      subjectDescription,
      subjectUserID
    );
    return { id: subjectId };
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get()
  async getAllSubjects() {
    const subjects = await this.subjectsService.getSubjects();
    return subjects;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get(':id')
  async getSubject(@Param('id') subjectId: string) {
    return await this.subjectsService.getSingleSubject(subjectId);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async updateSubject(
    @Param('id') subjectId: string,
    @Body('name') subjectName: string,
    @Body('description') subjectDescription: string,
    @Body('user_id') subjectUserID: string,
  ) {
    await this.subjectsService.updateSubject(
      subjectId,
      subjectName,
      subjectDescription,
      subjectUserID
    );
    return null;
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async removeSubject(@Param('id') subjectId: string) {
    await this.subjectsService.deleteSubject(subjectId);
    return null;
  }
}
