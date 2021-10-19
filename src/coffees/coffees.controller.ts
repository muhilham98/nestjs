import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { response } from 'express';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
    constructor(private readonly coffeeService: CoffeesService){

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
    @Get()
    findAll(@Query() paginationQuery){
        return this.coffeeService.findAll();
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
    findOne(@Param('id') id : string){
        
        return this.coffeeService.findOne(id);
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
    create(@Body() createCoffeeDto: CreateCoffeeDto){
        //console.log(createCoffeeDto instanceof CreateCoffeeDto)
        return this.coffeeService.create(createCoffeeDto);
    }

    // @Patch(':id')
    // update(@Param('id') id: string, @Body() body){
    //     return `This action update ${id} coffee`
    // }
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto){
        return this.coffeeService.update(id, updateCoffeeDto);
    }


    // @Delete(':id')
    // remove(@Param('id') id: string){
    //     return `This action removes ${id} coffee`
    // }
    @Delete(':id')
    remove(@Param('id') id: string){
        return this.coffeeService.remove(id);
    }
    //cekout
}
