import { Ingredient } from "../../shared/ingredient.model";
import { 
    ShoppingListActions, 
    ADD_INGREDIENT, 
    ADD_INGREDIENTS, 
    DELETE_INGREDIENT, 
    START_EDIT, 
    UPDATE_INGREDIENT, 
    STOP_EDIT} from './shopping-list.actions';

// We identify the state by looking at the data (e.g. in service) that we use in other parts of the app
export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient,
    editedIngredientIndex: number
}

const initialState: State = {
    ingredients: [
        new Ingredient('Apples', 5),
        new Ingredient('Tomatoes', 10),
    ],
    editedIngredient: null,
    editedIngredientIndex: -1 // It's not 0 because it would be a valid index
};

export function shoppingListReducer(state: State = initialState, action: ShoppingListActions) {
    switch(action.type) {
        case ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };

        case ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };

        case UPDATE_INGREDIENT:

            //IMPORTANT: If you need to edit something inside of the state, copy it first and then edit the copy
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updatedIngredient = {
                ...ingredient, //copy the old state/item (to keep things like an 'id' that doesn't need to be overwritten)
                ...action.payload //ovewrites what needs to be overwritten
                // ...action.payload.newIngredient //ovewrites what needs to be overwritten
            };
            const updatedIngredients = [...state.ingredients]; //copy of the old ingredients array
            updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

            return {
                ...state,
                ingredients: updatedIngredients,
                editedIngredient: null,
                editedIngredientIndex: -1
            };

        case DELETE_INGREDIENT:
            return {
                ...state,
                ingredients: state.ingredients.filter((elem, idx) => {
                    return idx !== state.editedIngredientIndex;
                    // return idx !== action.payload;
                }),
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        case START_EDIT:
            return {
                ...state,
                editedIngredientIndex: action.payload,
                editedIngredient: { ...state.ingredients[action.payload] } //creates a new object
            };
        case STOP_EDIT:
            return {
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state;
    }
}