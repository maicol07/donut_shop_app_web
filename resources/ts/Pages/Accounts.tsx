import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child, Vnode} from 'mithril';
import {collect, Collection} from 'collect.js';
import Account, {AccountAttributes} from '~/Models/Account';
import {match} from 'ts-pattern';
import Customer from '~/Models/Customer';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/chips/filter-chip.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {PageAttributes} from '~/Page';


export default class Accounts extends RecordsPage<Account> {
  modelType = Account;
  formState = {
    username: Stream(''),
    fiscalCode: Stream(''),
    password: Stream('')
  }
  customers: Customer[] | undefined;
  // @ts-ignore
  with = ['customers'];

  async oninit(vnode: Vnode<PageAttributes, this>) {
    await super.oninit(vnode);
    await this.fetchRecords(Customer, 'customers');
  }

  tableColumns(): Collection<Child> {
    return collect({
      username: <DataTableColumn filterable sortable>username</DataTableColumn>,
      user: <DataTableColumn filterable sortable>User</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof AccountAttributes, value: ValueOf<AccountAttributes>, record: Account) {
    return match(name)
      .with("user", () => {
        let user = record.getRelation('customer');
        return `${user?.getAttribute('name')} ${user?.getAttribute('surname')} (${user?.getAttribute('fiscalCode')})`
      })
      .otherwise(() => super.attributeMap(name, value, record));
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-text-field name="username" label="Username" error-text={this.errors.username?.[0]} error={'username' in this.errors}/>
        <md-filled-text-field name="password" type="password" label="password" error-text={this.errors.password?.[0]} error={'password' in this.errors}/>
        <md-outlined-select name="fiscalCode" label="Customer">
          {this.customers?.map((customer) => {
              return (
                <md-select-option
                  value={customer.getAttribute('fiscalCode')}
                  headline={`${customer.getAttribute('name')} ${customer.getAttribute('surname')}`}
                  selected={this.formState.fiscalCode() === customer.getAttribute('fiscalCode')}
                ></md-select-option>
              )
            }
          )}
        </md-outlined-select>
      </div>
    )
  }

  async saveRelations(record: Account, event: FormSubmitEvent) {
    record.setRelation('customer', this.customers?.find(customer => customer.getAttribute('fiscalCode') == this.formState.fiscalCode())!);
  }
}

