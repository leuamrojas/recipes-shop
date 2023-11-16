import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponse {
  idToken: 	string;
  email: string;
  refreshToken:	string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) { }

  signup(email: string, password: string) {
    return this.http.post<AuthResponse>(
      //Change to actual Firebase Api Key
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[Api_Key]',
      this.getAuthRequest(email, password))
      .pipe(
        catchError(this.handleError),
        tap( resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(
      //Change to actual Firebase Api Key
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[Api_Key]',
      this.getAuthRequest(email, password))
      .pipe(
        catchError(this.handleError),
        tap( resData => {
          this.handleAuthentication(
            resData.email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );    
  }

  autoLogin() {
    const userData: {
      email: string, 
      id: string, 
      _token: string, 
      _tokenExpirationDate: string 
    } = JSON.parse(localStorage.getItem('userData'));
    
    if (!userData) {
      return;
    }

    // cannot use only JSON.parse to convert to an object because it wouldn't have the token() method defined in User model
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if(loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private getAuthRequest(email: string, password: string) {
    return {
      email: email,
      password: password,
      returnSecureToken: true
    };
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMsg = 'An unknown error ocurred';
    if(!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => errorMsg);
    }
    console.log(errorResponse);
    switch(errorResponse.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'Email does not exist';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Invalid password';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMsg = 'Invalid login credentials';
        break;
      case 'EMAIL_EXISTS':
        errorMsg = 'This email already exists';
        break;
    }
    return throwError(() => errorMsg);
  }
}
 