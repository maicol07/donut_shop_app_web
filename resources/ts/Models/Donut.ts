import Model, {
  ModelAttributes,
  ModelRelations, ModelRelationsPivots
} from '~/Models/Model';
import Ingredient from '~/Models/Ingredient';

export interface DonutAttributes extends ModelAttributes {
  name: string;
  price: number;
  description: string;
}

export interface DonutRelations extends ModelRelations {
  ingredients: Ingredient
}

export interface DonutRelationsPivots extends ModelRelationsPivots {
  ingredients: {
    absolute_quantity: number
  }
}

export default class Donut extends Model<DonutAttributes, DonutRelations> {
  attributesNames = ['name', 'price', 'description'];

  protected static get jsonApiType() {
    return `donuts`;
  }
}
