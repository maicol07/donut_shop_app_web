import Model, {ModelAttributes, ModelPivots, ModelRelations} from '~/Models/Model';
import Ingredient from '~/Models/Ingredient';

export interface DonutAttributes extends ModelAttributes {
  name: string;
  price: number;
  description: string;
}

export interface DonutRelations extends ModelRelations {
  ingredients: Ingredient[]
}

export interface DonutPivots extends ModelPivots {
  quantity: number; // Used with supplies (daily reservations)
}

export default class Donut extends Model<DonutAttributes, DonutRelations, DonutPivots> {
  attributesNames = ['name', 'price', 'description'];

  protected static get jsonApiType() {
    return `donuts`;
  }

  ingredients() {
    return this.hasMany(Ingredient);
  }
}
