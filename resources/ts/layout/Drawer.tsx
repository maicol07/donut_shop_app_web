import '../m3/NavigationDrawer';
import '@material/web/list/list.js';

import {
  mdiAccountGroupOutline,
  mdiViewDashboardOutline
} from '@mdi/js';
import {
  Children,
  Vnode
} from 'mithril';

import {DrawerEntry} from './DrawerEntry';
import {Attributes, Component} from 'mithril-utilities';

export interface DrawerAttributes extends Attributes {
}

export default class Drawer<A extends DrawerAttributes = DrawerAttributes> extends Component<A> {
  view(vnode: Vnode<A>): Children {
    return (
      <md-navigation-drawer opened>
        <md-list>{this.entries()}</md-list>
      </md-navigation-drawer>
    );
  }

  entries() {
    return (
        <>
            <DrawerEntry route="home" icon={mdiViewDashboardOutline}>Home</DrawerEntry>
        </>
    );
  }
}
