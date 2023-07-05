import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Account from '~/Models/Account';
import Company from '~/Models/Company';
import Donut from '~/Models/Donut';

export interface SupplyAttributes extends ModelAttributes {
  startDate: Date;
  endDate: Date;
  orderNumber: string;
}

export interface SupplyRelations extends ModelRelations {
  company: Company,
  dailyReservations: Donut[]
}

export default class Supply extends Model<SupplyAttributes, SupplyRelations> {
  attributesNames = ['startDate', 'endDate', 'companyVatNumber'];
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

  dailyReservation(){
    return this.hasMany(Donut);
  }
}
