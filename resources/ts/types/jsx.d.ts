import type * as CSS from 'csstype';

declare module 'csstype' {
    interface Properties {
        // Allow namespaced CSS Custom Properties
        [index: `--md-${string}`]: any;

        [index: `--mdc-${string}`]: any;
    }
}

declare module 'mithril' {
    // @ts-ignore - Type is global
  interface Attributes extends LayoutGridAttributes {
        // Needed for md-dialog
        'dialog-action'?: string | 'ok' | 'discard' | 'close' | 'cancel' | 'accept' | 'decline',
        style?: string | Partial<CSS.Properties> | Partial<CSSStyleDeclaration>,
        autoAnimate?: boolean
    }
}
