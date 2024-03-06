import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { AddRecipe, UpdateRecipe } from '../store/recipe.actions';
import { Subscription, map } from 'rxjs';
import { Ingredient } from 'src/app/shared/ingredient.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  private storeSub: Subscription;

  get ingredientsControls() {
    return (this.recipeForm.get('ingredients') as FormArray).controls
  }

  constructor(
    private route: ActivatedRoute,              
    private router: Router,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    //Not required since the value of our form has exactly the format of our Recipe model (and same names)
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);

    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(
        new UpdateRecipe({
          index: this.id,
          newRecipe: this.recipeForm.value
        })
      );

    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new AddRecipe(this.recipeForm.value));

    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {
    // The new route is based on how routes are configured in recipse-routing.module.ts:
    // If I'm on recipe-edit (edit mode), it will take me back to recipe-detail (RecipeDetailComponent child)
    // If I'm on recipe-edit (add mode), it will take me back to recipes start (RecipeStartComponent child)
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  ngOnDestroy() {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map(state => {
            return state.recipes.find((recipe, index) => {
              return index === this.id;
            });
          })
        )
        .subscribe(recipe => {
          recipeName = recipe.name;
          recipeImagePath = recipe.imagePath;
          recipeDescription = recipe.description;
          if (recipe['ingredients']) {
            this.populateIngredientsControls(recipeIngredients, recipe.ingredients);
            // for (let ingredient of recipe.ingredients) {
            //   recipeIngredients.push(
            //     new FormGroup({
            //       name: new FormControl(ingredient.name, Validators.required),
            //       amount: new FormControl(ingredient.amount, [
            //         Validators.required,
            //         Validators.pattern(/^[1-9]+[0-9]*$/)
            //       ])
            //     })
            //   );
            // }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients
    });
  }

  private populateIngredientsControls(ingredientsFormArray: FormArray, ingredients: Ingredient[]) {
    for (let ingredient of ingredients) {
      ingredientsFormArray.push(
        new FormGroup({
          name: new FormControl(ingredient.name, Validators.required),
          amount: new FormControl(ingredient.amount, [
            Validators.required,
            Validators.pattern(/^[1-9]+[0-9]*$/)
          ])
        })
      );
    }
  }

  // private initForm() {
  //   let recipeName = '';
  //   let recipeImagePath = '';
  //   let recipeDescription = '';
  //   let recipeIngredients = new FormArray([]);

  //   if (this.editMode) {
  //     const recipe = this.recipeService.getRecipe(this.id);
  //     recipeName = recipe.name;
  //     recipeImagePath = recipe.imagePath;
  //     recipeDescription = recipe.description;
  //     if (recipe['ingredients']) {
  //       for (let ingredient of recipe.ingredients) {
  //         recipeIngredients.push(
  //           new FormGroup({
  //             'name': new FormControl(ingredient.name, Validators.required),
  //             'amount': new FormControl(ingredient.amount, [
  //               Validators.required,
  //               Validators.pattern(/^[1-9]+[0-9]*$/)
  //             ])
  //           })
  //         );
  //       }
  //     }
  //   }

  //   this.recipeForm = new FormGroup({
  //     'name': new FormControl(recipeName, Validators.required),
  //     'imagePath': new FormControl(recipeImagePath, Validators.required),
  //     'description': new FormControl(recipeDescription, Validators.required),
  //     'ingredients': recipeIngredients
  //   });
  // }

}
