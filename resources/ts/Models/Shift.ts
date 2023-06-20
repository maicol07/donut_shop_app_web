import Model, {
  ModelAttributes,
  ModelRelations
} from '~/Models/Model';
import Company from '~/Models/Company';
import Contract from '~/Models/Contract';

export interface ShiftAttributes extends ModelAttributes {
  weekDay: string;
  startTime: Date;
  endTime: Date;
}

export interface ShiftRelations extends ModelRelations {
  contract: Contract[]
}

export default class Shift extends Model<ShiftAttributes, ShiftRelations> {
  attributesNames: (keyof ShiftAttributes)[] = ['weekDay', 'startTime', 'endTime'];
  static dates = {
    startTime: 'YYYY-MM-DDTHH:mm:ss.ssssssZ',
    endTime: 'YYYY-MM-DDTHH:mm:ss.ssssssZ'
  };

  contract() {
    return this.hasOne(Contract);
  }
}
