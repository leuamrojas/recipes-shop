import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AUTHENTICATE_SUCCESS, LOGIN_START, AuthenticateSuccess, AuthenticateFail, LoginStart, SIGNUP_START, SignupStart, LOGOUT, AUTO_LOGIN } from "./auth.actions";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "environments/environment";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { User } from "../user.model";
import { AuthService } from "../auth.service";

export interface AuthResponse {
    idToken: 	string;
    email: string;
    refreshToken:	string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (res: AuthResponse) => {
    const expirationDate = new Date( new Date().getTime() + +res.expiresIn * 1000);
    const user = new User(res.email, res.localId, res.idToken, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    // Login (success) action is dispatched
    return new AuthenticateSuccess({
        email: res.email,
        userId: res.localId,
        token: res.idToken,
        expirationDate: expirationDate,
        redirect: true
    });
};

const handleError = (res: any) => {
    let errorMessage = 'An unknown error occurred!';
    if (!res.error || !res.error.error) {
        //here we need our new action, automatically dispatched by ngrx
        //we build and return an observable, if not it will die here and won't capture any more actions dispatched
        //Never call throwError
        return of( new AuthenticateFail(errorMessage) ); // LoginFail action is dispatched
    }
    switch (res.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist.';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not correct.';
            break;
        case 'INVALID_LOGIN_CREDENTIALS':
            errorMessage = 'Invalid login credentials';
            break;
    }
    return of( new AuthenticateFail(errorMessage) );
};

const getAuthRequest = (email: string, password: string) => {
    return {
      email: email,
      password: password,
      returnSecureToken: true
    };
};

@Injectable()
export class AuthEffects {

    authSignup = createEffect(() => 
        this.actions$.pipe(
            ofType(SIGNUP_START),
            switchMap((authData: SignupStart) => {
                return this.http
                .post<AuthResponse>(
                    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                    getAuthRequest(authData.payload.email,authData.payload.password)
                )
                .pipe( //hooked to this inner observable
                    tap(res => {
                        this.authService.setLogoutTimer(+res.expiresIn * 1000);
                    }),        
                    map( handleAuthentication
                        // const expirationDate = new Date(
                        //     new Date().getTime() + +resData.expiresIn * 1000
                        // );
                        // // Login (success) action is dispatched
                        // return new AuthenticateSuccess({
                        //     email: resData.email,
                        //     userId: resData.localId,
                        //     token: resData.idToken,
                        //     expirationDate: expirationDate,
                        // });
                    ),
                    catchError( handleError
                        // let errorMessage = 'An unknown error occurred!';
                        // if (!errorRes.error || !errorRes.error.error) {
                        //     //here we need our new action, automatically dispatched by ngrx
                        //     //we build and return an observable, if not it will die here and won't capture any more actions dispatched
                        //     //Never call throwError
                        //     return of( new AuthenticateFail(errorMessage) ); // LoginFail action is dispatched
                        // }
                        // switch (errorRes.error.error.message) {
                        //     case 'EMAIL_EXISTS':
                        //         errorMessage = 'This email exists already';
                        //     break;
                        //     case 'EMAIL_NOT_FOUND':
                        //         errorMessage = 'This email does not exist.';
                        //     break;
                        //     case 'INVALID_PASSWORD':
                        //         errorMessage = 'This password is not correct.';
                        //     break;
                        // }
                        //here we need our new action, automatically dispatched by ngrx
                        //we build and return an observable, if not it will die here and won't capture any more actions dispatched
                        // return of( new AuthenticateFail(errorMessage) ); // LoginFail action is dispatched
                    )
                );
            })
        )
    );

    // action$ is an observable that is automatically subscribed by ngrx
    authLogin = createEffect(() =>
        this.actions$.pipe(
            ofType(LOGIN_START),
            switchMap((authData: LoginStart) => {
                return this.http
                .post<AuthResponse>(
                    'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseAPIKey,
                    getAuthRequest(authData.payload.email,authData.payload.password)
                )
                .pipe( //hooked to this inner observable
                    tap(res => {
                        this.authService.setLogoutTimer(+res.expiresIn * 1000);
                    }), 
                    map( handleAuthentication
                    //     resData => {
                    //     const expirationDate = new Date(
                    //         new Date().getTime() + +resData.expiresIn * 1000
                    //     );
                    //     // Login (success) action is dispatched
                    //     return new AuthenticateSuccess({
                    //         email: resData.email,
                    //         userId: resData.localId,
                    //         token: resData.idToken,
                    //         expirationDate: expirationDate,
                    //     });
                    // }
                    ),
                    catchError( handleError
                    //     errorRes => {
                    //     let errorMessage = 'An unknown error occurred!';
                    //     if (!errorRes.error || !errorRes.error.error) {
                    //         //here we need our new action, automatically dispatched by ngrx
                    //         //we build and return an observable, if not it will die here and won't capture any more actions dispatched
                    //         //Never call throwError
                    //         return of( new AuthenticateFail(errorMessage) ); // LoginFail action is dispatched
                    //     }
                    //     switch (errorRes.error.error.message) {
                    //         case 'EMAIL_EXISTS':
                    //             errorMessage = 'This email exists already';
                    //         break;
                    //         case 'EMAIL_NOT_FOUND':
                    //             errorMessage = 'This email does not exist.';
                    //         break;
                    //         case 'INVALID_PASSWORD':
                    //             errorMessage = 'This password is not correct.';
                    //         break;
                    //     }
                    //     //here we need our new action, automatically dispatched by ngrx
                    //     //we build and return an observable, if not it will die here and won't capture any more actions dispatched
                    //     return of( new AuthenticateFail(errorMessage) ); // LoginFail action is dispatched
                    // }
                    )
                );
            })
        )
    );    

    autoLogin = createEffect(
        () => this.actions$
        .pipe(
            ofType(AUTO_LOGIN),
            map(() => {
              const userData: {
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
              } = JSON.parse(localStorage.getItem('userData'));
              if (!userData) {
                return { type: 'DUMMY' };
              }
        
              const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
              );
        
              if (loadedUser.token) {
                // this.user.next(loadedUser);
                const expirationDuration =
                  new Date(userData._tokenExpirationDate).getTime() -
                  new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthenticateSuccess({
                  email: loadedUser.email,
                  userId: loadedUser.id,
                  token: loadedUser.token,
                  expirationDate: new Date(userData._tokenExpirationDate),
                  redirect: false
                });
        
                // const expirationDuration =
                //   new Date(userData._tokenExpirationDate).getTime() -
                //   new Date().getTime();
                // this.autoLogout(expirationDuration);
              }
              return { type: 'DUMMY' }; // you need to return always a valid action (observable)
            })
        )
    );

    authRedirect = createEffect(
        () => this.actions$
        .pipe(
            ofType(AUTHENTICATE_SUCCESS),
            tap((action: AuthenticateSuccess) => {
                if(action.payload.redirect) {
                    this.router.navigate(['/']);
                }
            })
        ),
        { dispatch: false }
    );

    authLogout = createEffect(
        () => this.actions$
        .pipe(
            ofType(LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            })
        ),
        {dispatch: false}
    );    

    constructor(
        private actions$: Actions, 
        private http: HttpClient, 
        private router: Router,
        private authService: AuthService
    ) {}
}