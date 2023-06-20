import Model, {
  ModelAttributes,
  ModelPivots,
  ModelRelations
} from '~/Models/Model';
import Customer from '~/Models/Customer';
import Supply from '~/Models/Supply';

export interface CompanyAttributes extends ModelAttributes {
  name: string;
  vatNumber: boolean;
}

export interface CompanyRelations extends ModelRelations {
  supplies: Supply[]
  customers: Customer[]
}

export default class Company extends Model<CompanyAttributes, CompanyRelations> {
  attributesNames = ['name', 'vatNumber'];

  static get jsonApiType() {
    return 'companies';
  }

  supplies() {
    return this.hasMany<Supply>(Supply);
  }

  customers() {
    return this.hasMany<Customer>(Customer);
  }
}
