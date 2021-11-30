import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class WrapResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before....');

    // return next.handle().pipe(
    //   tap((data) => ({
    //     data,
    //   })),
    // );
    //console.log(HttpStatus.OK);

    const status = HttpStatus.OK;
    return next.handle().pipe(
      map((data) => ({
        status,
        data,
      })),
    );

    // return next.handle().pipe(
    //   map((data) => {
    //     return { status, data };
    //   }),
    // );

    //return next.handle().pipe(tap((data) => console.log('after....: ', data)));
  }
}
