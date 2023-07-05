import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Donut, {DonutAttributes} from '~/Models/Donut';
import {match} from 'ts-pattern';
import Ingredient from '~/Models/Ingredient';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/chips/filter-chip.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
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
  // @ts-ignore
  with = ['ingredients'];

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

  attributeMap(name: keyof DonutAttributes, value: ValueOf<DonutAttributes>, record: Donut) {
    return match(name)
      .with('ingredients', () => {
        return record.getRelation('ingredients')
          ?.map((ingredient) => `${ingredient.getAttribute("name")} (${ingredient.getPivot('absolute_quantity')})`)
          .join(", ");
      })
      .otherwise(() => super.attributeMap(name, value, record));
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
        <md-filled-text-field name="name" label="Name" error-text={this.errors.name?.[0]} error={'name' in this.errors}/>
        <md-filled-text-field name="price" type="number" suffix-text="€" label="Price" error-text={this.errors.price?.[0]} error={'price' in this.errors}/>
        <md-filled-text-field name="description" label="Description" error-text={this.errors.description?.[0]} error={'description' in this.errors}/>
        <h3 className="headline-small">Ingredients</h3>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
          <md-data-table>
            <DataTableColumn type="checkbox"></DataTableColumn>
            <DataTableColumn filterable sortable>Ingredient</DataTableColumn>
            <DataTableColumn>Quantity</DataTableColumn>
            {this.ingredients.map((ingredient) => {
              const relationIngredient = this.selectedRecord?.getRelation('ingredients')?.find((relationIngredient) => relationIngredient.getId() === ingredient.getId());
              const absoluteQuantityName = `absolute_quantity_${ingredient.getId()}`;
              return (
                <md-data-table-row data-relation="ingredient" data-record-id={ingredient.getId()} selected={relationIngredient !== undefined}>
                  <md-data-table-cell type="checkbox"></md-data-table-cell>
                  <md-data-table-cell>
                    {ingredient.getAttribute('name')}
                  </md-data-table-cell>
                  <md-data-table-cell>
                    <md-outlined-text-field
                      style={{"--md-outlined-text-field-container-padding-vertical": "6px"}}
                      name={absoluteQuantityName}
                      label="Quantity"
                      error-text={this.errors[absoluteQuantityName]?.[0]}
                      error={absoluteQuantityName in this.errors}
                      type="number"
                      value={relationIngredient?.getPivot('absolute_quantity') as unknown as string}/>
                  </md-data-table-cell>
                </md-data-table-row>
              )
            })}
          </md-data-table>
        </div>
      </div>
    )
  }

  async saveRelations(record: Donut, event: FormSubmitEvent) {
    const form = event.target as HTMLFormElement;
    const datatable = form.querySelector<DataTable>('md-data-table');
    const ids = datatable!.rows.filter((row)=> row.selected).map((row) => row.dataset.recordId)

    record.setRelation('ingredients', ids.map((id) => {
      const ingredient = this.ingredients.find((ingredient) => ingredient.getId() === id)!;
      const absoluteQuantityName = `absolute_quantity_${ingredient.getId()}`;
      const absoluteQuantity = form.querySelector<HTMLInputElement>(`[name="${absoluteQuantityName}"]`)!.value as unknown as number;
      ingredient.setPivot('absolute_quantity', absoluteQuantity);
      return ingredient;
    }))
  }
}

