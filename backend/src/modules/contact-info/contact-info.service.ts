import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, ContactInfo, Location, Media } from '@prisma/client';
import { UpdateContactInfoDto } from './dto/update-contact-info.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Injectable()
export class ContactInfoService {
  constructor(private readonly prisma: PrismaService) {}

  private getSingletonId(): string {
    return process.env.STATIC_CONTACT_ID || 'STATIC_CONTACT_ID';
  }

  // CONTACT INFO
  findAll(): Prisma.PrismaPromise<ContactInfo[]> {
    return this.prisma.contactInfo.findMany({
      include: { media: true, locations: true },
    });
  }

  updateContact(data: UpdateContactInfoDto): Prisma.PrismaPromise<ContactInfo> {
    return this.prisma.contactInfo.update({
      where: { id: this.getSingletonId() },
      data,
    });
  }

  // LOCATION
  addLocation(data: CreateLocationDto): Prisma.PrismaPromise<Location> {
    return this.prisma.location.create({ data });
  }

  updateLocation(
    id: string,
    data: UpdateLocationDto,
  ): Prisma.PrismaPromise<Location> {
    return this.prisma.location.update({ where: { id }, data });
  }

  deleteLocation(id: string): Prisma.PrismaPromise<Location> {
    return this.prisma.location.delete({ where: { id } });
  }

  // MEDIA
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
