import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  //ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  SetMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request, response } from 'express';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import * as request from 'supertest';
import { Public } from 'src/common/decorators/public.decorator';
//import { setTimeout } from 'timers/promises';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeeService: CoffeesService, //@Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('Coffees Controller Created');
  }
  // @Get('flavors')
  // findAll(@Res() response){
  //     response.status(200).send('this action coffee');
  // }
  // @Get('flavors')
  // findAll(){
  //     return 'this action coffee';
  // }
  // @Get('flavors')
  // findAll(@Query() paginationQuery){
  //     const {limit, offset} = paginationQuery;
  //     return `this action coffee. Limit: ${limit}, offset: ${offset}`;
  // }

  // @SetMetadata('isPublic', true)
  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    //await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log('protocol : ', protocol);
    return this.coffeeService.findAll(paginationQuery);
  }

  // @Get(':id')
  // findOne(@Param() params){
  //     return `This action ${params.id} coffee`
  // }
  // @Get(':id')
  // findOne(@Param('id') id : string){
  //     return `This action ${id} coffee`;
  // }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    console.log('id :', id);
    console.log('typeof id: ', typeof id);

    return this.coffeeService.findOne(id);
    //return 'ok';
  }

  // @Post()
  // create(@Body('name') body){
  //     return body;
  // }
  // @Post()
  // create(@Body() body){
  //     return body;
  // }
  // @Post()
  // @HttpCode(HttpStatus.GONE)
  // create(@Body() body){
  //     return body;
  // }
  // @Post()
  // create(@Body() body){
  //     return body;
  // }
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    //console.log(createCoffeeDto instanceof CreateCoffeeDto)
    return this.coffeeService.create(createCoffeeDto);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() body){
  //     return `This action update ${id} coffee`
  // }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string){
  //     return `This action removes ${id} coffee`
  // }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(id);
  }
  //cekout
}
