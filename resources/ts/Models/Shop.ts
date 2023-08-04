import Model, {ModelAttributes, ModelRelations} from '~/Models/Model';
import Employee from '~/Models/Employee';
import Contract from '~/Models/Contract';
import Donut from '~/Models/Donut';
import Warehouse from '~/Models/Warehouse';

export interface ShopAttributes extends ModelAttributes {
  address: string;
}

export interface ShopRelations extends ModelRelations {
  employees: Employee[],
  contracts: Contract[],
  donuts: Donut[],
  warehouses: Warehouse[]
}

export default class Shop extends Model<ShopAttributes, ShopRelations> {
  attributesNames = ['address'];

  employees() {
    return this.hasMany(Employee);
  }

  contracts(){
    return this.hasMany(Contract);
  }

  donuts(){
    return this.hasMany(Donut);
  }

  warehouses(){
    return this.hasMany(Warehouse);
  }

}
