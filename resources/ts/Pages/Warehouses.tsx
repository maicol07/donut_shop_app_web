import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Warehouse, {WarehouseAttributes} from '~/Models/Warehouse';
import {match} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import Form, {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {PageAttributes} from '~/Page';
import Ingredient from '~/Models/Ingredient';
import {DataTable} from '@maicol07/material-web-additions/data-table/lib/data-table';
import {Dialog} from '@material/web/dialog/lib/dialog';

export default class Warehouses extends RecordsPage<Warehouse> {
  modelType = Warehouse;
  formState = {
    name: Stream(''),
    address: Stream(''),
  }
  ingredients: Ingredient[] | undefined;
  ingredientsDialog: boolean = false;
  with = ['ingredients'];

  oncreate(vnode: Mithril.VnodeDOM<PageAttributes, this>) {
    super.oncreate(vnode);
    this.element.querySelector<Dialog>('#ingredientsDialog')!.addEventListener('closed', () => {
      this.ingredientsDialog = false;
      this.selectedRecord = undefined;
      m.redraw();
    });
  }

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Ingredient, 'ingredients');
  }

  loadEditDialog(record: Warehouse) {
    super.loadEditDialog(record);
    // this.formState.startTime(dayjs(record.getAttribute('startTime')).format('HH:MM'));
    // this.formState.endTime(dayjs(record.getAttribute('endTime')).format('HH:MM'));
  }

  tableColumns(): Collection<Child> {
    return collect({

      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      address: <DataTableColumn filterable sortable>Address</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof WarehouseAttributes, value: ValueOf<WarehouseAttributes>, record: Warehouse) {
    return match(name)
      .otherwise(() => super.attributeMap(name,  value, record))
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-text-field name="name" label="Name" error-text={this.errors.name?.[0]} error={'name' in this.errors}/>
        <md-filled-text-field name="address" label="Address" error-text={this.errors.address?.[0]} error={'address' in this.errors}/>
      </div>
    )
  }
  async saveRelations(record: Warehouse, event: FormSubmitEvent) {
  }

  rowOptions(record: Warehouse): Collection<Mithril.Child> {
    return super.rowOptions(record).put("editStorage",
      <>
        <md-text-button id="ingredientsButton"
          onclick={this.openIngredientsDialog.bind(this, record)}> Edit Stored Ingredients
        </md-text-button>
      </>);
  }

  openIngredientsDialog(record: Warehouse){
    this.ingredientsDialog = true;
    this.selectedRecord = record;
  }

  async saveIngredients(event: FormSubmitEvent){
    const form = event.target as HTMLFormElement;
    const datatable = form.querySelector<DataTable>('md-data-table');
    const ids = datatable!.rows.map((row) => row.dataset.recordId)

    this.selectedRecord?.setRelation('ingredients', ids.map((id) => {
      const ingredient = this.ingredients?.find((ingredient) => ingredient.getId() === id)!;
      const quantityName = `quantity_${ingredient.getId()}`;
      const quantity = form.querySelector<HTMLInputElement>(`[name="${quantityName}"]`)!.value as unknown as number;
      ingredient.setPivot('quantity', quantity);
      return ingredient;
    }).filter((ingredient) => ingredient.getPivot('quantity') > 0));

    await this.selectedRecord?.save();
  }

  contents(): JSX.Element {
    return (<>
      {super.contents()}
      <md-dialog id="ingredientsDialog" open={this.ingredientsDialog} style={{"--md-dialog-container-max-block-size": "82%", '--md-dialog-container-max-inline-size': '90vw'}}>
        <span slot="header">Stored Ingredients</span>

        <Form id="ingredientsForm" state={this.formState} onsubmit={this.saveIngredients.bind(this)}>
          <md-data-table>

            <DataTableColumn filterable sortable>Ingredient</DataTableColumn>
            <DataTableColumn>Quantity</DataTableColumn>
            {this.ingredients?.map((ingredient) => {
              const relationIngredient = this.selectedRecord?.getRelation('ingredients')?.find((relationIngredient) => relationIngredient.getId() === ingredient.getId());
              const quantityName = `quantity_${ingredient.getId()}`;
              return (
                <md-data-table-row data-relation="ingredient" data-record-id={ingredient.getId()} selected={relationIngredient !== undefined}>

                  <md-data-table-cell>
                    {ingredient.getAttribute('name')}
                  </md-data-table-cell>
                  <md-data-table-cell>
                    <md-outlined-text-field
                      style={{"--md-outlined-text-field-container-padding-vertical": "6px"}}
                      name={quantityName}
                      label="Quantity"
                      error-text={this.errors[quantityName]?.[0]}
                      error={quantityName in this.errors}
                      type="number" min="0"
                      value={relationIngredient?.getPivot('quantity') as unknown as string}/>
                  </md-data-table-cell>
                </md-data-table-row>
              )
            })}
          </md-data-table>
        </Form>
        <md-text-button id="cancelButton" slot="footer" dialog-action="cancel"> Cancel</md-text-button>
        <md-text-button id="saveButton" slot="footer" onclick={(evt) => {
            this.element.querySelector<HTMLFormElement>("#ingredientsForm")?.requestSubmit();
            this.ingredientsDialog = false
          }}> Save
        </md-text-button>
      </md-dialog>
    </>)
  }

}
