import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Ingredient from '~/Models/Ingredient';
import {ToManyRelation} from 'coloquent';

export interface DonutAttributes extends ModelAttributes {
  name: string;
  price: number;
  description: string;
}

export interface DonutRelations extends ModelRelations {
  ingredients: Ingredient[]
}

export default class Donut extends Model<DonutAttributes, DonutRelations> {
  attributesNames = ['name', 'price', 'description'];

  protected static get jsonApiType() {
    return `donuts`;
  }

  ingredients() {
    return new ToManyRelation(Ingredient);
  }
}
