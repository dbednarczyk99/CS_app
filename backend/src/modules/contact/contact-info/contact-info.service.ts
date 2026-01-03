import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, ContactInfo, Media, ContactType } from '@prisma/client';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class ContactInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /*   ------------------         CONTACT         ------------------   */
  findAll(): Prisma.PrismaPromise<ContactInfo[]> {
    return this.prisma.contactInfo.findMany();
  }

  findOne(id: string): Prisma.PrismaPromise<ContactInfo | null> {
    return this.prisma.contactInfo.findUnique({ where: { id } });
  }

  async updateContact(id: string, dto: UpdateContactInfoDto) {
    const { type, ...rest } = dto as any;

    return this.prisma.contactInfo.update({
      where: { id },
      data: {
        ...rest,
        ...(type !== undefined ? { type: type as ContactType } : {}),
      },
    });
  }

  deleteContact(id: string): Prisma.PrismaPromise<ContactInfo> {
    return this.prisma.contactInfo.delete({ where: { id } });
  }

  createContact(dto: UpdateContactInfoDto): Prisma.PrismaPromise<ContactInfo> {
    const { type, ...rest } = dto as any;
    return this.prisma.contactInfo.create({
      data: {
        ...rest,
        ...(type !== undefined ? { type: type as ContactType } : {}),
      },
    });
  }

  /*   ------------------         SOCIAL MEDIA         ------------------   */
  getAllMedia(): Prisma.PrismaPromise<Media[]> {
    return this.prisma.media.findMany();
  }

  getMediaById(id: string): Prisma.PrismaPromise<Media | null> {
    return this.prisma.media.findUnique({ where: { id } });
  }

  addMedia(data: CreateMediaDto): Prisma.PrismaPromise<Media> {
    return this.prisma.media.create({ data });
  }

  editMedia(id: string, data: UpdateMediaDto): Prisma.PrismaPromise<Media> {
    return this.prisma.media.update({ where: { id }, data });
  }

  deleteMedia(id: string): Prisma.PrismaPromise<Media> {
    return this.prisma.media.delete({ where: { id } });
  }
}
