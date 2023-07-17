import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Shop, {ShopAttributes} from '~/Models/Shop';
import {match} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import Warehouse from '~/Models/Warehouse';
import {SaveResponse} from 'coloquent';
import {PageAttributes} from '~/Page';

export default class Shops extends RecordsPage<Shop> {
  modelType = Shop;
  formState = {
    address: Stream(''),
    warehouses: Stream('')
  }
  warehouses: Warehouse[] | undefined
  with = ['warehouses'];

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Warehouse, 'warehouses');
  }

  loadEditDialog(record: Shop) {
    super.loadEditDialog(record);
    this.formState.warehouses(record.getRelation('warehouses')?.[0]?.getId() ?? '')
  }

  tableColumns(): Collection<Child> {
    return collect({
      address: <DataTableColumn filterable sortable>Address</DataTableColumn>,
      warehouses: <DataTableColumn filterable sortable>Warehouses</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof ShopAttributes, value: ValueOf<ShopAttributes>, record: Shop) {
    return match(name)
      .with('warehouses', () => {
        return record.getRelation('warehouses')?.map((warehouse) => `${warehouse.getAttribute('name')}`)
      })
      .otherwise(() => super.attributeMap(name,  value, record))
  }

  formContents(): Mithril.Children {
    if (this.openDialog && this.warehouses?.length === 0) {
      Warehouse.all().then((response) => {
        this.warehouses = response.getData();
        m.redraw();
      })
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-text-field name="address" label="Address" error-text={this.errors.address?.[0]} error={'address' in this.errors}/>
        <md-outlined-select name="warehouses" label="Warehouses">
          {this.warehouses?.map((warehouse) => {
              return (
                <md-select-option value={warehouse.getId()} headline={warehouse.getAttribute('name')}
                selected={this.formState.warehouses() === warehouse.getId()}/>
              )
            }
          )}
        </md-outlined-select>
      </div>
    )
  }

  async saveRelations(record: Shop, event: FormSubmitEvent) {
  }

  // @ts-ignore
  async afterSave(record: Shop, response: SaveResponse<Shop>, event: FormSubmitEvent): Promise<void> {
    const warehouse = this.warehouses?.find(warehouse => warehouse.getId() == this.formState.warehouses());

    if(warehouse){
      record.setRelation('warehouses', [warehouse])
      await record.save();
    }

    await super.afterSave(record, response, event);
  }

}
