import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child, redraw} from 'mithril';
import {collect, Collection} from 'collect.js';
import Donut, {DonutAttributes} from '~/Models/Donut';
import {match} from 'ts-pattern';
import Ingredient, {IngredientAttributes} from '~/Models/Ingredient';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/chips/filter-chip.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import {Checkbox} from '@material/web/checkbox/lib/checkbox';
import DataTableColumn from '~/Components/DataTableColumn';
import {mdiAlert, mdiAlertOutline, mdiExclamation, mdiPeanutOutline, mdiPlus} from '@mdi/js';
import MdIcon from '~/Components/MdIcon';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {DataTable} from '@maicol07/material-web-additions/data-table/lib/data-table';


export default class Donuts extends RecordsPage<Donut> {
  modelType = Donut;
  formState = {
    name: Stream(''),
    price: Stream(0),
    description: Stream('')
  }
  ingredients: Ingredient[] = []

  tableColumns(): Collection<Child> {
    return collect({
      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      price: <DataTableColumn filterable sortable>Price</DataTableColumn>,
      description: <DataTableColumn filterable>Description</DataTableColumn>,
      ingredients: <DataTableColumn filterable>Ingredients</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof DonutAttributes, value: ValueOf<DonutAttributes>) {
    return match(name)
      .with("allergen", () => value ? 'Yes' : 'No')//is this needed?
      .otherwise(() => super.attributeMap(name, value));
  }

  formContents(): Mithril.Children {
    if (this.openDialog && this.ingredients.length === 0) {
      Ingredient.all().then((response) => {
        this.ingredients = response.getData();
        m.redraw();
      })
    }
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
        <md-filled-text-field name="name" label="Name" errorText={this.errors.name?.[0]} error={'name' in this.errors}/>
        <md-filled-text-field name="price" suffixText="€" label="Price" errorText={this.errors.price?.[0]} error={'price' in this.errors}/>
        <md-filled-text-field name="description" label="Description" errorText={this.errors.description?.[0]} error={'description' in this.errors}/>
        <h3 className="headline-small">Ingredients</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
          <md-data-table>
            <DataTableColumn type="checkbox"></DataTableColumn>
            <DataTableColumn filterable sortable>Ingredient</DataTableColumn>
            <DataTableColumn>Quantity</DataTableColumn>
            {this.ingredients.map((ingredient) => (
              <md-data-table-row data-relation="ingredient" data-record-id={ingredient.getId()}>
                <md-data-table-cell type="checkbox"></md-data-table-cell>
                <md-data-table-cell>
                  {ingredient.getAttribute('name')}
                </md-data-table-cell>
                <md-data-table-cell>
                  <md-filled-text-field name="absolute_quantity" label="Quantity" errorText={this.errors.absolute_quantity?.[0]} error={'absolute_quantity' in this.errors}/>
                </md-data-table-cell>
              </md-data-table-row>
            ))}
          </md-data-table>
        </div>
      </div>
    )
  }

  async saveRelations(record: Donut, event: FormSubmitEvent) {
    const form = event.target as HTMLFormElement;
    const datatable = form.querySelector<DataTable>('md-data-table');
    const ids = datatable!.rows.filter((row)=> row.selected).map((row) => row.dataset.recordId)

    record.setRelation('ingredients', ids.map((id) => this.ingredients.find((ingredient) => ingredient.getId() === id)!))
    // record.setRelationPivotData()
    // const ingredientCheckboxes = form.querySelectorAll<MdDataTableCell>('md-data-table-cell[data-relation="ingredient"]');
    // record.setRelation('ingredients', [...ingredientCheckboxes]
    //   .filter((checkbox) => checkbox.getAttribute(''))
    //   .map((checkbox) => this.ingredients.find(
    //     (ingredient) => ingredient.getId() === checkbox.dataset.recordId)!
    //   ));
  }
}
/* alternatives for quantity field
1:
<md-data-table>
            <DataTableColumn type="checkbox"></DataTableColumn>
            <DataTableColumn filterable sortable>Ingredient</DataTableColumn>
            <DataTableColumn>Quantity</DataTableColumn>
            {this.ingredients.map((ingredient) => (
              <md-data-table-row>
                <md-data-table-cell data-relation="ingredient" data-record-id={ingredient.getId()} type="checkbox"></md-data-table-cell>
                <md-data-table-cell>
                  {ingredient.getAttribute('name')}
                </md-data-table-cell>
                <md-data-table-cell>
                  <md-filled-text-field name="absolute_quantity" label="Quantity" errorText={this.errors.absolute_quantity?.[0]} error={'absolute_quantity' in this.errors}/>
                </md-data-table-cell>
              </md-data-table-row>
            ))}
          </md-data-table>

2: doesn't work
{this.ingredients.map((ingredient) => (
  <md-filter-chip data-relation="ingredient" data-record-id={ingredient.getId()} label={ingredient.getAttribute('name')}>
    {ingredient.getAttribute('allergen') && <MdIcon slot="icon" icon={mdiAlertOutline}/>}
    <md-filled-text-field name="absolute_quantity" label="Quantity" errorText={this.errors.quantity?.[0]} error={'quantity' in this.errors}/>
  </md-filter-chip>
))}

original:
{this.ingredients.map((ingredient) => (
  <md-filter-chip data-relation="ingredient" data-record-id={ingredient.getId()} label={ingredient.getAttribute('name')}>
    {ingredient.getAttribute('allergen') && <MdIcon slot="icon" icon={mdiAlertOutline}/>}
  </md-filter-chip>
))}
*/
