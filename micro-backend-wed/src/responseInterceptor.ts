import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface Response {
  message: string;
  success: boolean;
  result: any;
  timeStamp: Date;
  statusCode: number;
  error: null;
}
export class TransformationInterceptor<T>
  implements NestInterceptor<T, Response>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const statusCode = context.switchToHttp().getResponse().status;
    const path = context.switchToHttp().getRequest().url;
    return next.handle().pipe(
      map((data) => ({
        message: data.message,
        success: data.success,
        result: data?.result,
        timeStamp: new Date(),
        statusCode,
        path,
        error: null,
      })),
    );
  }
}
