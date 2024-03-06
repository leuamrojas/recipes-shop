import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../recipe.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs';
import { AddIngredients } from 'src/app/shopping-list/store/shopping-list.actions';
import { DeleteRecipe } from '../store/recipe.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<AppState>) {
  }

  ngOnInit() {
    this.route.params
      .pipe(
        map(params => {
          return +params['id'];
        }),
        switchMap(id => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map(state => {
          return state.recipes.find((recipe, index) => {
            return index === this.id;
          });
        })
      )
      .subscribe(recipe => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new AddIngredients(this.recipe.ingredients)
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }


  // ngOnInit() {
  //   this.route.params
  //     .subscribe(
  //       (params: Params) => {
  //         this.id = +params['id'];
  //         this.recipe = this.recipeService.getRecipe(this.id);
  //       }
  //     );
  // }

  // onAddToShoppingList() {
  //   this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  // }

  // onEditRecipe() {
  //   this.router.navigate(['edit'], {relativeTo: this.route});
  //   // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  // }

  // onDeleteRecipe() {
  //   this.recipeService.deleteRecipe(this.id);
  //   this.router.navigate(['/recipes']); //same as: this.router.navigate(['../'], {relativeTo: this.route});
  // }

}
