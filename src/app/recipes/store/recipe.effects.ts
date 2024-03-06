import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import { FETCH_RECIPES, STORE_RECIPES, SetRecipes } from './recipe.actions';
import { AppState } from 'src/app/store/app.reducer';

@Injectable()
export class RecipeEffects {

  fetchRecipes = createEffect(() => 
    this.actions$.pipe(
        ofType(FETCH_RECIPES),
        switchMap(() => {
            return this.http.get<Recipe[]>(
                'https://recipes-shop-5a94b-default-rtdb.firebaseio.com/recipes.json'
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
        map(recipes => new SetRecipes(recipes))
    )
  );

  storeRecipes = createEffect(() => 
    this.actions$.pipe(
        ofType(STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
            return this.http.put(
                'https://recipes-shop-5a94b-default-rtdb.firebaseio.com/recipes.json',
                recipesState.recipes
            );
        })
    ),
    {dispatch: false}
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<AppState>
  ) {}
}
