import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner/loading-spinner.component';
import { DropdownDirective } from './dropdown.directive';

// We use exports because we don't want to use these components in the shared module but import the shared module into other modules
@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    DropdownDirective,
    CommonModule
  ]
})
export class SharedModule { }
