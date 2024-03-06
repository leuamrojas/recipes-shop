import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.reducer';
import { SetRecipes } from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {

  constructor(
    private http: HttpClient, 
    private recipeService: RecipeService,
    private store: Store<AppState>) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://recipes-shop-5a94b-default-rtdb.firebaseio.com/recipes.json', recipes)
    .subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    // return this.authService.user.pipe(
    return this.store.select('auth').pipe(
      take(1),
      map(state => state.user),
      exhaustMap(user => {
        return this.http.get<Recipe[]>(
          'https://recipes-shop-5a94b-default-rtdb.firebaseio.com/recipes.json',
          {
            params: new HttpParams().set('auth', user.token)
          }
        );
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => this.store.dispatch(new SetRecipes(recipes))
        // this.recipeService.setRecipes(recipes);
      )
    );
  }
}
