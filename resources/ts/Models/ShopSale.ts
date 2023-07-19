import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Sale from '~/Models/Sale';

export interface ShopSaleAttributes extends ModelAttributes {
  name: string;
  address: string;
}

export interface ShopSaleRelations extends ModelRelations {
  sale: Sale
}

export default class ShopSale extends Model<ShopSaleAttributes, ShopSaleRelations> {
  attributesNames: (keyof ShopSaleAttributes)[] = ['name', 'address'];

  protected static get jsonApiType() {
    return 'shop-sales';
  }

  sale() {
    return this.hasOne(Sale);
  }
}
