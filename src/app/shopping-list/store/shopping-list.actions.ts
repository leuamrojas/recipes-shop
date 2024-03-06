import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

// Action names need to be unique through the entire application
export const ADD_INGREDIENT = 'ADD_INGREDIENT';
export const ADD_INGREDIENTS = 'ADD_INGREDIENTS';
export const UPDATE_INGREDIENT = 'UPDATE_INGREDIENT';
export const DELETE_INGREDIENT = 'DELETE_INGREDIENT';
export const START_EDIT = 'START_EDIT';
export const STOP_EDIT = 'STOP_EDIT';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;

    constructor(public payload: Ingredient) { }
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS;

    constructor(public payload: Ingredient[]) { }
}

export class UpdateIngredient implements Action {
    readonly type = UPDATE_INGREDIENT;

    // constructor(public payload: {index: number, newIngredient: Ingredient}) { }
    // we don't need the index anymore because we know the ingredient being edited when action START_EDIT was dispatched
    constructor(public payload: Ingredient) { }
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT;

    // constructor(public payload: number) { }
    // we don't need the index anymore because we know the ingredient being edited when action START_EDIT was dispatched
}

export class StartEdit implements Action {
    readonly type = START_EDIT;

    constructor(public payload: number) { }
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT;
}

export type ShoppingListActions = 
| AddIngredient 
| AddIngredients 
| UpdateIngredient
| DeleteIngredient
| StartEdit
| StopEdit