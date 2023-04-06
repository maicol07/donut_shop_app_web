import Mithril from 'mithril';

//per far capire a ts di che tipo è m, e che esiste
declare global {
    interface Window {
        m: typeof Mithril;
    }
    const m: typeof Mithril;
}
