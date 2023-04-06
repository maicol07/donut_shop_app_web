import {Card} from '@maicol07/material-web-additions/card/lib/card';
import {DataTable} from '@maicol07/material-web-additions/data-table/lib/data-table';
import {DataTableCell} from '@maicol07/material-web-additions/data-table/lib/data-table-cell';
import {DataTableColumn} from '@maicol07/material-web-additions/data-table/lib/data-table-column';
import {DataTableFooter} from '@maicol07/material-web-additions/data-table/lib/data-table-footer';
import {DataTableRow} from '@maicol07/material-web-additions/data-table/lib/data-table-row';
import {LayoutGrid} from '@maicol07/material-web-additions/layout-grid/lib/layout-grid';
import {LayoutGridInner} from '@maicol07/material-web-additions/layout-grid/lib/layout-grid-inner';
import {Badge} from '@material/web/badge/lib/badge';
import {Button} from '@material/web/button/lib/button';
import {LinkButton} from '@material/web/button/lib/link-button';
import {Checkbox} from '@material/web/checkbox/lib/checkbox';
import {Dialog} from '@material/web/dialog/lib/dialog';
import {Fab} from '@material/web/fab/lib/fab';
import {FabExtended} from '@material/web/fab/lib/fab-extended';
import {Field} from '@material/web/field/lib/field';
import {FocusRing} from '@material/web/focus/lib/focus-ring';
import {Icon} from '@material/web/icon/lib/icon';
import {IconButton} from '@material/web/iconbutton/lib/icon-button';
import {IconButtonToggle} from '@material/web/iconbutton/lib/icon-button-toggle';
import {LinkIconButton} from '@material/web/iconbutton/lib/link-icon-button';
import {Divider} from '@material/web/divider/lib/divider';
import {List} from '@material/web/list/lib/list';
import {ListItem} from '@material/web/list/lib/listitem/list-item';
import {ListItemLink} from '@material/web/list/lib/listitemlink/list-item-link';
import {Menu} from '@material/web/menu/lib/menu';
import {MenuItem} from '@material/web/menu/lib/shared';
import {NavigationBar} from '@material/web/navigationbar/lib/navigation-bar';
import {NavigationDrawer} from '@material/web/navigationdrawer/lib/navigation-drawer';
import {NavigationDrawerModal} from '@material/web/navigationdrawer/lib/navigation-drawer-modal';
import {NavigationTab} from '@material/web/navigationtab/lib/navigation-tab';
import {Radio} from '@material/web/radio/lib/radio';
import {Ripple} from '@material/web/ripple/lib/ripple';
import {SegmentedButton} from '@material/web/segmentedbutton/lib/segmented-button';
import {SegmentedButtonSet} from '@material/web/segmentedbuttonset/lib/segmented-button-set';
import {Switch} from '@material/web/switch/lib/switch';
import {TextField} from '@material/web/textfield/lib/text-field';
import {Collection} from 'collect.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import {Properties as CSSProperties} from 'csstype';
import {
  Attributes as MithrilAttributes,
  Vnode
} from 'mithril';
import Stream from 'mithril/stream';

/**
 * Note: Listing of HTML elements is needed for IDEs to autocomplete them.
 */

export type JSXElement<T> = Omit<Partial<T>, 'children' | 'style'> & Mithril.Attributes;

export type VnodeCollectionItem = Record<string, Vnode>;
export type VnodeCollection = Collection<VnodeCollectionItem>;

