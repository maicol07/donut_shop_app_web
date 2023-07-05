import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Shop from '~/Models/Shop';
import Supply from '~/Models/Supply';
import OnlineSale from '~/Models/OnlineSale';
import ShopSale from '~/Models/ShopSale';

export interface SaleAttributes extends ModelAttributes {
  date: Date;
}

export interface SaleRelations extends ModelRelations {
  shop: Shop,
  supply: Supply;
  onlineSale: OnlineSale;
  shopSale: ShopSale;
}

export default class Sale extends Model<SaleAttributes, SaleRelations> {
  attributesNames = ['date', 'shopId', 'supplyId'];
  static dates = {
    ...Model.dates,
    date: 'YYYY-MM-DDTHH:mm:ss.ssssssZ'
  };

  shop() {
    return this.hasOne(Shop);
  }

  supply() {
    return this.hasOne(Supply);
  }

  onlineSale() {
    return this.hasOne(OnlineSale);
  }

  shopSale() {
    return this.hasOne(ShopSale);
  }
}
