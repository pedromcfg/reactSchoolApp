import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserDetails } from './user.interface';
import { Role } from 'src/auth/models/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(
    firstName: string,
    lastName: string,
    email: string,
    hashedPassword: string,
    role: string,
    enabled: boolean,
    hashedRefreshToken: string
  ): Promise<UserDocument> {
    const newUser = new this.userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      enabled: (role === Role.TEACHER)? false : true,
      hashedRefreshToken
    });
    return await newUser.save();
  }

  async getUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => this.getUserDetails(user));
  }

  async getTeachers() {
    const teachers = await this.userModel.find({role: 'teacher'}).exec();
    if (teachers)
      return teachers.map((teacher) => this.getUserDetails(teacher));
    return null;
  }

  async getStudents() {
    const students = await this.userModel.find({role: 'student'}).exec();
    if (students)
      return students.map((student) => this.getUserDetails(student));
    return null;
  }

  async toggleEnableUser(id: string) {
    const updatedUser = await this.findUser(id);
    updatedUser.enabled = !updatedUser.enabled;
    updatedUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async findByID(id: string): Promise<UserDetails | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;
    return this.getUserDetails(user);
  }

  getUserDetails(user: UserDocument): UserDetails {
    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      // hashedRefreshToken: user.hashedRefreshToken,
    };
  }

  private async findUser(userId: string): Promise<UserDocument> {
    let subject;
    try {
      subject = await this.userModel.findById(userId).exec();
    } catch (error) {
      throw new NotFoundException('Could not find the subject.');
    }

    if (!subject) throw new NotFoundException('Could not find the subject.');

    return subject;
  }
}
