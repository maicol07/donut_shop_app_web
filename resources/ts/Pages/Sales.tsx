import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';

import Sale, {SaleAttributes} from '~/Models/Sale';
import RecordsPage from '~/Pages/template/RecordsPage';
import {collect, Collection} from 'collect.js';
import Stream from 'mithril/stream';
import DataTableColumn from '~/Components/DataTableColumn';
import Mithril, {Child, Children} from 'mithril';
import {FormSubmitEvent} from 'mithril-utilities/dist/Form';
import {ValueOf} from 'type-fest';
import {match} from 'ts-pattern';
import MdIcon from '~/Components/MdIcon';
import {mdiAccountOutline, mdiCalendarOutline, mdiOfficeBuilding, mdiStore, mdiTruckOutline, mdiWeb} from '@mdi/js';
import {OutlinedSegmentedButton} from '@material/web/labs/segmentedbutton/lib/outlined-segmented-button';
import Supply from '~/Models/Supply';
import Shop from '~/Models/Shop';
import Account from '~/Models/Account';
import {PageAttributes} from '~/Page';
import OnlineSale from '~/Models/OnlineSale';
import dayjs from 'dayjs';
import {showSnackbar} from '~/utils';
import {OutlinedSegmentedButtonSet} from '@material/web/labs/segmentedbuttonset/lib/outlined-segmented-button-set';
import {SaveResponse} from 'coloquent';
import ShopSale from '~/Models/ShopSale';
import Donut from '~/Models/Donut';
import {TextField} from '@material/web/textfield/lib/text-field';
import {DataTableRow, RowCheckedEventDetail} from '@maicol07/material-web-additions/data-table/lib/data-table-row';

