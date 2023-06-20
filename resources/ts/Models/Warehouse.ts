import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Company from '~/Models/Company';
import Contract from '~/Models/Contract';
import Donut from '~/Models/Donut';
import Discount from '~/Models/Discount';
import Ingredient from '~/Models/Ingredient';
import Shop from '~/Models/Shop';

export interface WarehouseAttributes extends ModelAttributes {
  name: number;
  address: string;
}

export interface WarehouseRelations extends ModelRelations {
  shops: Shop[];
  ingredients: Ingredient[];
}

export default class Warehouse extends Model<WarehouseAttributes, WarehouseRelations> {
  attributesNames: (keyof WarehouseAttributes)[] = ['name', 'address'];

  shops() {
    return this.hasMany(Shop);
  }

  ingredients() {
    return this.hasMany(Ingredient);
  }
}
