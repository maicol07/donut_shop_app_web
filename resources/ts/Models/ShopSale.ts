import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Company from '~/Models/Company';
import Contract from '~/Models/Contract';
import Sale from '~/Models/Sale';

export interface ShopSaleAttributes extends ModelAttributes {
  name: string;
  address: string;
}

export interface ShopSaleRelations extends ModelRelations {
  sale: Sale[]
}

export default class ShopSale extends Model<ShopSaleAttributes, ShopSaleRelations> {
  attributesNames: (keyof ShopSaleAttributes)[] = ['name', 'address'];

  sale() {
    return this.hasOne(Sale);
  }
}
