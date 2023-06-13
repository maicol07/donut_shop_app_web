import Model, {
  ModelAttributes,
  ModelPivots,
  ModelRelations
} from '~/Models/Model';

export interface IngredientAttributes extends ModelAttributes {
  name: string;
  allergen: boolean;
}

export interface IngredientRelations extends ModelRelations {
  // notifications: DatabaseNotifications
}

export interface IngredientPivots extends ModelPivots {
  absolute_quantity: number
}

export default class Ingredient extends Model<IngredientAttributes, IngredientRelations, IngredientPivots> {
  attributesNames = ['name', 'allergen'];
}
