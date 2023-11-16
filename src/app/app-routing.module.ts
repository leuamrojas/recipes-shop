import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // Routes moved to recipes routing module
  // { path: 'recipes', component: RecipesComponent, canActivate: [AuthGuard], children: [
  //   { path: '', component: RecipeStartComponent },
  //   { path: 'new', component: RecipeEditComponent },
  //   { path: ':id', component: RecipeDetailComponent, resolve: [RecipesResolverService] },
  //   { path: ':id/edit', component: RecipeEditComponent, resolve: [RecipesResolverService] },
  // ] },
  // Route moved to shopping-list module
  // { path: 'shopping-list', component: ShoppingListComponent },
  // Route moved to auth module
  // { path: 'auth', component: AuthComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
