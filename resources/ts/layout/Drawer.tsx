import '../m3/NavigationDrawer';
import '@material/web/list/list.js';

import {
  mdiAccountBoxMultipleOutline,
  mdiAccountGroupOutline,
  mdiCartOutline,
  mdiClockOutline,
  mdiCupcake,
  mdiCurrencyUsd,
  mdiDomain,
  mdiEggOutline,
  mdiFaceAgent,
  mdiNoteTextOutline,
  mdiPackageVariantClosed,
  mdiSaleOutline,
  mdiShoppingOutline,
  mdiViewDashboardOutline,
  mdiWarehouse
} from '@mdi/js';
import {Children, Vnode} from 'mithril';

import {DrawerEntry} from './DrawerEntry';
import {Attributes, Component} from 'mithril-utilities';

export interface DrawerAttributes extends Attributes {
}

export default class Drawer<A extends DrawerAttributes = DrawerAttributes> extends Component<A> {
  view(vnode: Vnode<A>): Children {
    return (
      <md-navigation-drawer opened {...vnode.attrs}>
        <md-list>{this.entries()}</md-list>
      </md-navigation-drawer>
    );
  }

  entries() {
    return (
      <>
        <DrawerEntry route="home" icon={mdiViewDashboardOutline}>Home</DrawerEntry>
        <DrawerEntry route="ingredients" icon={mdiEggOutline}>Ingredients</DrawerEntry>
        <DrawerEntry route="donuts" icon={mdiCupcake}>Donuts</DrawerEntry>
        <DrawerEntry route="companies" icon={mdiDomain}>Companies</DrawerEntry>
        <DrawerEntry route="employees" icon={mdiFaceAgent}>Employees</DrawerEntry>
        <DrawerEntry route="accounts" icon={mdiAccountBoxMultipleOutline}>Accounts</DrawerEntry>
        <DrawerEntry route="customers" icon={mdiAccountGroupOutline}>Customers</DrawerEntry>
        <DrawerEntry route="contracts" icon={mdiNoteTextOutline}>Contracts</DrawerEntry>
        <DrawerEntry route="shifts" icon={mdiClockOutline}>Shifts</DrawerEntry>
        <DrawerEntry route="sales" icon={mdiCartOutline}>Sales</DrawerEntry>
        <DrawerEntry route="shops" icon={mdiShoppingOutline}>Shops</DrawerEntry>
        <DrawerEntry route="warehouses" icon={mdiWarehouse}>Warehouses</DrawerEntry>
        <DrawerEntry route="supplies" icon={mdiPackageVariantClosed}>Supplies</DrawerEntry>
        <DrawerEntry route="tariffs" icon={mdiCurrencyUsd}>Tariffs</DrawerEntry>
        <DrawerEntry route="discounts" icon={mdiSaleOutline}>Discounts</DrawerEntry>
      </>
    );
  }
}
