import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Account from '~/Models/Account';
import Shop from '~/Models/Shop';
import Supply from '~/Models/Supply';

export interface SaleAttributes extends ModelAttributes {
  date: Date;
  shopId: string;
  supplyId: string;
}

export interface SaleRelations extends ModelRelations {
  shop: Shop,
  supply: Supply
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

  supply(){
    return this.hasOne(Supply);
  }
}
