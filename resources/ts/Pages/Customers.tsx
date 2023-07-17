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
import Company from '~/Models/Company';
import Customer, {CustomerAttributes, CustomerRelations} from '~/Models/Customer';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import MdIcon from '~/Components/MdIcon';
import {mdiCity, mdiEmailOutline, mdiOfficeBuilding} from '@mdi/js';
import dayjs from 'dayjs';
import {PageAttributes} from '~/Page';


export default class Customers extends RecordsPage<Customer> {
  modelType = Customer;
  formState = {
    name: Stream(''),
    surname: Stream(''),
    fiscalCode: Stream(''),
    birthDate: Stream(''),
    street: Stream(''),
    houseNumber: Stream(''),
    cap: Stream(''),
    city: Stream(''),
    province: Stream(''),
    email: Stream(''),
    company: Stream(''),
  }
  companies: Company[] | undefined;
  with: (keyof CustomerRelations)[] = ['company'];

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Company, 'companies');
  }

  loadEditDialog(record: Customer) {
    super.loadEditDialog(record);
    this.formState.birthDate(dayjs(record.getAttribute('birthDate')).format('YYYY-MM-DD'));
    this.formState.company(record.getRelation('company')?.getId() ?? '');
  }

  tableColumns(): Collection<Child> {
    return collect({
      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      surname: <DataTableColumn filterable sortable>Surname</DataTableColumn>,
      fiscalCode: <DataTableColumn filterable sortable>Fiscal code</DataTableColumn>,
      birthDate: <DataTableColumn filterable sortable>Birth date</DataTableColumn>,
      street: <DataTableColumn filterable sortable>Street</DataTableColumn>,
      houseNumber: <DataTableColumn filterable sortable>House number</DataTableColumn>,
      cap: <DataTableColumn filterable sortable>CAP/Zip code</DataTableColumn>,
      city: <DataTableColumn filterable sortable>City</DataTableColumn>,
      province: <DataTableColumn filterable sortable>Province</DataTableColumn>,
      email: <DataTableColumn filterable sortable>Email</DataTableColumn>,
      company: <DataTableColumn filterable sortable>Company</DataTableColumn>,
    });
  }

  attributeMap(name: keyof CustomerAttributes, value: ValueOf<CustomerAttributes>, record: Customer) {
    return match(name)
      .with("company", () => record.getRelation('company')?.getAttribute('name'))
      .with("birthDate", () => value ? (value as Date).toLocaleDateString() : undefined)
      .otherwise(() => super.attributeMap(name, value, record));
  }

  formContents(): Mithril.Children {
    // if (this.openDialog && this.companies.length === 0) {
    //   Company.all().then((response) => {
    //     this.companies = response.getData();
    //     m.redraw();
    //   })
    // }
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="name" label="Name" error-text={this.errors.name?.[0]} error={'name' in this.errors}/>
        <md-filled-text-field name="surname" label="Surname" error-text={this.errors.surname?.[0]} error={'surname' in this.errors}/>
        <md-filled-text-field name="fiscalCode" label="Fiscal code" error-text={this.errors.fiscalCode?.[0]} error={'fiscalCode' in this.errors}/>
        <md-filled-text-field name="birthDate" label="Birth date" error-text={this.errors.birthDate?.[0]} error={'birthDate' in this.errors} type="date"/>
        <md-filled-text-field name="street" label="Street" error-text={this.errors.street?.[0]} error={'street' in this.errors}/>
        <md-filled-text-field name="houseNumber" label="House number" error-text={this.errors.surname?.[0]} error={'houseNumber' in this.errors}/>
        <md-filled-text-field name="cap" label="CAP/Zip code" error-text={this.errors.cap?.[0]} error={'cap' in this.errors}/>
        <md-filled-text-field name="city" label="City" error-text={this.errors.city?.[0]} error={'city' in this.errors}>
          <MdIcon icon={mdiCity} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-text-field name="province" label="Province" error-text={this.errors.province?.[0]} error={'province' in this.errors}/>
        <md-filled-text-field name="email" label="Email" error-text={this.errors.email?.[0]} error={'email' in this.errors} type="email">
          <MdIcon icon={mdiEmailOutline} slot="leadingicon"/>
        </md-filled-text-field>
        <md-filled-select name="company" label="Company" error-text={this.errors.company?.[0]} error={'company' in this.errors}>
          <MdIcon icon={mdiOfficeBuilding} slot="leadingicon"/>
          {this.companies?.map((company) => (
            <md-select-option value={company.getId()} headline={company.getAttribute('name')}
             selected={this.formState.company() === company.getId()}/>
          ))}
        </md-filled-select>
      </div>
    )
  }

  async saveRelations(record: Customer, event: FormSubmitEvent) {
    record.setRelation('company', this.companies?.find((company) => company.getId() === this.formState.company())!);
  }
}
