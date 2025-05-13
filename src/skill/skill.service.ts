// skill.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

import { Role } from 'src/auth/entities/auth.entity';
import { Category } from 'src/category/entities/category.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Provider)
    private providerRepo: Repository<Provider>,
  ) {}

  async create(dto: CreateSkillDto, providerId: string): Promise<Skill> {
    const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!category) throw new NotFoundException('Category not found');

    const provider = await this.providerRepo.findOneBy({ id: providerId });
    if (!provider) throw new ForbiddenException('Unauthorized Provider');

    const skill = this.skillRepo.create({
      ...dto,
      category,
      provider,
    });

    return this.skillRepo.save(skill);
  }

  findAll(): Promise<Skill[]> {
    return this.skillRepo.find();
  }

  async findOne(id: string): Promise<Skill> {
    const skill = await this.skillRepo.findOne({ where: { id } });
    if (!skill) throw new NotFoundException('Skill not found');
    return skill;
  }

  async update(id: string, dto: UpdateSkillDto, providerId: string): Promise<Skill> {
    const skill = await this.findOne(id);

    if (skill.provider.id !== providerId) {
      throw new ForbiddenException('Not your skill to update');
    }

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOneBy({ id: dto.categoryId });
      if (!category) throw new NotFoundException('Category not found');
      skill.category = category;
    }

    Object.assign(skill, dto);
    return this.skillRepo.save(skill);
  }

  async remove(id: string, providerId: string): Promise<void> {
    const skill = await this.findOne(id);
    if (skill.provider.id !== providerId) {
      throw new ForbiddenException('Not your skill to delete');
    }
    await this.skillRepo.remove(skill);
  }
}
