import Model, {ModelAttributes, ModelPivots, ModelRelations} from '~/Models/Model';
import Ingredient from '~/Models/Ingredient';
import Sale from '~/Models/Sale';
import Tariff from '~/Models/Tariff';

export interface DonutAttributes extends ModelAttributes {
  name: string;
  price: number;
  description: string;
}

export interface DonutRelations extends ModelRelations {
  ingredients: Ingredient[];
  sales: Sale[];
  tariffs: Tariff[];
}

export interface DonutPivots extends ModelPivots {
  quantity: number; // Used with supplies (daily reservations) and sales (purchases)
}

export default class Donut extends Model<DonutAttributes, DonutRelations, DonutPivots> {
  attributesNames = ['name', 'price', 'description'];

  protected static get jsonApiType() {
    return `donuts`;
  }

  ingredients() {
    return this.hasMany(Ingredient);
  }

  sales() {
    return this.hasMany(Sale);
  }

  tariffs() {
    return this.hasMany(Tariff);
  }
}
