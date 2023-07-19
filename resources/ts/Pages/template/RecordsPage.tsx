import Page, {PageAttributes} from '~/Page';
import '@maicol07/material-web-additions/data-table/data-table.js';
import '@maicol07/material-web-additions/data-table/data-table-column.js';
import '@maicol07/material-web-additions/data-table/data-table-row.js';
import '@maicol07/material-web-additions/data-table/data-table-cell.js';
import Mithril, {Child, ChildArray, Children, Vnode} from 'mithril';
import {Collection} from 'collect.js';
import Model, {ModelAttributes} from '~/Models/Model';
import {Class, ValueOf} from 'type-fest';
import {match, P} from 'ts-pattern';
import '@material/web/fab/fab.js';
import MdIcon from '~/Components/MdIcon';
import {mdiDeleteOutline, mdiPencilOutline, mdiPlus, mdiRefresh} from '@mdi/js';
import '@material/web/dialog/dialog.js';
import '@material/web/button/text-button.js';
import '@material/web/iconbutton/standard-icon-button.js';
import {Dialog} from '@material/web/dialog/lib/dialog';
import Form, {FormAttributes, FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {RequestError} from 'mithril-utilities';
import {showSnackbar} from '~/utils';
import {SaveResponse} from 'coloquent';


export default abstract class RecordsPage<M extends Model<any, any>> extends Page {
  abstract modelType: Class<M> & typeof Model<any, any>;

  records: M[] = [];

  errors: Record<string, string[]> = {};

  formState: FormAttributes['state'] = {};

  openDialog: boolean = false;
  openDeleteDialog: boolean = false;
  selectedRecord: M | undefined;
  isTableLoading: boolean = false;

  with: M['__relationsNames'] = [];

  contents() {
    return (
      <>
        <md-data-table inProgress={this.isTableLoading}>
          {this.tableColumns().values().all()}
          <md-data-table-column></md-data-table-column>
          {this.tableRows() ?? (
            <md-data-table-row>
              <td style={{textAlign: 'center'}} colspan={this.tableColumns().length}>No records found</td>
            </md-data-table-row>
          )}
        </md-data-table>

        <div class="fab-container">
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'end'}}>
            <md-fab id="refresh-records" ariaLabel="Refresh" onclick={this.onRefreshRecordsButtonClicked.bind(this)}>
              <MdIcon icon={mdiRefresh} slot="icon"/>
            </md-fab>
            <md-fab label='Add Item' onclick={this.openAddDialog.bind(this)}>
              <MdIcon slot="icon" icon={mdiPlus}/>
            </md-fab>
          </div>
        </div>

        <md-dialog id="dialog" open={this.openDialog} style={{"--md-dialog-container-max-block-size":"82%"}}>
          <span slot="header">{this.selectedRecord? "Edit":"Add"} Record</span>

          <Form id="form" state={this.formState} onsubmit={this.formSubmit.bind(this)} >
            {this.formContents()}
          </Form>
          <md-text-button id="cancelButton" slot="footer" dialog-action="cancel"> Cancel </md-text-button>
          <md-text-button id="saveButton" slot="footer" onclick={ (evt) => {this.element.querySelector<HTMLFormElement>("#form")?.requestSubmit() }}> Save </md-text-button>
        </md-dialog>

        <md-dialog id="deleteDialog" open={this.openDeleteDialog}>
          <span slot="header">Confirm delete</span>
          <span>Are you sure you want to delete this Record?</span>

          <md-text-button id="cancelButton" slot="footer" dialog-action="cancel"> Cancel </md-text-button>
          <md-text-button id="deleteButton" slot="footer" onclick={this.deleteRecord.bind(this)}> Delete </md-text-button>
        </md-dialog>

      </>
    );
  }

  openAddDialog(){
    for (const key in this.formState) {
      if (this.formState instanceof Map) {
        this.formState.get(key)?.('')
      } else {
        this.formState[key]('')
      }
    }
    this.errors = {};
    this.openDialog = true;
  }

  async deleteRecord(){
    try{
      await this.selectedRecord?.delete();
    }
    catch (exception){
      const error = exception as RequestError;
    }
    this.openDeleteDialog = false;
    this.selectedRecord = undefined;
    await this.loadRecords();
  }

  loadEditDialog(record: M){
    this.openDialog = true;
    this.selectedRecord = record;
    for(const [key, value] of Object.entries(this.formState!)){
      value(this.selectedRecord.getAttribute(key));
    }
  }

  oncreate(vnode: Mithril.VnodeDOM<PageAttributes, this>) {
    super.oncreate(vnode);
    this.element.querySelector<Dialog>('#dialog')!.addEventListener( 'closed', () => {
      this.openDialog = false;
      this.selectedRecord = undefined;
      m.redraw();
    });
    this.element.querySelector<Dialog>('#deleteDialog')!.addEventListener( 'closed', () => {
      this.openDeleteDialog = false;
      this.selectedRecord = undefined;
      m.redraw();
    });
  }

  async loadRecords() {
    this.isTableLoading = true;
    m.redraw();
    // @ts-ignore
    let response = await this.modelType.query<M>().with(this.with).get();
    this.records = response.getData();
    this.isTableLoading = false;
    m.redraw();
  }

  async oninit(vnode: Vnode<PageAttributes, this>) {
    super.oninit(vnode);
    await this.loadRecords();
  }

  onRefreshRecordsButtonClicked(event: MouseEvent) {
    (event as MouseEvent & {redraw: boolean}).redraw = false;
    void this.loadRecords();
  }

  abstract tableColumns(): Collection<Child>;

  attributeMap<A extends (keyof ModelAttributes | string)>(name: A, value: ValueOf<ModelAttributes>, record: M): unknown {
    return match(name)
      // @ts-ignore
      .with('id', () => record.getId())
      .with(P.union("createdAt", "updatedAt"), () => (
        <span>
          <span style="display: none;" aria-hidden="true">{(value as Date).getTime()}</span>
          {(value as Date).toLocaleString()}
        </span>
      )) //
      .otherwise(() => value);
  };

  tableRows(): ChildArray {
    let rows: ChildArray = [];

    for (const record of this.records) {
      rows.push(
        <md-data-table-row>
          {this.tableColumns().keys().map((attribute) => (
            <md-data-table-cell>
              {this.attributeMap(attribute, record.getAttribute(attribute), record)}
            </md-data-table-cell>
          )).toArray()}

          {/*edit and delete buttons*/ }
          <md-data-table-cell>
            <md-standard-icon-button onclick={this.loadEditDialog.bind(this, record)}>
              <MdIcon icon={mdiPencilOutline}/>
            </md-standard-icon-button>
            <md-standard-icon-button onclick={ (evt) => {this.openDeleteDialog = true; this.selectedRecord = record} } >
              <MdIcon icon={mdiDeleteOutline}/>
            </md-standard-icon-button>
          </md-data-table-cell>
        </md-data-table-row>

      );
    }

    return rows;
  }

  abstract formContents(): Children;
  async formSubmit(event: FormSubmitEvent) {
    // @ts-expect-error — this is a hack to get around that the type of the model is not known at compile time
    let record = this.selectedRecord ?? new this.modelType();

    await this.saveAttributes(record, event)
    await this.saveRelations(record, event);

    try {
      let result = await record.save();
      await this.afterSave(record, result, event);
      if (result.getModelId()) {
        this.openDialog = false;
        void showSnackbar("Record saved successfully!");
        await this.loadRecords();
      } else {
        void showSnackbar("Error! Cannot save the record!");
      }
    } catch (exception) {
      const error = exception as RequestError<{ "message": string, "errors": Record<string, string[]> }>;
      if (error.response === undefined) { // Not a request error
        throw exception;
      }
      this.errors = error.response.errors ?? {};
      m.redraw();
      void showSnackbar(error.response.message);
    }
  };

  async saveAttributes(record: M, event: FormSubmitEvent) {
    for (const [key, value] of Object.entries(this.formState!)) {
      if (record.attributesNames.includes(key)) {
        record.setAttribute(key, value());
      }
    }
  }

  // @ts-ignore
  async afterSave(record: M, response: SaveResponse<M>, event: FormSubmitEvent) {}

  abstract saveRelations(record: M, event: FormSubmitEvent): Promise<void>;

  protected async fetchRecords<T extends Model<any, any>>(model: Class<T>, property: keyof this, withRelations: string[] = [], redraw = true) {
    // @ts-ignore
    if (this[property] === undefined) {
      const response = await (model as unknown as T).query().with(withRelations).get();
      // console.log("response", response);
      // @ts-ignore
      this[property] = response.getData();

      if (redraw) {
        m.redraw();
      }
    }
  }
}
