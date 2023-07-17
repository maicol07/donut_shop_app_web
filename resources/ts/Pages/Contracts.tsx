import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Contract, {ContractAttributes} from '~/Models/Contract';
import {match, P} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/chips/filter-chip.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import Employee from '~/Models/Employee';
import Shift from '~/Models/Shift';
import Shop from '~/Models/Shop';
import {PageAttributes} from '~/Page';
import {FilledTextField} from '@material/web/textfield/lib/filled-text-field';
import {SaveResponse} from 'coloquent';
import {FilledSelect} from '@material/web/select/lib/filled-select';
import dayjs from 'dayjs';
import {mdiDeleteOutline, mdiPlus} from '@mdi/js';
import MdIcon from '~/Components/MdIcon';


export default class Contracts extends RecordsPage<Contract> {
  modelType = Contract;
  formState = {
    fiscalCode: Stream(''),
    salary: Stream(0),
    startDate: Stream(''),
    endDate: Stream(''),
    type: Stream(''),
    shop: Stream('')
  }
  employees: Employee[]|undefined;
  shifts: Shift[] = [];
  shops: Shop[]|undefined;
  // @ts-ignore
  with = ['shifts', 'employee', 'shops'];

  tableColumns(): Collection<Child> {
    return collect({
      employee: <DataTableColumn filterable sortable>employee</DataTableColumn>,
      salary: <DataTableColumn filterable sortable>salary</DataTableColumn>,
      startDate: <DataTableColumn filterable sortable>start date</DataTableColumn>,
      endDate: <DataTableColumn filterable sortable>end date</DataTableColumn>,
      type: <DataTableColumn filterable sortable>type</DataTableColumn>,
      shifts: <DataTableColumn filterable sortable>shifts</DataTableColumn>,
      shops: <DataTableColumn filterable sortable>shops</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Employee, 'employees');
    await this.fetchRecords(Shop, 'shops');
  }

  attributeMap(name: keyof ContractAttributes, value: ValueOf<ContractAttributes>, record: Contract) {
    return match(name)
      .with('employee', () => record.getRelation('employee')
        ?.map((employee) => `${employee.getAttribute('firstName')} ${employee.getAttribute('lastName')}`
        )
        .join(', '))
      .with('shops',() => record.getRelation('shops')
        ?.map((shop) => `${shop.getAttribute('address')}`)
        .join(', '))
      .with('shifts',() => record.getRelation('shifts')
        ?.map((shift) => `${shift.getAttribute('weekDay')}: ${dayjs(shift.getAttribute('startTime')).format('HH:mm')} - ${dayjs(shift.getAttribute('endTime')).format('HH:mm')}`)
        .join(', '))
      .with(P.union("startDate", "endDate"), () => ((value as Date).toLocaleString()))
      .otherwise(() => super.attributeMap(name, value, record));
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-select name="fiscalCode" label="Employee">
          {this.employees?.map((employee) => {
              return (
                <md-select-option value={employee.getAttribute('fiscalCode')} headline={employee.getAttribute('firstName') + ' ' + employee.getAttribute('lastName')} selected={this.formState.fiscalCode() === employee.getAttribute('fiscalCode')}></md-select-option>
              )
            }
          )}
        </md-filled-select>
        <md-filled-text-field name="salary" label="salary" type="number" error-text={this.errors.salary?.[0]} error={'salary' in this.errors}/>
        <md-filled-text-field name="startDate" type="date" label="Start Date" error-text={this.errors.startDate?.[0]} error={'startDate' in this.errors}/>
        <md-filled-text-field name="endDate" type="date" label="End Date" error-text={this.errors.endDate?.[0]} error={'endDate' in this.errors}/>
        <md-filled-text-field name="type" label="Type" error-text={this.errors.type?.[0]} error={'type' in this.errors}/>
        <md-filled-select name="shop" label="Shop">
          {this.shops?.map((shop) => {
              return (
                <md-select-option value={shop.getId()} headline={shop.getAttribute('address')} selected={this.formState.shop() === shop.getId()}></md-select-option>
              )
            }
          )}
        </md-filled-select>
        <div id="shifts">
          <strong>Shifts</strong>
          {this.shifts?.map((shift) => {
              return (
                <div id={shift} style={{display: 'flex', gap: '6px', alignItems: 'center'}} oninput={this.setShiftAttribute.bind(this,shift)}>
                  <md-filled-select name="weekDay" label="Week Day" style={{minHeight: '58px'}}>
                    <md-select-option value='monday' headline="Monday" selected={shift.getAttribute('weekDay') == 'monday'}></md-select-option>
                    <md-select-option value='tuesday' headline="Tuesday" selected={shift.getAttribute('weekDay') == 'tuesday'}></md-select-option>
                    <md-select-option value='wednesday' headline="Wednesday" selected={shift.getAttribute('weekDay') == 'wednesday'}></md-select-option>
                    <md-select-option value='thursday' headline="Thursday" selected={shift.getAttribute('weekDay') == 'thursday'}></md-select-option>
                    <md-select-option value='friday' headline="Friday" selected={shift.getAttribute('weekDay') == 'friday'}></md-select-option>
                    <md-select-option value='saturday' headline="Saturday" selected={shift.getAttribute('weekDay') == 'saturday'}></md-select-option>
                    <md-select-option value='sunday' headline="Sunday" selected={shift.getAttribute('weekDay') == 'sunday'}></md-select-option>
                  </md-filled-select>
                  <md-filled-text-field name="startTime" label="Start Time" type="time" value={shift.getAttribute('startTime') ? dayjs(shift.getAttribute('startTime')).format('HH:mm') : ''}/>
                  <md-filled-text-field name="endTime" label="End Time" type="time" value={shift.getAttribute('endTime') ? dayjs(shift.getAttribute('endTime')).format('HH:mm') : ''} />
                  <md-standard-icon-button onclick={ () =>
                    {
                      this.shifts = this.shifts.filter((filtro) => filtro != shift);
                    }
                  }><MdIcon icon={mdiDeleteOutline}/></md-standard-icon-button>
                </div>
              )
            }
          )}<br/>
          <md-text-button onclick={this.addShift.bind(this)} ><MdIcon slot='icon' icon={mdiPlus}/>Add a shift</md-text-button>
        </div>
      </div>
    )
  }

