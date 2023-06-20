import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Ingredient from '~/Models/Ingredient';
import Donut from '~/Models/Donut';

export interface DiscountAttributes extends ModelAttributes {
  discountName: string;
  startDate: Date;
  endDate: Date;
}

export interface DiscountRelations extends ModelRelations {
  donuts: Donut[]
}

export default class Discount extends Model<DiscountAttributes, DiscountRelations> {
  attributesNames = ['discountName', 'startDate', 'endDate'];

  donuts() {
    return this.hasMany(Donut);
  }
}
