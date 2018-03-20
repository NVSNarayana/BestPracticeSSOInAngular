export class OverlayArgs {
    component: any;
    componentData: any;
    needBackArrow: boolean;
    needHeader: boolean;
    headerHtml: string;
    needBanner: boolean;
    bannerHtml: string;
    zIndex: string;
    css: string;
    close: any;
    id:string;

    constructor({ component, componentData, needBackArrow, needHeader, headerHtml, needBanner, bannerHtml, css }:
        {
            component: any,
            componentData?: any,
            needBackArrow?: boolean,
            needHeader?: boolean,
            headerHtml?: string,
            needBanner?: boolean,
            bannerHtml?: string,
            css?: string,
        }) {
        this.component = component;
        this.componentData = componentData;
        this.needBackArrow = needBackArrow == null ? true : needBackArrow;
        this.needHeader = needHeader == null ? true : needHeader;
        this.headerHtml = headerHtml;
        this.needBanner = needBanner;
        this.bannerHtml = bannerHtml;
        this.css = css;
    }
}
