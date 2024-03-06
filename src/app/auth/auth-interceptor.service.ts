import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, exhaustMap, map, take } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService, private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return this.store.select('auth').pipe(
      take(1),
      map(state => { // this is the state defined in auth.reducer.ts
        return state.user;
      }),
      exhaustMap(user => {
        // We only try to add the token if we have a user 
        // For Login or Sign up the user will be null (as initialized in the user BehaviorSubject)
        if (!user) {
          return next.handle(req);
        }
        const modifiedReq = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedReq);
      })
    );
  }

  // Using the old auth service
  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   return this.authService.user.pipe(
  //     take(1),
  //     exhaustMap(user => {
  //       // We only try to add the token if we have a user 
  //       // For Login or Sign up the user will be null (as initialized in the user BehaviorSubject)
  //       if (!user) {
  //         return next.handle(req);
  //       }
  //       const modifiedReq = req.clone({
  //         params: new HttpParams().set('auth', user.token)
  //       });
  //       return next.handle(modifiedReq);
  //     })
  //   );
  // }
}
