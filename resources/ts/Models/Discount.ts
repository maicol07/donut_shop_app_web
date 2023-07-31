import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Donut from '~/Models/Donut';
import Tariff from '~/Models/Tariff';

export interface DiscountAttributes extends ModelAttributes {
  discountName: string;
  startDate: Date;
  endDate: Date;
}

export interface DiscountRelations extends ModelRelations {
  donuts: Donut[],
  tariffs: Tariff[]
}

export default class Discount extends Model<DiscountAttributes, DiscountRelations> {
  attributesNames = ['discountName', 'startDate', 'endDate'];

  donuts() {
    return this.hasMany(Donut);
  }

  tariffs() {
    return this.hasMany(Tariff);
  }
}
