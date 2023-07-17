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
  with = ['shop', 'supply', 'onlineSale', 'onlineSale.account', 'shopSale'];

  async oninit(vnode: Mithril.Vnode<PageAttributes, this>): Promise<void> {
    await super.oninit(vnode);
    await this.fetchRecords(Supply, 'supplies');
    await this.fetchRecords(Account, 'accounts');
    await this.fetchRecords(Shop, 'shops');
  }

  tableColumns(): Collection<Child> {
    return collect({
      date: <DataTableColumn filterable sortable>Date</DataTableColumn>,
      shop: <DataTableColumn filterable sortable>Shop</DataTableColumn>,
      supply: <DataTableColumn filterable sortable>Supply</DataTableColumn>,
      type: <DataTableColumn filterable sortable>Type</DataTableColumn>,
      deliveryType: <DataTableColumn filterable sortable>Delivery type</DataTableColumn>,
      username: <DataTableColumn filterable sortable>Username</DataTableColumn>
    })
  }

  loadEditDialog(record: Sale) {
    super.loadEditDialog(record);
    this.formState.date(dayjs(record.getAttribute('date')).format('YYYY-MM-DD'));
    this.formState.shop(record.getRelation('shop')?.getId() ?? '');
    this.formState.supply(record.getRelation('supply')?.getId() ?? '');
    this.formState.type(record.getRelation('onlineSale') ? 'online' : 'store');
    this.formState.username(record.getRelation('onlineSale')?.getRelation('account')?.getAttribute('username') ?? '');
    this.formState.deliveryType(record.getRelation('onlineSale')?.getAttribute('type') ?? '');
  }

  attributeMap(name: keyof SaleAttributes, value: ValueOf<SaleAttributes>, record: Sale) {
    return match(name)
      .with("date", () => value ? (value as Date).toLocaleDateString() : undefined)
      .with("shop", () => record.getRelation('shop')?.getAttribute('address'))
      .with("supply", () => {
        const supply = record.getRelation('supply');
        return `${supply?.getId()} (${dayjs(supply?.getAttribute('startDate')).format('DD/MM/YYYY')} - ${dayjs(supply?.getAttribute('endDate')).format('DD/MM/YYYY')})`;
      })
      .with("type", () => record.getRelation('onlineSale') ? 'online' : 'store')
      .with("deliveryType", () => record.getRelation('onlineSale')?.getAttribute('type'))
      .with("username", () => record.getRelation('onlineSale')?.getRelation('account')?.getAttribute('username'))
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
            <md-outlined-segmented-button data-value="delivery" label="Home delivery" selected={deliveryType === 'delivery'}>
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
      </div>
    )
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
