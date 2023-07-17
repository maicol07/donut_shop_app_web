import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import {match, P} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import Discount, {DiscountAttributes} from '~/Models/Discount';
import dayjs from 'dayjs';


export default class Discounts extends RecordsPage<Discount> {
  modelType = Discount;
  formState = {
    discountName: Stream(''),
    startDate: Stream(''),
    endDate: Stream('')
  }

  attributeMap(name: keyof DiscountAttributes, value: ValueOf<DiscountAttributes>, record: Discount) {
    return match(name)
      .with(P.union("startDate", "endDate"), () => dayjs(value as Date).format('DD/MM/YYYY'))
      .otherwise(() => super.attributeMap(name, value, record));
  }

  tableColumns(): Collection<Child> {
    return collect({
      discountName:  <DataTableColumn filterable sortable>Discount Name</DataTableColumn>,
      startDate:  <DataTableColumn filterable sortable>Start Date</DataTableColumn>,
      endDate: <DataTableColumn filterable sortable>End Date</DataTableColumn>,
    });
  }

  loadEditDialog(record: Discount) {
    super.loadEditDialog(record);
    this.formState.startDate(dayjs(record.getAttribute('startDate')).format('YYYY-MM-DD'));
    this.formState.endDate(dayjs(record.getAttribute('endDate')).format('YYYY-MM-DD'));
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="discountName" label="Discount Name" error-text={this.errors.discountName?.[0]} error={'discountName' in this.errors} />
        <md-filled-text-field name="startDate" type="date" label="Start Date" error-text={this.errors.startDate?.[0]} error={'startDate' in this.errors} />
        <md-filled-text-field name="endDate" type="date" label="End Date" error-text={this.errors.endDate?.[0]} error={'endDate' in this.errors}/>
      </div>
    )
  }

  async saveRelations(record: Discount){
    record.setRelation('donuts', [])
  }
}
