import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([ // don't need to export the Router. That's only when you have a separate rounting module (e.g recipes-routing.module)
      { path: 'shopping-list', component: ShoppingListComponent },
    ]),
    SharedModule
  ]
})
export class ShoppingListModule { }
