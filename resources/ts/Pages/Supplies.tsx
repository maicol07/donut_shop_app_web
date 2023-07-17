import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import RecordsPage from '~/Pages/template/RecordsPage';
import {collect, Collection} from 'collect.js';
import Stream from 'mithril/stream';
import DataTableColumn from '~/Components/DataTableColumn';
import Mithril, {Child, Children} from 'mithril';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {ValueOf} from 'type-fest';
import {match} from 'ts-pattern';
import Company from '~/Models/Company';
import MdIcon from '~/Components/MdIcon';
import {mdiCalendarEndOutline, mdiCalendarStartOutline, mdiOfficeBuilding} from '@mdi/js';
import Supply, {SupplyAttributes} from '~/Models/Supply';
import {PageAttributes} from '~/Page';
import dayjs from 'dayjs';
import {SaveResponse} from 'coloquent';
import Donut from '~/Models/Donut';
import {DataTable} from '@maicol07/material-web-additions/data-table/lib/data-table';

export default class Supplies extends RecordsPage<Supply> {
  modelType = Supply;
  formState = {
    startDate: Stream(''),
    endDate: Stream(''),
    company: Stream('')
  }
  companies: Company[] | undefined;
  donuts: Donut[] | undefined;
  with = ['company', 'donuts'];

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Company, 'companies');
    await this.fetchRecords(Donut, 'donuts');
  }

  tableColumns(): Collection<Child> {
    return collect({
      id: <DataTableColumn filterable sortable>Order number</DataTableColumn>,
      startDate: <DataTableColumn filterable sortable>Start Date</DataTableColumn>,
      endDate: <DataTableColumn filterable sortable>End Date</DataTableColumn>,
      company: <DataTableColumn filterable sortable>Company</DataTableColumn>,
      donuts: <DataTableColumn filterable sortable>Donuts</DataTableColumn>,
    })
  }

  attributeMap(name: keyof SupplyAttributes, value: ValueOf<SupplyAttributes>, record: Supply) {
    const company = record.getRelation('company');
    return match(name)
      .with("startDate", () => value ? (value as Date).toLocaleDateString() : undefined)
      .with("endDate", () => value ? (value as Date).toLocaleDateString() : undefined)
      .with("company", () => company ? `${company.getAttribute('name')} (${company.getAttribute('vatNumber')})` : undefined)
      .with("donuts", () => { return record.getRelation('donuts')?.map((donut) => `${donut.getAttribute('name')} x${donut.getPivot('quantity')}`).join(', ') ?? '' })
      .otherwise(() => super.attributeMap(name, value, record));
  }

  loadEditDialog(record: Supply) {
    super.loadEditDialog(record);
    this.formState.startDate(dayjs(record.getAttribute('startDate')).format('YYYY-MM-DD'));
    this.formState.endDate(dayjs(record.getAttribute('endDate')).format('YYYY-MM-DD'));
    this.formState.company(record.getRelation('company')?.getId() ?? '');
  }

  formContents(): Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="startDate" label="Start Date" error-text={this.errors.startDate?.[0]} error={'startDate' in this.errors}
                              type="date">
          <MdIcon icon={mdiCalendarStartOutline} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-text-field name="endDate" label="End Date" error-text={this.errors.endDate?.[0]} error={'endDate' in this.errors}
                              type="date">
          <MdIcon icon={mdiCalendarEndOutline} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-select name="company"
                          label="Company"
                          error-text={this.errors.company?.[0]}
                          error={'company' in this.errors}
        >
          <MdIcon icon={mdiOfficeBuilding} slot="leadingicon"/>
          {this.companies?.map((company) => (
            <md-select-option value={company.getId()}
                              headline={`${company.getAttribute('name')} (${company.getAttribute('vatNumber')})`}></md-select-option>
          ))}
        </md-filled-select>
        <p>What donuts do you want to reserve daily?</p>
        <md-data-table>
          <md-data-table-column type="checkbox"></md-data-table-column>
          <md-data-table-column filterable sortable>Donut</md-data-table-column>
          <md-data-table-column>Quantity</md-data-table-column>
          {this.donuts?.map((donut) => {
            const relationDonut = this.selectedRecord?.getRelation('donuts')?.find((relationDonut) => relationDonut.getId() === donut.getId());
            const quantityName = `quantity_${donut.getId()}`;
            return (
              <md-data-table-row data-relation="donuts" data-record-id={donut.getId()} selected={relationDonut !== undefined}>
                <md-data-table-cell type="checkbox"></md-data-table-cell>
                <md-data-table-cell>
                  {donut.getAttribute('name')}
                </md-data-table-cell>
                <md-data-table-cell>
                  <md-outlined-text-field
                    style={{"--md-outlined-text-field-container-padding-vertical": "6px"}}
                    name={quantityName}
                    label="Quantity"
                    type="number"
                    value={relationDonut?.getPivot('quantity') as unknown as string}/>
                </md-data-table-cell>
              </md-data-table-row>
            )
          })}
        </md-data-table>
      </div>
    )
  }

  async saveRelations(record: Supply, event: FormSubmitEvent) {
  }

  // @ts-ignore
  async afterSave(record: Supply, response: SaveResponse<Supply>, event: FormSubmitEvent): Promise<void> {
    await super.afterSave(record, response, event);
    record.setRelation('company', this.companies?.find((company) => company.getId() === this.formState.company()));

    const form = event.target as HTMLFormElement;
    const datatable = form.querySelector<DataTable>('md-data-table');
    const ids = datatable!.rows.filter((row)=> row.selected).map((row) => row.dataset.recordId);
    record.setRelation('donuts', ids.map((id) => {
      const donut = this.donuts!.find((donut) => donut.getId() === id)!;
      const quantityName = `quantity_${donut.getId()}`;
      donut.setPivot('quantity', event.data.get(quantityName) as unknown as number);
      return donut;
    }));
    console.log(record.getRelation('donuts'));
    await record.save()
  }

}
