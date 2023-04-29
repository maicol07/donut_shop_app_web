import Page, {PageAttributes} from '~/Page';
import '@maicol07/material-web-additions/data-table/data-table.js';
import '@maicol07/material-web-additions/data-table/data-table-column.js';
import '@maicol07/material-web-additions/data-table/data-table-row.js';
import '@maicol07/material-web-additions/data-table/data-table-cell.js';
import {Child, ChildArray, Vnode} from 'mithril';
import {Collection} from 'collect.js';
import Model, {ModelAttributes} from '~/Models/Model';
import {Class, ValueOf} from 'type-fest';
import {match, P} from 'ts-pattern';


export default abstract class RecordsPage<M extends Model<any, any>> extends Page {
  abstract modelType: Class<M> & typeof Model<any, any>;

  records: M[] = [];

  contents() {
    return (
      <md-data-table>
        {this.tableColumns().values().all()}
        {this.tableRows() ?? (
          <md-data-table-row>
            <td style={{textAlign: 'center'}} colspan={this.tableColumns().length}>No records found</td>
          </md-data-table-row>
        )}
      </md-data-table>
    );
  }

  async loadRecords() {
    let response = await this.modelType.all<M>();
    this.records = response.getData();
    m.redraw();
  }

  async oninit(vnode: Vnode<PageAttributes, this>) {
    super.oninit(vnode);
    await this.loadRecords();
  }

  abstract tableColumns(): Collection<Child>;

  attributeMap(name: keyof ModelAttributes, value: ValueOf<ModelAttributes>): unknown {
    return match(name)
      .with(P.union("createdAt", "updatedAt"), () => (value as Date).toLocaleString())
      .otherwise(() => value);
  };

  tableRows(): ChildArray {
    let rows: ChildArray = [];

    for (const record of this.records) {
      rows.push(
        <md-data-table-row>
          {this.tableColumns().keys().map((attribute)=> <md-data-table-cell>{this.attributeMap(attribute, record.getAttribute(attribute))}</md-data-table-cell>).toArray()}
        </md-data-table-row>
      );
    }

    return rows;
  }
}
