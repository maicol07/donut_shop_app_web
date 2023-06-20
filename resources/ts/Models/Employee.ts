import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Contract from '~/Models/Contract';
import Shop from '~/Models/Shop';

export interface EmployeeAttributes extends ModelAttributes {
  fiscalCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  job: string;
  birthDate: Date;
  street: string;
  houseNumber: string;
  city: string;
  state: string;
  zip: string;
  province: string;
}

export interface EmployeeRelations extends ModelRelations {
  contracts: Contract[],
  shops: Shop[]
}

export default class Employee extends Model<EmployeeAttributes, EmployeeRelations> {
  attributesNames = ['fiscalCode', 'firstName', 'lastName' ,'email' ,'phone' , 'job', 'birthDate', 'street', 'houseNumber', 'city' , 'state', 'zip','province'];
  static dates = {
    birthDate: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
  };

  contracts() {
    return this.hasMany(Contract);
  }

  shops(){
    return this.hasMany(Shop)
  }
}
