import RecordsPage from '~/Pages/template/RecordsPage';
import {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Ingredient from '~/Models/Ingredient';
import { match } from 'ts-pattern';
import {IngredientAttributes} from '~/Models/Ingredient';
import {ValueOf} from 'type-fest';

export default class Ingredients extends RecordsPage<Ingredient> {
    modelType = Ingredient;

    tableColumns(): Collection<Child> {
        return collect({
            name: <md-data-table-column>Name</md-data-table-column>,
            allergen: <md-data-table-column>Is allergen?</md-data-table-column>,
            createdAt: <md-data-table-column>Created at</md-data-table-column>,
            updatedAt: <md-data-table-column>Updated at</md-data-table-column>
        });
    }

    attributeMap(name: keyof IngredientAttributes, value: ValueOf<IngredientAttributes>) {
        return match(name)
            .with("allergen", () => value ? 1 : 0)
            .otherwise(() => super.attributeMap(name, value));
    }
}

// TODO: Add dialogs to create, edit and delete ingredients
