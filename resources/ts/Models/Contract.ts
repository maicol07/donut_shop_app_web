import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Employee from '~/Models/Employee';
import Shop from '~/Models/Shop';
import Shift from '~/Models/Shift';

export interface ContractAttributes extends ModelAttributes {
  salary: number;
  startDate: Date;
  endDate: Date;
  'type': string;
}

export interface ContractRelations extends ModelRelations {
  shifts: Shift[],
  employee: Employee[],
  shops: Shop[]
}

export default class Contract extends Model<ContractAttributes, ContractRelations> {
  attributesNames = ['salary', 'startDate', 'endDate', 'type'];
  static dates = {
    ...Model.dates,
    startDate: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
    endDate: 'YYYY-MM-DDTHH:mm:ss.ssssssZ'
  };

  shops() {
    return this.hasMany(Shop);
  }
  employee(){
    return this.hasMany(Employee)
  }
  shifts(){
    return this.hasMany(Shift)
  }
}
