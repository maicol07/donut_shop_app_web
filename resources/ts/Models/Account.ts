import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Customer from '~/Models/Customer';
import OnlineSale from '~/Models/OnlineSale';

export interface AccountAttributes extends ModelAttributes {
  username: string;
  fiscalCode: string;
  password: string;
}

export interface AccountRelations extends ModelRelations {
  customer: Customer,
  onlineSales: OnlineSale[]
}

export default class Account extends Model<AccountAttributes, AccountRelations> {
  attributesNames = ['username', 'fiscalCode', 'password'];

  protected static get jsonApiType() {
    return `accounts`;
  }

  //relations
  customer() {
    return this.hasOne(Customer);
  }

  onlineSales(){
    return this.hasMany(OnlineSale)
  }
}
