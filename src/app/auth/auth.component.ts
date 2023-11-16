import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponse, AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;

constructor(private authService: AuthService, private router: Router) {}  

  private closeSub: Subscription;  

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponse>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    this.closeSub = authObs.subscribe(
    {
      next: data => {
        console.log(data);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      }, 
      error: errorMsg => {
        console.log(errorMsg);
        this.error = errorMsg;
        this.isLoading = false;
      }
    });

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
  
  ngOnDestroy(): void {
    if (this.closeSub){
      this.closeSub.unsubscribe();
    }      
  }
}
