import {ComponentAttributes} from '@maicol07/inertia-mithril';
import {Collection} from 'collect.js';
import m, {
    Children,
    Vnode
} from 'mithril';

import {Attributes, Component} from 'mithril-utilities';
import Drawer from '~/layout/Drawer';

export interface PageAttributes<A extends Record<string, any> = Record<string, any>> extends Attributes, Required<ComponentAttributes<A>> {
}

// noinspection JSUnusedLocalSymbols
/**
 * The `Page` component
 *
 * @abstract
 */
export default abstract class Page<A extends PageAttributes = PageAttributes> extends Component<A> {
    // title?: string;

    view(vnode: Vnode<A>) {
        let contents = this.contents(vnode);
        if (contents instanceof Collection) {
            contents = contents.flatten()
                .toArray();
        }

        return this.wrapContents(vnode, contents);
    }

    // oncreate(vnode: VnodeDOM<A, this>) {
    //   super.oncreate(vnode);
    //
    //   // if (this.title) {
    //   //   document.title = `${this.title} - OpenSTAManager`;
    //   // }
    // }

    contents(vnode: Vnode<A>): Children | Collection<Children> {
        return undefined;
    }

    wrapContents(vnode: Vnode<A>, contents: Children): Children {
        return (
            <div style={{display: 'flex', gap: '16px'}}>
                <Drawer/>
                <main id="appContent" style={{marginTop: '16px'}}>
                    {contents}
                </main>
            </div>
        );
    }
}
