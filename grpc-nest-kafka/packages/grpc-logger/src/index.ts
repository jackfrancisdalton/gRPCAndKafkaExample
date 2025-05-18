import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';

const logger = new Logger('GrpcClient');

export function createLoggingClient<T extends object>(svc: T, serviceName: string): T {
  return new Proxy(
    svc, 
    {
        get(target, prop: string | symbol) {
            const orig = Reflect.get(target, prop);

            if (typeof orig !== 'function') {
                return orig;
            }

            return (...args: unknown[]) => {
                logger.log(`→ ${serviceName}.${String(prop)}()`, JSON.stringify(args));
                const result$ = (orig as Function).apply(target, args) as Observable<unknown>;
                
                return result$.pipe(
                    tap({
                        next: res => logger.log(`← ${serviceName}.${String(prop)}()`, JSON.stringify(res)),
                        error: err => logger.error(`× ${serviceName}.${String(prop)}() failed`, err?.message),
                    }),
                );
            };
        },
    }
  )
}
