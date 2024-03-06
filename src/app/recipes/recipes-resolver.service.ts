import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Recipe } from './recipe.model';
import { map, of, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { Actions, ofType } from '@ngrx/effects';
import { FetchRecipes, SET_RECIPES } from './store/recipe.actions';

@Injectable({
  providedIn: 'root'
})
export class RecipesResolverService implements Resolve<Recipe[]>{

  constructor(private store: Store<AppState>, private actions$: Actions) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // return this.dataStorageService.fetchRecipes();
    return this.store.select('recipes').pipe(
      take(1),
      map(recipesState => {
        return recipesState.recipes;
      }),
      switchMap(recipes => {
        if (recipes.length === 0) {
          this.store.dispatch(new FetchRecipes()); // We use the already defined effect in RecipeEffects
          // Now listen to specific action so we know when recipes are there (setRecipes is dispatched from fetchRecipes effect)
          return this.actions$.pipe( 
            ofType(SET_RECIPES),
            take(1)
          );
        } else {
          return of(recipes);
        }
      })
    );
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
  //   const recipes = this.recipeService.getRecipes();

  //   if(recipes.length === 0) {
  //     return this.dataStorageService.fetchRecipes();
  //   } else {
  //     return recipes;
  //   }    
  // }
}
