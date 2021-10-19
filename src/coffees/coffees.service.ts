import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [
        {
            id: 1,
            name: 'Shipwreck Roast',
            brand: 'Buddy Brew',
            flavors: ['chocolate', 'vanilla'],
        },
    ];

    findAll(){
        return this.coffees;
    }

    // findOne(id: String){
    //     return this.coffees.find(item => item.id === +id);
    // }
    // findOne(id: String){
    //     const coffee = this.coffees.find(item => item.id === +id);
    //     if(!coffee){
    //         throw new HttpException(`Coffee ${id} not found`, HttpStatus.NOT_FOUND);
    //     }
    //     return coffee;
    // }
    // findOne(id: String){
    //     throw 'Random error';
    //     const coffee = this.coffees.find(item => item.id === +id);
    //     if(!coffee){
    //         throw new NotFoundException(`Coffee ${id} not found`);
    //     }
    //     return coffee;
    // }
    findOne(id: String){
        const coffee = this.coffees.find(item => item.id === +id);
        if(!coffee){
            throw new NotFoundException(`Coffee ${id} not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: any){
        this.coffees.push(createCoffeeDto);
        return createCoffeeDto;
    }

    update(id: string, updateCoffeeDto: any){
        const existingCoffee = this.findOne(id);
        if(existingCoffee){
           //update existing entity 
        }
    }

    remove(id: string){
        const coffeeIndex = this.coffees.findIndex(item => item.id === +id);
        if(coffeeIndex >= 0){
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}
