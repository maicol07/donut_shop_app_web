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
import {FilterChip} from '@material/web/chips/lib/filter-chip';


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
      .with("allergen", () => value ? 'Yes' : 'No')
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
          {this.ingredients.map((ingredient) => (
            <md-filter-chip data-relation="ingredient" data-record-id={ingredient.getId()} label={ingredient.getAttribute('name')}>
              {ingredient.getAttribute('allergen') && <MdIcon slot="icon" icon={mdiAlertOutline}/>}
            </md-filter-chip>
          ))}
        </div>
      </div>
    )
  }

  async saveRelations(record: Donut, event: FormSubmitEvent) {
    const form = event.target as HTMLFormElement;
    const ingredientsChips = form.querySelectorAll<FilterChip>('md-filter-chip[data-relation="ingredient"]');
    record.setRelation('ingredients', [...ingredientsChips]
      .filter((chip) => chip.selected)
      .map((chip) => this.ingredients.find(
        (ingredient) => ingredient.getId() === chip.dataset.recordId)!
      ));
  }
}
