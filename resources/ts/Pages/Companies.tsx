import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import Company from '~/Models/Company';


export default class Companies extends RecordsPage<Company> {
  modelType = Company;
  formState = {
    name: Stream(''),
    vatNumber: Stream('')
  }

  tableColumns(): Collection<Child> {
    return collect({
      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      vatNumber: <DataTableColumn filterable sortable>Vat Number</DataTableColumn>,
    });
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="name" label="Name" error-text={this.errors.name?.[0]} error={'name' in this.errors} />
        <md-filled-text-field name="vatNumber" label="Vat number" error-text={this.errors.company?.[0]} error={'vatNumber' in this.errors} />
      </div>
    )
  }

  saveRelations(record: Company): Promise<void> {
    return Promise.resolve(undefined);
  }
}