export default class Sales extends RecordsPage<Sale> {
  modelType = Sale;
  formState = {
    date: Stream(''),
    shop: Stream(''),
    supply: Stream(''),

    // Online sale fields
    type: Stream(''),
    deliveryType: Stream(''),
    username: Stream('')
  }
  supplies: Supply[] | undefined;
  shops: Shop[] | undefined;
  accounts: Account[] | undefined;
  donuts: Donut[] | undefined;
  selectedDonuts: Donut[] = [];
  with = ['shop', 'supply', 'onlineSale', 'onlineSale.account', 'onlineSale.account.customer', 'shopSale', 'donuts', 'donuts.tariffs', 'donuts.tariffs.discount'];
  moneyFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  });

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Supply, 'supplies');
    await this.fetchRecords(Account, 'accounts');
    await this.fetchRecords(Shop, 'shops');
    await this.fetchRecords(Donut, 'donuts', ['tariffs', 'tariffs.discount']);
  }

  tableColumns(): Collection<Child> {
    return collect({
      date: <DataTableColumn filterable sortable>Date</DataTableColumn>,
      shop: <DataTableColumn filterable sortable>Shop</DataTableColumn>,
      supply: <DataTableColumn filterable sortable>Supply</DataTableColumn>,
      type: <DataTableColumn filterable sortable>Type</DataTableColumn>,
      deliveryType: <DataTableColumn filterable sortable>Delivery type</DataTableColumn>,
      username: <DataTableColumn filterable sortable>Username</DataTableColumn>,
      total: <DataTableColumn filterable>Total</DataTableColumn>
    })
  }

  openAddDialog() {
    super.openAddDialog();
    // Reset quantity pivot
    for (const donut of (this.donuts ?? [])) {
      donut.removePivot('quantity');
    }
    this.selectedDonuts = [];
  }

  loadEditDialog(record: Sale) {
    super.loadEditDialog(record);
    this.formState.date(dayjs(record.getAttribute('date')).format('YYYY-MM-DD'));
    this.formState.shop(record.getRelation('shop')?.getId() ?? '');
    this.formState.supply(record.getRelation('supply')?.getId() ?? '');
    this.formState.type(record.getRelation('onlineSale') ? 'online' : 'store');
    this.formState.username(record.getRelation('onlineSale')?.getRelation('account')?.getAttribute('username') ?? '');
    this.formState.deliveryType(record.getRelation('onlineSale')?.getAttribute('type') ?? '');
    this.selectedDonuts = record.getRelation('donuts') ?? [];
    // Reset quantity pivot
    for (const donut of (this.donuts ?? [])) {
      donut.removePivot('quantity');
    }
  }

  attributeMap(name: keyof SaleAttributes, value: ValueOf<SaleAttributes>, record: Sale) {
    return match(name)
      .with("date", () => value ? (value as Date).toLocaleDateString() : undefined)
      .with("shop", () => record.getRelation('shop')?.getAttribute('address'))
      .with("supply", () => {
        const supply = record.getRelation('supply');
        if (!supply) return '';
        return `${supply.getId()} (${dayjs(supply.getAttribute('startDate')).format('DD/MM/YYYY')} - ${dayjs(supply.getAttribute('endDate')).format('DD/MM/YYYY')})`;
      })
      .with("type", () => record.getRelation('onlineSale') ? 'online' : 'store')
      .with("deliveryType", () => record.getRelation('onlineSale')?.getAttribute('type'))
      .with("username", () => {
        const account = record.getRelation('onlineSale')?.getRelation('account');
        if (!account) return '';
        const customer = account.getRelation('customer');
        return `${account.getAttribute('username')} (${customer?.getAttribute('name')} ${customer?.getAttribute('surname')})`;
      })
      .with("total", () => {
        const donuts = record.getRelation('donuts');
        if (!donuts) return '';
        let total = 0;
        for (const donut of donuts) {
          const tariff = this.getDonutDiscountTariff(donut, donut.getPivot('quantity'), record.getAttribute('date'));
          const unitPriceWithDiscount = tariff ? donut.getAttribute('price') * (1 - (tariff.getAttribute('percentageDiscount') / 100)) : donut.getAttribute('price');
          const subtotal = unitPriceWithDiscount * donut.getPivot('quantity');
          total += subtotal;
        }
        return this.moneyFormatter.format(total);
      })
      .otherwise(() => super.attributeMap(name, value, record));
  }

  formContents(): Children {
    const type = this.formState.type();
    let typeSelect: Child;
    if (type === 'online') {
      const deliveryType = this.formState.deliveryType();
      typeSelect = (
        <>
          <md-filled-select name="username" label="Account" error-text={this.errors.account?.[0]}
                            error={'account' in this.errors}>
            <MdIcon icon={mdiAccountOutline} slot="leadingicon"/>
            {this.accounts?.map((account) => (
              <md-select-option value={account.getId()} headline={account.getAttribute('username')}></md-select-option>
            ))}
          </md-filled-select>
          <p>Delivery type:</p>
          <md-outlined-segmented-button-set name="deliveryType"
                                            onsegmented-button-set-selection={this.segmentedButtonSetSelection.bind(this)}>
            <md-outlined-segmented-button data-value="pickup" label="Shop pickup" selected={deliveryType === 'pickup'}>
              <MdIcon icon={mdiStore} slot="icon"/>
            </md-outlined-segmented-button>
            <md-outlined-segmented-button data-value="delivery" label="Home delivery"
                                          selected={deliveryType === 'delivery'}>
              <MdIcon icon={mdiTruckOutline} slot="icon"/>
            </md-outlined-segmented-button>
          </md-outlined-segmented-button-set>
          <span>The pickup shop will be sent automatically via email when receiving the order.</span>
        </>
      );
    } else if (type === 'store') {
      typeSelect = (
        <md-filled-select name="shop" label="Shop" error-text={this.errors.shop?.[0]} error={'shop' in this.errors}>
          <MdIcon icon={mdiStore} slot="leadingicon"/>
          {this.shops?.map((shop) => (
            <md-select-option value={shop.getId()} headline={shop.getAttribute('address')}></md-select-option>
          ))}
        </md-filled-select>
      );
    }
    let total = 0;

    return (
      <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
        <md-filled-text-field name="date" label="Date" error-text={this.errors.date?.[0]} error={'date' in this.errors}
                              type="date">
          <MdIcon icon={mdiCalendarOutline} slot="leadingicon"/>
        </md-filled-text-field>
        <p>Type of sale:</p>
        <md-outlined-segmented-button-set name="type"
                                          onsegmented-button-set-selection={this.segmentedButtonSetSelection.bind(this)}>
          <md-outlined-segmented-button data-value="online" label="Online" selected={type === 'online'}>
            <MdIcon icon={mdiWeb} slot="icon"/>
          </md-outlined-segmented-button>
          <md-outlined-segmented-button data-value="store" label="In store" selected={type === 'store'}>
            <MdIcon icon={mdiStore} slot="icon"/>
          </md-outlined-segmented-button>
        </md-outlined-segmented-button-set>
        {typeSelect}
        <md-filled-select name="supply"
                          label="Supply"
                          error-text={this.errors.supply?.[0]}
                          error={'supply' in this.errors}
                          supporting-text="Only for companies"
        >
          <MdIcon icon={mdiOfficeBuilding} slot="leadingicon"/>
          <md-select-option></md-select-option>
          {this.supplies?.map((supply) => (
            <md-select-option value={supply.getId()}
                              headline={supply.getId()}></md-select-option>
          ))}
        </md-filled-select>
        <h2>Products purchased</h2>
        <md-data-table>
          <md-data-table-column type="checkbox"></md-data-table-column>
          <md-data-table-column filterable sortable>Donut</md-data-table-column>
          <md-data-table-column>Unitary price</md-data-table-column>
          <md-data-table-column>Quantity</md-data-table-column>
          <md-data-table-column>Subtotal</md-data-table-column>
          {this.donuts?.map((donut) => {
            const selectedDonut = this.selectedDonuts.find((selectedDonut) => selectedDonut.getId() === donut.getId());
            if (donut.getPivot('quantity') === undefined || isNaN(donut.getPivot('quantity'))) {
              const qty = selectedDonut?.getPivot('quantity');
              donut.setPivot('quantity', qty ?? NaN);
              if (this.selectedRecord && qty === undefined || this.isNewRecord) {
                donut.setPivot('quantity', 0);
              }
            }
            const quantityName = `quantity_${donut.getId()}`;
            const tariff = this.getDonutDiscountTariff(donut, donut.getPivot('quantity'), this.formState.date());
            const unitPriceWithDiscount = tariff ? donut.getAttribute('price') * (1 - (tariff.getAttribute('percentageDiscount') / 100)) : donut.getAttribute('price');
            const subtotal = unitPriceWithDiscount * donut.getPivot('quantity');

            if (selectedDonut) {
              total += subtotal;
            }
            return (
              <md-data-table-row data-relation="donuts" data-record-id={donut.getId()}
                                 selected={selectedDonut !== undefined} onselected={this.toggleSelected.bind(this)}>
                <md-data-table-cell type="checkbox"></md-data-table-cell>
                <md-data-table-cell>
                  {donut.getAttribute('name')}
                </md-data-table-cell>
                <md-data-table-cell className="price_unit">
                  {tariff && (
                    <>
                      <s>{this.moneyFormatter.format(donut.getAttribute('price'))}</s>
                      &nbsp;
                    </>
                  )}
                  {this.moneyFormatter.format(unitPriceWithDiscount)}
                </md-data-table-cell>
                <md-data-table-cell>
                  <md-outlined-text-field
                    style={{"--md-outlined-text-field-container-padding-vertical": "6px"}}
                    name={quantityName}
                    label="Quantity"
                    type="number"
                    min="0"
                    value={donut.getPivot('quantity') as unknown as string}
                    oninput={this.updateDonutPrices.bind(this, donut)}
                  />
                </md-data-table-cell>
                <md-data-table-cell>
                  {this.moneyFormatter.format(subtotal)}
                </md-data-table-cell>
              </md-data-table-row>
            )
          })}
        </md-data-table>
        <p style={{alignSelf: 'end', fontSize: 'medium', fontWeight: 500}}>
          Total: {this.moneyFormatter.format(total)}
        </p>
      </div>
    )
  }

  toggleSelected(event: CustomEvent<RowCheckedEventDetail>) {
    const id = (event.target as DataTableRow).dataset.recordId;
    const donut = this.donuts!.find((donut) => donut.getId() === id)!;
    if (event.detail.selected) {
      this.selectedDonuts.push(donut);
    } else {
      this.selectedDonuts.splice(this.selectedDonuts.indexOf(donut), 1);
    }
  }

  getDonutDiscountTariff(donut: Donut, quantity: number, saleDate: string | number | Date | dayjs.Dayjs) {
    return donut.getRelation('tariffs')?.sort((a, b) => {
      // Sort quantity in descending order
      return b.getAttribute('quantity') - a.getAttribute('quantity');
    }).find((tariff) => {
      const discount = tariff.getRelation('discount');
      if (!discount) return false;
      saleDate = dayjs(saleDate);
      return tariff.getAttribute('quantity') <= quantity && saleDate.isAfter(discount.getAttribute('startDate')) && saleDate.isBefore(discount.getAttribute('endDate'));
    });
  }

  updateDonutPrices(donut: Donut, event: Event) {
    donut?.setPivot('quantity', (event.target as TextField).valueAsNumber);
  }

  segmentedButtonSetSelection(event: CustomEvent<{
    button: OutlinedSegmentedButton,
    selected: boolean,
    index: number
  }>) {
    const name = (event.target as OutlinedSegmentedButtonSet).getAttribute('name') as 'type' | 'deliveryType';
    const value = event.detail.button.dataset.value!;
    this.formState[name](value);
  }

  // @ts-ignore
  async afterSave(record: Sale, response: SaveResponse<Sale>, event: FormSubmitEvent): Promise<void> {
    await super.afterSave(record, response, event);

    if (this.formState.type() === 'online') {
      let onlineSale = record.getRelation('onlineSale');
      if (!onlineSale) {
        onlineSale = new OnlineSale();
        onlineSale.setRelation('sale', record);
      }
      onlineSale.setAttribute('type', this.formState.deliveryType())
      onlineSale.setRelation('account', this.accounts?.find((account) => account.getId() === this.formState.username()));

      // @ts-ignore
      const response = await Account.query<Account>().with('customer').where('id', this.formState.username()).first();
      const account = response.getData();

      // Check if the account has all the required data
      const {cap, city, street, houseNumber, province} = account?.getRelation('customer')?.getAttributes() ?? {};
      if (this.formState.deliveryType() === 'delivery' && (!cap || !city || !street || !houseNumber || !province)) {
        void showSnackbar('The account has not all the required data for the delivery', false);
        throw new Error('The account has not all the required data for the delivery');
      }
      await onlineSale.save();
      const shopSale = record.getRelation('shopSale');
      if (shopSale) {
        await shopSale.delete();
      }
    } else {
      let shopSale = record.getRelation('shopSale');
      if (shopSale === undefined) {
        shopSale = new ShopSale();
        shopSale.setRelation('sale', record);
        await shopSale.save();
      }
      const onlineSale = record.getRelation('onlineSale');
      if (onlineSale) {
        await onlineSale.delete();
      }
    }

    record.setRelation('donuts', this.selectedDonuts
      .map((donut) => {
        const quantityName = `quantity_${donut.getId()}`;
        donut.setPivot('quantity', event.data.get(quantityName) as unknown as number);
        return donut;
      })
      .filter((donut) => donut.getPivot('quantity') > 0)
    );
    await record.save()
  }

  async saveRelations(record: Sale, event: FormSubmitEvent) {
    record.setRelation('supply', this.supplies?.find((supply) => supply.getId() === this.formState.supply()));
    if (this.formState.type() === 'online') {
      record.setRelation('shop', undefined);
      record.setAttribute('shop_id', null);
    } else {
      record.setRelation('shop', this.shops?.find((shop) => shop.getId() === this.formState.shop()));
    }
  }
}
