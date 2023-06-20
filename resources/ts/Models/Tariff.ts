import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Company from '~/Models/Company';
import Contract from '~/Models/Contract';
import Donut from '~/Models/Donut';
import Discount from '~/Models/Discount';

export interface TariffAttributes extends ModelAttributes {
  quantity: number;
}

export interface TariffRelations extends ModelRelations {
  donut: Donut;
  discount: Discount;
}

export default class Tariff extends Model<TariffAttributes, TariffRelations> {
  attributesNames: (keyof TariffAttributes)[] = ['quantity'];

  donut() {
    return this.hasOne(Donut);
  }

  discount() {
    return this.hasOne(Discount);
  }
}
