import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Company from '~/Models/Company';

export interface CustomerAttributes extends ModelAttributes {
  name: string;
  surname: string;
  fiscalCode: string;
  birthDate: string;
  street: string;
  houseNumber: string;
  cap: string;
  city: string;
  province: string;
  email: string;
}

export interface CustomerRelations extends ModelRelations {
  company: Company
}

export default class Customer extends Model<CustomerAttributes, CustomerRelations> {
  attributesNames = ['name', 'surname', 'fiscalCode', 'birthDate', 'street', 'houseNumber', 'cap', 'city', 'province', 'email'];

  company() {
    return this.hasOne(Company);
  }
}