  openAddDialog() {
    super.openAddDialog();
    this.shifts = [];
  }

  loadEditDialog(record: Contract) {
    super.loadEditDialog(record);
    this.formState.startDate(dayjs(record.getAttribute('startDate')).format('YYYY-MM-DD'));
    this.formState.endDate(dayjs(record.getAttribute('endDate')).format('YYYY-MM-DD'));
    this.formState.fiscalCode(record.getRelation('employee')![0].getAttribute('fiscalCode') as string);
    this.formState.shop(record.getRelation('shops')![0].getId() as string);
    this.shifts = record.getRelation('shifts')!;
  }

  setShiftAttribute(shift: Shift, e:Event){
    shift.setAttribute((e.target as FilledTextField|FilledSelect).getAttribute('name')!, (e.target as FilledTextField|FilledSelect).value)
  }

  addShift(){
    let shift = new Shift();
    this.shifts.push(shift)
  }

  async saveRelations(record: Contract, event: FormSubmitEvent) {
    record.setRelation('shifts', undefined); // Restify tries to save it as BelongsToMany while it's a HasMany (read-only from Contract side)
  }

  // @ts-ignore
  async afterSave(record: Contract, response: SaveResponse<Contract>, event: FormSubmitEvent): Promise<void> {

    // Save relations (they need to be here because they need the record to be saved first (contract id is required backend-side)
    const shop = this.shops?.find(shop => shop.getId() == this.formState.shop());
    const employee = this.employees?.find(employee => employee.getAttribute('fiscalCode') == this.formState.fiscalCode());//this.formState.fiscalCode()
    shop?.setPivot('employee_fiscalCode', this.formState.fiscalCode());
    employee?.setPivot('shop_id', this.formState.shop());

    console.log(shop, employee, this.formState.fiscalCode(), this.formState.shop())

    record.setRelation('shops', shop ? [shop] : [])
    record.setRelation('employee', employee ? [employee] : []);

    await record.save()

    //add relation to shifts
    for (const shift of this.shifts) {
      shift.setRelation('contract', record);
      await shift.save()
    }
    await super.afterSave(record, response, event);
  }
}
