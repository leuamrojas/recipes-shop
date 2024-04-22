import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  // The entire module (all its declarations) will be put into a separate code bundle
  // which is then downloaded and parsed on demand as soon as the user visits the page (route)
  // make sure to change to an empty path in the corresponding feature module
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule) },
  { path: 'shopping-list', loadChildren: () => import('./shopping-list/shopping-list.module').then(m => m.ShoppingListModule) },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }
  
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
