import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Donut from '~/Models/Donut';
import Discount from '~/Models/Discount';

export interface TariffAttributes extends ModelAttributes {
  quantity: number;
  percentageDiscount: number;
}

export interface TariffRelations extends ModelRelations {
  donut: Donut;
  discount: Discount;
}

export default class Tariff extends Model<TariffAttributes, TariffRelations> {
  attributesNames: (keyof TariffAttributes)[] = ['quantity', 'percentageDiscount'];

  donut() {
    return this.hasOne(Donut);
  }

  discount() {
    return this.hasOne(Discount);
  }
}
