import { Injectable, NotFoundException } from '@nestjs/common';
import { Subject } from './subjects.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel('Subject') private readonly subjectModel: Model<Subject>,
  ) {}

  async insertSubject(name: string, description: string, user_id: string) {
    const newSubject = new this.subjectModel({
      name,
      description,
      user_id
    });
    const result = await newSubject.save();
    return result.id as string;
  }

  async getSubjects() {
    const subjects = await this.subjectModel.find().exec();
    return subjects.map((subject) => ({
      id: subject.id,
      name: subject.name,
      description: subject.description,
      user_id: subject.user_id
    }));
  }

  async getSingleSubject(subjectId: string) {
    const subject = await this.findSubject(subjectId);
    return {
      id: subject.id,
      name: subject.name,
      description: subject.description,
      user_id: subject.user_id
    };
  }

  async updateSubject(subjectId: string, name: string, description: string, user_id: string) {
    const updatedSubject = await this.findSubject(subjectId);
    if (name) {
      updatedSubject.name = name;
    }
    if (description) {
      updatedSubject.description = description;
    }
    if (user_id) {
      updatedSubject.user_id = user_id;
    }
    updatedSubject.save();
  }

  async deleteSubject(subjectId: string) {
    const result = await this.subjectModel.deleteOne({ _id: subjectId }).exec();
    if (result.deletedCount === 0)
      throw new NotFoundException('Could not find the subject.');
  }

  private async findSubject(subjectId: string): Promise<Subject> {
    let subject;
    try {
      subject = await this.subjectModel.findById(subjectId).exec();
    } catch (error) {
      throw new NotFoundException('Could not find the subject.');
    }

    if (!subject) throw new NotFoundException('Could not find the subject.');

    return subject;
  }
}
