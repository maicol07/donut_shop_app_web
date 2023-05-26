import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child, redraw} from 'mithril';
import {collect, Collection} from 'collect.js';
import Ingredient from '~/Models/Ingredient';
import {match} from 'ts-pattern';
import {IngredientAttributes} from '~/Models/Ingredient';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import {Checkbox} from '@material/web/checkbox/lib/checkbox';
import DataTableColumn from '~/Components/DataTableColumn';


export default class Ingredients extends RecordsPage<Ingredient> {
  modelType = Ingredient;
  formState = {
    name: Stream(''),
    allergen: Stream(false)
  }

  tableColumns(): Collection<Child> {
    return collect({
      name: <DataTableColumn filterable sortable>Name</DataTableColumn>,
      allergen: <DataTableColumn filterable sortable>Is allergen?</DataTableColumn>,
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof IngredientAttributes, value: ValueOf<IngredientAttributes>) {
    return match(name)
      .with("allergen", () => value ? 'Yes' : 'No')
      .otherwise(() => super.attributeMap(name, value));
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="name" label="Name" errorText={this.errors.name?.[0]} error={'name' in this.errors} />
        <label style={{display: 'flex', alignItems: 'center'}}>
          <md-checkbox name="allergen" onchange={(event) => this.formState.allergen((event.target as Checkbox).checked)}></md-checkbox>
          Is Allergen?
        </label>
      </div>
    )
  }

  saveRelations(record: Ingredient): Promise<void> {
    return Promise.resolve(undefined);
  }
}
