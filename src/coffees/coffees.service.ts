import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { stringify } from 'querystring';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';

@Injectable()
export class CoffeesService {
  // private coffees: Coffee[] = [
  //     {
  //         id: 1,
  //         name: 'Shipwreck Roast',
  //         brand: 'Buddy Brew',
  //         flavors: ['chocolate', 'vanilla'],
  //     },
  // ];

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto): Promise<Coffee[]> {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  // findOne(id: string){
  //     return this.coffees.find(item => item.id === +id);
  // }
  // findOne(id: string){
  //     const coffee = this.coffees.find(item => item.id === +id);
  //     if(!coffee){
  //         throw new HttpException(`Coffee ${id} not found`, HttpStatus.NOT_FOUND);
  //     }
  //     return coffee;
  // }
  // findOne(id: string){
  //     throw 'Random error';
  //     const coffee = this.coffees.find(item => item.id === +id);
  //     if(!coffee){
  //         throw new NotFoundException(`Coffee ${id} not found`);
  //     }
  //     return coffee;
  // }
  // findOne(id: string){
  //     const coffee = this.coffees.find(item => item.id === +id);
  //     if(!coffee){
  //         throw new NotFoundException(`Coffee ${id} not found`);
  //     }
  //     return coffee;
  // }
  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    //console.log(coffee);
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return coffee;
  }

  // create(createCoffeeDto: any){
  //     this.coffees.push(createCoffeeDto);
  //     return createCoffeeDto;
  // }
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    //console.log(flavors);
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    // console.log(coffee);
    //const coffee = this.coffeeRepository.create(createCoffeeDto);
    return this.coffeeRepository.save(coffee);
  }

  //  update(id: string, updateCoffeeDto: any){
  //     const existingCoffee = this.findOne(id);
  //     if(existingCoffee){
  //        //update existing entity
  //     }
  // }
  // async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
  //   const coffee = await this.coffeeRepository.preload({
  //     id: +id,
  //     ...updateCoffeeDto,
  //   });
  //   if (!coffee) {
  //     throw new NotFoundException(`Coffee ${id} not found`);
  //   }
  //   return this.coffeeRepository.save(coffee);
  // }

  async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee ${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  // remove(id: string){
  //     const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
  //     if(coffeeIndex >= 0){
  //         this.coffees.splice(coffeeIndex, 1);
  //     }
  // }
  async remove(id: string) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
