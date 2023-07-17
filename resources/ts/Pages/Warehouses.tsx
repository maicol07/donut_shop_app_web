import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Warehouse, {WarehouseAttributes} from '~/Models/Warehouse';
import {match} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';

export default class Warehouses extends RecordsPage<Warehouse> {
  modelType = Warehouse;
  formState = {
    name: Stream(''),
    address: Stream(''),
  }

  loadEditDialog(record: Warehouse) {
    super.loadEditDialog(record);
    // this.formState.startTime(dayjs(record.getAttribute('startTime')).format('HH:MM'));
    // this.formState.endTime(dayjs(record.getAttribute('endTime')).format('HH:MM'));
  }

  //TODO nella home, se c'è tempo, mettiamo che puoi aggiungere ingredient + quantità.
  // è abbastanza importante in effetti, sarebbe da fare quasi come prima

  tableColumns(): Collection<Child> {
    return collect({

      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      address: <DataTableColumn filterable sortable>Address</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof WarehouseAttributes, value: ValueOf<WarehouseAttributes>, record: Warehouse) {
    return match(name)
      .otherwise(() => super.attributeMap(name,  value, record))
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-text-field name="name" label="Name" error-text={this.errors.name?.[0]} error={'name' in this.errors}/>
        <md-filled-text-field name="address" label="Address" error-text={this.errors.address?.[0]} error={'address' in this.errors}/>
      </div>
    )
  }
  async saveRelations(record: Warehouse, event: FormSubmitEvent) {
  }

}
