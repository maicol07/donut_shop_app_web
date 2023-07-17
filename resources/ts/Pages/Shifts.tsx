import RecordsPage from '~/Pages/template/RecordsPage';
import Mithril, {Child} from 'mithril';
import {collect, Collection} from 'collect.js';
import Shift, {ShiftAttributes} from '~/Models/Shift';
import {match, P} from 'ts-pattern';
import {ValueOf} from 'type-fest';
import Stream from 'mithril/stream';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/checkbox/checkbox.js';
import DataTableColumn from '~/Components/DataTableColumn';
import dayjs from 'dayjs';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';

export default class Shifts extends RecordsPage<Shift> {
  modelType = Shift;
  formState = {
    weekDay: Stream(''),
    startTime: Stream(''),
    endTime: Stream(''),
  }

  loadEditDialog(record: Shift) {
    super.loadEditDialog(record);
    this.formState.startTime(dayjs(record.getAttribute('startTime')).format('HH:mm'));
    this.formState.endTime(dayjs(record.getAttribute('endTime')).format('HH:mm'));
  }

  tableColumns(): Collection<Child> {
    return collect({
      weekDay: <DataTableColumn filterable sortable>Week Day</DataTableColumn>,
      startTime: <DataTableColumn filterable sortable>Start Time</DataTableColumn>,
      endTime: <DataTableColumn filterable sortable>End Time</DataTableColumn>,
      //employees: <DataTableColumn filterable sortable>Employees</DataTableColumn>, non  toppo utile
      createdAt: <DataTableColumn filterable sortable>Created at</DataTableColumn>,
      updatedAt: <DataTableColumn filterable sortable>Updated at</DataTableColumn>
    });
  }

  attributeMap(name: keyof ShiftAttributes, value: ValueOf<ShiftAttributes>, record: Shift) {
    return match(name)
      .with(
        P.union('startTime', 'endTime'),
        () => dayjs(value as string).format('HH:mm')
      )
      // .with('employees', () => {
      //   return record.getRelation('contract')
      //     ?.filter((contract) => contract.getAttribute('endDate').getDate() > new Date().getDate()) //contratti validi
      //     ?.map((contract) => contract.getRelation('employee')) //da contratto a employee
      // })
      .otherwise(() => super.attributeMap(name,  value, record))
  }

  formContents(): Mithril.Children {
    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-select name="weekDay" label="Week Day">
            <md-select-option value='monday' headline="Monday"></md-select-option>
            <md-select-option value='tuesday' headline="Tuesday"></md-select-option>
            <md-select-option value='wednesday' headline="Wednesday"></md-select-option>
            <md-select-option value='thursday' headline="Thursday"></md-select-option>
            <md-select-option value='friday' headline="Friday"></md-select-option>
            <md-select-option value='saturday' headline="Saturday"></md-select-option>
            <md-select-option value='sunday' headline="Sunday"></md-select-option>
        </md-filled-select>
        <md-filled-text-field name="startTime" label="Start Time" type="time"  />
        <md-filled-text-field name="endTime" label="End Time" type="time" />
      </div>
    )
  }

  async saveRelations(record: Shift, event: FormSubmitEvent) {
  }

}
//error-text={this.errors?.endTime?.[0]} error={'endTime' in this.errors}
