import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // take(1) listens into the user only once and then not care about it anymore unless the guard is run again 
        // (avoids re-running the logic in the guard)
        // take(1) unsubscribes automatically
        return this.authService.user.pipe(
            take(1),
            map(user => {
                const isAuth = !!user;
                return isAuth ? true : this.router.createUrlTree(['/auth']);  // [1]               
            })
        )

        // Mosh Hamedani Course - Check video Angular Part 1 - 9:45:00
        // After logging in, return the user to the url he tried to navigate to:
        // (This could replace the false condition in [1])
        // this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
        // return false;
        // Then in the login component, after successful login:
        // let returnUrl = this.route.snapshot.queryParams.get('returnUrl);
        // this.router.navigate([returnUrl || '/']);

        // 
    }
}