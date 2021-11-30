import { Module, Injectable, Scope } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import coffeesConfig from './config/coffees.config';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

//class MockCoffeeService {}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buddy brew', 'nescafe'];
  }
}
@Module({
  imports: [
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    // { provide: COFFEE_BRANDS, useValue: ['buddy brew', 'nescafe'] },
    //{ provide: COFFEE_BRANDS, useFactory: () => ['buddy brew', 'nescafe'] },
    // CoffeeBrandsFactory,
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (coffeeBrandsFactory: CoffeeBrandsFactory) =>
    //     coffeeBrandsFactory.create(),
    //   inject: [CoffeeBrandsFactory],
    // },
    CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (connection: Connection): Promise<string[]> => {
        // const coffeeBrands = await connection.query(Select * ...)
        const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
        console.log('!!!ASYNC');
        return coffeeBrands;
      },
      inject: [CoffeeBrandsFactory],
      //scope: Scope.TRANSIENT,
    },

    // {
    //   provide: ConfigService,
    //   useClass:
    //     process.env.NODE_ENV === 'development'
    //       ? DevelopmentConfigService
    //       : ProductionConfigService,
    // },
    //{ provide: 'COFFEE_BRANDS', useValue: ['buddy brew', 'nescafe'] },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
