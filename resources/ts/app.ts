import m from 'mithril'
import { createInertiaApp } from '@maicol07/inertia-mithril'
import '~/../scss/app.scss';

window.m = m;

await createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true })
        return pages[`./Pages/${name}.tsx`]
    },
    setup({ el, App, props }) {
        if (!el) {
            throw new Error("No mounting HTMLElement found");
        }

        m.mount(el, {
            view: () => m(App, props) // or with JSX: m.mount(el, <App {...props}/>)
        });
    },
})