declare global {
  namespace Mithril {
    interface Attributes extends Omit<
    MithrilAttributes,
    'oninit' | 'onbeforeremove' | 'onbeforeupdate' | 'oncreate' | 'onupdate' | 'onremove' | 'class'
    > {
      dialogAction?: string | 'ok' | 'discard' | 'close' | 'cancel' | 'accept' | 'decline',
      style?: string | CSSProperties | Record<string, any>,
      state?: Stream<any>
    }
  }

  namespace JSX {
      type IntrinsicElementMap = {
          [tag in keyof HTMLElementTagNameMap]: Partial<HTMLElementTagNameMap[tag]>;
      };
      interface IntrinsicElements extends IntrinsicElementMap {
      /* Material Web Additions */
      'md-layout-grid': JSXElement<LayoutGrid>;
      'md-layout-grid-inner': JSXElement<LayoutGridInner>;
      'md-card': JSXElement<Card>;
      'md-elevated-card': JSXElement<Card>;
      'md-outlined-card': JSXElement<Card>;
      'md-data-table': JSXElement<DataTable>;
      'md-data-table-cell': JSXElement<DataTableCell>;
      'md-data-table-column': JSXElement<DataTableColumn>;
      'md-data-table-row': JSXElement<DataTableRow>;
      'md-data-table-footer': JSXElement<DataTableFooter>;

      /* Material Web Components */
      'md-badge': JSXElement<Badge>;
      'md-elevated-button': JSXElement<Button>;
      'md-elevated-link-button': JSXElement<LinkButton>;
      'md-filled-button': JSXElement<Button>;
      'md-filled-link-button': JSXElement<LinkButton>;
      'md-outlined-button': JSXElement<Button>;
      'md-outlined-link-button': JSXElement<LinkButton>;
      'md-text-button': JSXElement<Button>;
      'md-text-link-button': JSXElement<LinkButton>;
      'md-tonal-button': JSXElement<Button>;
      'md-tonal-link-button': JSXElement<LinkButton>;
      'md-checkbox': JSXElement<Checkbox>;
      'md-dialog': JSXElement<Dialog>;
      'md-fab': JSXElement<Fab>;
      'md-fab-extended': JSXElement<FabExtended>;
      'md-filled-field': JSXElement<Field>;
      'md-outlined-field': JSXElement<Field>;
      'md-focus-ring': JSXElement<FocusRing>;
      'md-icon': JSXElement<Icon>;
      'md-filled-icon-button': JSXElement<IconButton>;
      'md-filled-icon-button-toggle': JSXElement<IconButtonToggle>;
      'md-filled-link-icon-button': JSXElement<LinkIconButton>;
      'md-filled-tonal-icon-button': JSXElement<IconButton>;
      'md-filled-tonal-icon-button-toggle': JSXElement<IconButtonToggle>;
      'md-filled-tonal-link-icon-button': JSXElement<LinkIconButton>;
      'md-outlined-icon-button': JSXElement<IconButton>;
      'md-outlined-icon-button-toggle': JSXElement<IconButtonToggle>;
      'md-outlined-link-icon-button': JSXElement<LinkIconButton>;
      'md-standard-icon-button': JSXElement<IconButton>;
      'md-standard-icon-button-toggle': JSXElement<IconButtonToggle>;
      'md-standard-link-icon-button': JSXElement<LinkIconButton>;
      'md-list': JSXElement<List>;
      'md-divider': JSXElement<Divider>;
      'md-list-item': JSXElement<ListItem>;
      'md-list-item-link': JSXElement<ListItemLink>;
      'md-menu': JSXElement<Menu>;
      'md-menu-item': JSXElement<MenuItem>;
      'md-navigation-bar': JSXElement<NavigationBar>;
      'md-navigation-drawer': JSXElement<NavigationDrawer>;
      'md-navigation-drawer-modal': JSXElement<NavigationDrawerModal>;
      'md-navigation-tab': JSXElement<NavigationTab>;
      'md-radio': JSXElement<Radio>;
      'md-ripple': JSXElement<Ripple>;
      'md-outlined-segmented-button': JSXElement<SegmentedButton>;
      'md-outlined-segmented-button-set': JSXElement<SegmentedButtonSet>;
      'md-switch': JSXElement<Switch>;
      'md-filled-text-field': JSXElement<TextField>;
    }
  }
}
