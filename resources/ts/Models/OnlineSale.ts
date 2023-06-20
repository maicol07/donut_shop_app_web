import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Account from '~/Models/Account';
import Sale from '~/Models/Sale';

export interface OnlineSaleAttributes extends ModelAttributes {
  'type': string;
  username: string;
}

export interface OnlineSaleRelations extends ModelRelations {
  account: Account,
  sale: Sale
}

export default class OnlineSale extends Model<OnlineSaleAttributes, OnlineSaleRelations> {
  attributesNames = ['type', 'username'];

  sale() {
    return this.hasOne(Sale);
  }

  account(){
    return this.hasOne(Account);
  }
}
