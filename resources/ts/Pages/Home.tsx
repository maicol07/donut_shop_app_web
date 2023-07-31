import Page, {PageAttributes} from '~/Page';
import '@maicol07/material-web-additions/card/filled-card.js';
import '@maicol07/material-web-additions/layout-grid/layout-grid.js';
import '@material/web/list/list-item.js';
import {Vnode} from 'mithril';
import MdIcon from '~/Components/MdIcon';
import {mdiCashMultiple, mdiRefresh, mdiShoppingOutline, mdiTrophyOutline,} from '@mdi/js';
import {router} from '@maicol07/inertia-mithril';
import route from 'ziggy-js';

export interface HomeAttributes extends PageAttributes<{
  mostSoldDonuts: {
    name: string;
    sales: number;
  }[],
  salesProceeds: {
    inShop: number;
    online: number;
  },
  shopsProceeds: {
    address: string;
    total_proceeds: number;
  }[],
}> {}

//contains navigation drawer and baseline components used in every view
export default class Home extends Page<HomeAttributes> {
  private moneyFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR'
  });
    contents(vnode: Vnode<HomeAttributes>) {
      console.table(vnode.attrs.page.props);
        return(
          <>
            <h1 className="display-large">Home</h1>
            <md-layout-grid style={{textAlign: 'center', '--md-card-padding': '16px'}}>
              <md-filled-card>
                <div>
                  <MdIcon icon={mdiCashMultiple} style="--_icon-size: 36px;"/>
                  <h2 className="headline-small">Shop sales proceeds</h2>
                </div>
                <span style={{fontSize: '36px'}}>
                  {this.moneyFormatter.format(vnode.attrs.page.props.salesProceeds.inShop)}
                </span>
              </md-filled-card>
              <md-filled-card>
                <div>
                  <MdIcon icon={mdiCashMultiple} style="--_icon-size: 36px;"/>
                  <h2 className="headline-small">Online sales proceeds</h2>
                </div>
                <span style={{fontSize: '36px'}}>
                  {this.moneyFormatter.format(vnode.attrs.page.props.salesProceeds.online)}
                </span>
              </md-filled-card>
              <md-filled-card>
                <div>
                  <MdIcon icon={mdiTrophyOutline} style="--_icon-size: 36px;"/>
                  <h2 className="headline-small">Best Selling Donuts</h2>
                </div>
                <md-list>
                  {vnode.attrs.page.props.mostSoldDonuts.map((donut) =>
                    <md-list-item headline={donut.name} disabled style={{'--md-list-item-list-item-disabled-label-text-opacity': 1}}>
                      <span slot='end'>{donut.sales}</span>
                    </md-list-item>
                    )
                  }
                </md-list>

              </md-filled-card>
              <md-filled-card>
                <div>
                  <MdIcon icon={mdiShoppingOutline} style="--_icon-size: 36px;"/>
                  <h2 className="headline-small">Shop Proceeds</h2>
                </div>
                <md-list>
                  {vnode.attrs.page.props.shopsProceeds.map((shop) =>
                    <md-list-item headline={shop.address} disabled style={{'--md-list-item-list-item-disabled-label-text-opacity': 1}}>
                      <span slot='end'>{this.moneyFormatter.format(shop.total_proceeds)}</span>
                    </md-list-item>
                  )
                  }
                </md-list>

              </md-filled-card>
            </md-layout-grid>
            <md-fab className="fab-container" id="refresh-records" ariaLabel="Refresh" onclick={this.onRefreshButtonClicked.bind(this)}>
              <MdIcon icon={mdiRefresh} slot="icon"/>
            </md-fab>
          </>
        )
    }

    onRefreshButtonClicked() {
      router.visit(route('home'))
    }
}
