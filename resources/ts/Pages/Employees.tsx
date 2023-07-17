import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import {match} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/select/filled-select.js';
import '@material/web/select/select-option.js';
import DataTableColumn from '~/Components/DataTableColumn';
import MdIcon from '~/Components/MdIcon';
import {mdiCity, mdiEmailOutline, mdiFlagOutline} from '@mdi/js';
import dayjs from 'dayjs';
import Employee, {EmployeeAttributes, EmployeeRelations} from '~/Models/Employee';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';


export default class Employees extends RecordsPage<Employee> {
  modelType = Employee;
  formState = {
    fiscalCode: Stream(''),
    firstName: Stream(''),
    lastName: Stream(''),
    email: Stream(''),
    phone: Stream(''),
    job: Stream(''),
    birthDate: Stream(''),
    street: Stream(''),
    houseNumber: Stream(''),
    zip: Stream(''),
    city: Stream(''),
    state: Stream(''),
    province: Stream(''),
  }
  with: (keyof EmployeeRelations)[] = ['company'];

  loadEditDialog(record: Employee) {
    super.loadEditDialog(record);
    this.formState.birthDate(dayjs(record.getAttribute('birthDate')).format('YYYY-MM-DD'));
  }

  tableColumns(): Collection<Child> {
    return collect({
      fiscalCode: <DataTableColumn filterable sortable>Fiscal code</DataTableColumn>,
      firstName: <DataTableColumn filterable sortable>First name</DataTableColumn>,
      lastName: <DataTableColumn filterable sortable>Last name</DataTableColumn>,
      email: <DataTableColumn filterable sortable>Email</DataTableColumn>,
      phone: <DataTableColumn filterable sortable>Phone</DataTableColumn>,
      job: <DataTableColumn filterable sortable>Job</DataTableColumn>,
      birthDate: <DataTableColumn filterable sortable>Birth date</DataTableColumn>,
      street: <DataTableColumn filterable sortable>Street</DataTableColumn>,
      houseNumber: <DataTableColumn filterable sortable>House number</DataTableColumn>,
      zip: <DataTableColumn filterable sortable>Zip code</DataTableColumn>,
      city: <DataTableColumn filterable sortable>City</DataTableColumn>,
      state: <DataTableColumn filterable sortable>State</DataTableColumn>,
      province: <DataTableColumn filterable sortable>Province</DataTableColumn>
    });
  }

  attributeMap(name: keyof EmployeeAttributes, value: ValueOf<EmployeeAttributes>, record: Employee) {
    return match(name)
      .with("birthDate", () => value ? (value as Date).toLocaleDateString() : undefined)
      .otherwise(() => super.attributeMap(name, value, record));
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="fiscalCode" label="Fiscal code" error-text={this.errors.fiscalCode?.[0]} error={'fiscalCode' in this.errors}/>
        <md-filled-text-field name="firstName" label="First name" error-text={this.errors.firstName?.[0]} error={'firstName' in this.errors}/>
        <md-filled-text-field name="lastName" label="Last name" error-text={this.errors.lastName?.[0]} error={'lastName' in this.errors}/>
        <md-filled-text-field name="email" label="Email" error-text={this.errors.email?.[0]} error={'email' in this.errors} type="email">
          <MdIcon icon={mdiEmailOutline} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-text-field name="phone" label="Phone" error-text={this.errors.phone?.[0]} error={'phone' in this.errors}/>
        <md-filled-text-field name="job" label="Job" error-text={this.errors.job?.[0]} error={'job' in this.errors}/>
        <md-filled-text-field name="birthDate" label="Birth date" error-text={this.errors.birthDate?.[0]} error={'birthDate' in this.errors} type="date"/>
        <md-filled-text-field name="street" label="Street" error-text={this.errors.street?.[0]} error={'street' in this.errors}/>
        <md-filled-text-field name="houseNumber" label="House number" error-text={this.errors.surname?.[0]} error={'houseNumber' in this.errors}/>
        <md-filled-text-field name="zip" label="Zip code" error-text={this.errors.zip?.[0]} error={'zip' in this.errors}/>
        <md-filled-text-field name="city" label="City" error-text={this.errors.city?.[0]} error={'city' in this.errors}>
          <MdIcon icon={mdiCity} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-text-field name="province" label="Province" error-text={this.errors.province?.[0]} error={'province' in this.errors}/>
        <md-filled-text-field name="state" label="State" error-text={this.errors.state?.[0]} error={'state' in this.errors}>
          <MdIcon icon={mdiFlagOutline} slot="leadingicon"/>
        </md-filled-text-field>
      </div>
    )
  }

  saveRelations(record: Employee, event: FormSubmitEvent): Promise<void> {
    return Promise.resolve(undefined);
  }
}
