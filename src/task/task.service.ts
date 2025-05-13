import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Category } from 'src/category/entities/category.entity';
import { User } from 'src/user/entities/user.entity';
import { TaskOffer } from './entities/offer.entity';
import { TaskProgress } from './entities/progress.entity';
import { UpdateCompletionDto } from './dto/update-completion.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { RespondOfferDto } from './dto/respond-offer.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { Auth } from 'src/auth/entities/auth.entity';
import { Provider } from 'src/provider/entities/provider.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(Category) private catRepo: Repository<Category>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    @InjectRepository(Provider) private providerRepo: Repository<Provider>,
    @InjectRepository(TaskOffer) private offerRepo: Repository<TaskOffer>,
    @InjectRepository(TaskProgress)
    private progressRepo: Repository<TaskProgress>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Fetch the category by ID
    const category = await this.catRepo.findOneBy({
      id: createTaskDto.categoryId,
    });
    if (!category) {
      throw new Error(`Category with ID ${createTaskDto.categoryId} not found`);
    }

    // Create the task
    const task = this.taskRepo.create({
      ...createTaskDto,
      category,
      user,
    });

    return this.taskRepo.save(task);
  }

  findAll(filter: { status?: TaskStatus; categoryId?: string }) {
    const where: any = {};
    if (filter.status) where.status = filter.status;
    if (filter.categoryId) where.category = { id: filter.categoryId };

    return this.taskRepo.find({
      where,
      relations: ['category', 'user'],
      order: { expectedStartDate: 'DESC' },
    });
  }

  findByUser(
    userId: string,
    filter: { status?: TaskStatus; categoryId?: string },
  ) {
    const where: any = { user: { id: userId } };
    if (filter?.status && filter.status != TaskStatus.ALL)
      where.status = filter.status;
    if (filter.categoryId) where.category = { id: filter.categoryId };

    return this.taskRepo.find({
      where,
      relations: ['category'],
      order: { expectedStartDate: 'DESC' },
    });
  }

  findOne(id: string) {
    return this.taskRepo.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new Error(`Task with ID ${id} not found`);
    if (task.user.id !== userId) throw new Error('Unauthorized');
    await this.taskRepo.update(id, updateTaskDto);
    return this.findOne(id);
  }

  async remove(id: string, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) throw new Error(`Task with ID ${id} not found`);
    if (task.user.id !== userId) throw new Error('Unauthorized');
    await this.taskRepo.delete(id);
    return { deleted: true };
  }

  async makeOffer(dto: CreateOfferDto, authId: any) {
    try {
      const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
      if (!task) throw new NotFoundException('Task not found');

      console.log('authId', authId);

      const providerRes = await this.providerRepo
        .createQueryBuilder('provider')
        .innerJoinAndSelect('provider.auth', 'auth') // Join the 'auth' relation
        .where('auth.id = :authId', { authId }) // Filter by authId
        .getOne();

      if (!providerRes) throw new NotFoundException('Provider not found');

      // const provider = await this.providerRepo.findOne({
      //   where: { auth: { id: authId } },
      // });

      await this.taskRepo.update(
        { id: dto.taskId },
        { status: TaskStatus.OFFER_PENDING },
      );
      console.log('providerRes', providerRes);

      const offer = this.offerRepo.create({
        rate: dto.rate,
        message: dto.message,
        task,
        provider: { id: providerRes.id },
      });

      return this.offerRepo.save(offer);
    } catch (error) {
      console.log('Error in makeOffer:', error);
      throw error;
    }
  }

  async respondToOffer(dto: RespondOfferDto, userId: string) {
    const offer = await this.offerRepo.findOne({
      where: { id: dto.offerId },
      relations: ['task', 'task.user'],
    });
    console.log(offer);

    if (!offer) throw new NotFoundException('Offer not found');
    // if (offer.task?.user?.id !== userId)
    //   throw new UnauthorizedException('Not your task');

    offer.isAccepted = dto.accept;
    offer.isRejected = !dto.accept;
    await this.offerRepo.update(
      { id: dto.offerId },
      { isAccepted: dto.accept, isRejected: !dto.accept },
    );

    if (dto.accept) {
      offer.task.status = TaskStatus.OFFER_ACCEPTED;
      await this.taskRepo.update(
        { id: offer.task?.id },
        {
          status: TaskStatus.OFFER_ACCEPTED,
        },
      );
    } else {
      offer.task.status = TaskStatus.OFFER_REJECTED;
      await this.taskRepo.update(
        { id: offer.task?.id },
        {
          status: TaskStatus.OFFER_REJECTED,
        },
      );
    }

    return offer;
  }

  async addProgress(dto: UpdateProgressDto, providerId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: dto.taskId },
      relations: ['offers'],
    });
    if (!task) throw new NotFoundException('Task not found');

    const acceptedOffer = task.offers.find(
      (o) => o.provider.id === providerId && o.isAccepted,
    );
    if (!acceptedOffer)
      throw new UnauthorizedException('You are not assigned to this task');

    task.status = TaskStatus.IN_PROGRESS;
    await this.taskRepo.save(task);

    const progress = this.progressRepo.create({
      task,
      provider: { id: providerId },
      description: dto.description,
    });
    return this.progressRepo.save(progress);
  }

  async markCompleted(taskId: string, providerId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ['task_offer'],
    });
    if (!task) throw new NotFoundException('Task not found');

    const acceptedOffer = task.offers.find(
      (o) => o.provider.id === providerId && o.isAccepted,
    );
    if (!acceptedOffer)
      throw new UnauthorizedException('You are not assigned to this task');

    task.status = TaskStatus.COMPLETED_BY_PROVIDER;
    return this.taskRepo.save(task);
  }

  async handleCompletion(dto: UpdateCompletionDto, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id: dto.taskId },
      relations: ['user'],
    });
    if (!task) throw new NotFoundException('Task not found');
    if (task.user.id !== userId)
      throw new UnauthorizedException('Not your task');

    task.status = dto.accept
      ? TaskStatus.COMPLETION_ACCEPTED
      : TaskStatus.COMPLETION_REJECTED;

    return this.taskRepo.save(task);
  }

  async findOffersByTaskId(taskId: string, userId: string) {
    const where: any = { user: { id: userId } };
    const task = await this.taskRepo.findOne({
      where,
    });

    if (!task) {
      throw new UnauthorizedException(
        'You are not authorized to view offers for this task.',
      );
    }

    return this.offerRepo
      .createQueryBuilder('offer')
      .leftJoinAndSelect('offer.provider', 'provider')
      .leftJoinAndSelect('provider.address', 'address')
      .leftJoinAndSelect(
        'provider.individualDetails',
        'individualDetails',
        'provider.providerType = :individualType',
        { individualType: 'individual' },
      )
      .leftJoinAndSelect(
        'provider.companyDetails',
        'companyDetails',
        'provider.providerType = :companyType',
        { companyType: 'company' },
      )
      .where('offer.task = :taskId', { taskId })
      .getMany();
  }
}
