import RecordsPage from '~/Pages/template/RecordsPage';
import {Child, Children, Vnode} from 'mithril';
import {collect, Collection} from 'collect.js';
import {match} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import Donut from '~/Models/Donut';
import Discount from '~/Models/Discount';
import Tariff, {TariffAttributes} from '~/Models/Tariff';
import {PageAttributes} from '~/Page';

export default class Tariffs extends RecordsPage<Tariff> {
  modelType = Tariff;
  formState = {
    quantity: Stream(''),
    percentageDiscount: Stream(''),
    donut: Stream(''),
    discount: Stream(''),
  }
  donuts: Donut[] | undefined;
  discounts: Discount[] | undefined;
  with = ['donut', 'discount'];

  async oninit(vnode: Vnode<PageAttributes, this>) {
    await super.oninit(vnode);
    await this.fetchRecords(Donut, 'donuts');
    await this.fetchRecords(Discount, 'discounts');
  }

  loadEditDialog(record: Tariff) {
    super.loadEditDialog(record);
    this.formState.donut(record.getRelation('donut')?.getId() ?? '');
    this.formState.discount(record.getRelation('discount')?.getId() ?? '');
  }

  tableColumns(): Collection<Child> {
    return collect({
      donut: <DataTableColumn filterable sortable>Donut</DataTableColumn>,
      discount: <DataTableColumn filterable sortable>Discount</DataTableColumn>,
      quantity: <DataTableColumn filterable sortable>Quantity</DataTableColumn>,
      percentageDiscount: <DataTableColumn filterable sortable>Percentage discount</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof TariffAttributes, value: ValueOf<TariffAttributes>, record: Tariff) {
    return match(name)
      .with('percentageDiscount', () => `${value}%`)
      .with('donut', () => record.getRelation('donut')?.getAttribute('name') ?? '')
      .with('discount', () => record.getRelation('discount')?.getAttribute('discountName') ?? '')
      .otherwise(() => super.attributeMap(name,  value, record))
  }

  formContents(): Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-select name="donut" label="Donut" error={'donut' in this.errors} error-text={this.errors.donut?.[0]}>
          {this.donuts?.map((donut) => (
            <md-select-option value={donut.getId()} headline={donut.getAttribute('name')}
                              selected={this.formState.donut() == donut.getId()}/>
          ))}
        </md-filled-select>
        <md-filled-select name="discount" label="Discount" error={'discount' in this.errors} error-text={this.errors.discount?.[0]}>
          {this.discounts?.map((discount) => (
            <md-select-option value={discount.getId()} headline={discount.getAttribute('discountName')}
                              selected={this.formState.discount() == discount.getId()}/>
          ))}
        </md-filled-select>
        <md-filled-text-field name="quantity" type="number" label="Quantity" error-text={this.errors.quantity?.[0]} error={'quantity' in this.errors}/>
        <md-filled-text-field name="percentageDiscount" type="number" label="Percentage discount" suffix-text="%" error-text={this.errors.percentageDiscount?.[0]} error={'percentageDiscount' in this.errors}/>
      </div>
    )
  }

  async saveRelations(record: Tariff, event: FormSubmitEvent) {
    const donut = this.donuts?.find(donut => donut.getId() == this.formState.donut());
    const discount = this.discounts?.find(discount => discount.getId() == this.formState.discount());

    record.setRelation('donut', donut);
    record.setRelation('discount', discount);
  }

  // @ts-ignore
  // async afterSave(record: Tariff, response: SaveResponse<Shop>, event: FormSubmitEvent): Promise<void> {
  //   const warehouse = this.warehouses?.find(warehouse => warehouse.getId() == this.formState.warehouses());
  //
  //   if(warehouse){
  //     record.setRelation('warehouses', [warehouse])
  //     await record.save();
  //   }
  //
  //   await super.afterSave(record, response, event);
  // }

}
