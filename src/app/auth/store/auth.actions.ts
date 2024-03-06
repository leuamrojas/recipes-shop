import { Action } from "@ngrx/store";

// Action names need to be unique through the entire application
export const LOGIN_START = 'LOGIN_START';
export const AUTHENTICATE_SUCCESS = 'AUTHENTICATE_SUCCESS';
export const AUTHENTICATE_FAIL = 'AUTHENTICATE_FAIL';
export const LOGOUT = 'LOGOUT';
export const SIGNUP_START = 'SIGNUP_START';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const AUTO_LOGIN = 'AUTO_LOGIN';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: 
        {
            email: string, 
            userId: string, 
            token: string, 
            expirationDate: Date,
            redirect: boolean;
        }
    ) {
        // payload.redirect = true; // This will be set to false in AutoLogin to avoid redirect
    }
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

// Used in auth effects
export class LoginStart implements Action {
    readonly type = LOGIN_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;
  
    constructor(public payload: string) {}
}
  
export class SignupStart implements Action {
    readonly type = SIGNUP_START;

    constructor(public payload: { email: string, password: string }) {}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}
  
export class AutoLogin implements Action {
readonly type = AUTO_LOGIN;
}  

//Alternative syntax
// export const LoginStart = createAction(
//     LOGIN_START,
//     props<{ email: string; password: string }>()
//   );  

export type AuthActions = 
    | AuthenticateSuccess 
    | Logout 
    | LoginStart 
    | AuthenticateFail 
    | SignupStart
    | ClearError 
    | AutoLogin