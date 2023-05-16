import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';

export interface IngredientAttributes extends ModelAttributes {
  name: string;
  allergen: boolean;
}

export interface IngredientRelations extends ModelRelations {
  // notifications: DatabaseNotifications
}

export default class Ingredient extends Model<IngredientAttributes, IngredientRelations> {
  attributesNames = ['name', 'allergen'];
}
