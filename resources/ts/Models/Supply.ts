import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Company from '~/Models/Company';
import Donut from '~/Models/Donut';

export interface SupplyAttributes extends ModelAttributes {
  startDate: Date;
  endDate: Date;
}

export interface SupplyRelations extends ModelRelations {
  company: Company,
  donuts: Donut[] // DailyReservations
}

export default class Supply extends Model<SupplyAttributes, SupplyRelations> {
  attributesNames = ['startDate', 'endDate'];
  static dates = {
    startDate: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
    endDate: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
  };

  static get jsonApiType() {
    return 'supplies';
  }

  company() {
    return this.hasOne(Company);
  }

  donuts(){
    return this.hasMany(Donut);
  }
}
