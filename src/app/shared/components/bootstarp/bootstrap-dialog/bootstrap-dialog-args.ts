//#region dialog args
export class BootstrapAlertArgs {
    constructor({ needHeader, headerHtml, contentHtml, needFooter, closeCallback, settings }:
        {
            needHeader?: boolean,
            headerHtml?: string,
            contentHtml: string,
            needFooter?: boolean
            closeCallback?: any,
            settings?: any
        }) {
        this.needHeader = needHeader == null ? true : needHeader;
        this.headerHtml = headerHtml;
        this.contentHtml = contentHtml;
        this.needFooter = needFooter == null ? true : needFooter;
        this.closeCallback = closeCallback;
        this.settings = settings;
    }
    needHeader: boolean;
    headerHtml: string;
    contentHtml: string;
    needFooter: boolean;
    closeCallback: any;
    settings: any;
}

export class BootstrapConfirmArgs extends BootstrapAlertArgs {
    constructor({ needHeader, headerHtml, contentHtml, needFooter, closeCallback, settings,
        okButtonText, cancelButtonText, okCallback }
        : {
            needHeader?: boolean,
            headerHtml?: string,
            contentHtml: string,
            needFooter?: boolean
            closeCallback?: any,
            settings?: any,
            okButtonText?: string,
            cancelButtonText?: string,
            okCallback?: any

        }) {
        super({ needHeader, headerHtml, contentHtml, needFooter, closeCallback, settings });
        this.okButtonText = okButtonText;
        this.cancelButtonText = cancelButtonText;
        this.okCallback = okCallback;
    }
    okButtonText: string;
    cancelButtonText: string;
    okCallback: any;
}

export class BootstrapComponentDialogArgs {
    constructor({ component, componentData, needHeader, headerHtml, needCloseButton,
        needFooter, needOkButton, needCancelButton, okButtonText, cancelButtonText,
        okCallback, cancelCallback, dialogSettings, css }:
        {
            component: any,
            componentData?: any,
            needHeader?: boolean,
            headerHtml?: string,
            needCloseButton?: boolean,
            needFooter?: boolean,
            needOkButton?: boolean,
            needCancelButton?: boolean,
            okButtonText?: string,
            cancelButtonText?: string,
            okCallback?: any,
            cancelCallback?: any,
            dialogSettings?: any,
            css?: string
        }) {
        this.component = component;
        this.componentData = componentData;

        this.needHeader = needHeader;
        this.headerHtml = headerHtml;
        this.needCloseButton = needCloseButton;

        this.needFooter = needFooter;
        this.needOkButton = needOkButton;
        this.needCancelButton = needCancelButton;
        this.okButtonText = okButtonText ? okButtonText.toString() : "OK";
        this.cancelButtonText = cancelButtonText ? cancelButtonText.toString() : "CANCEL";
        this.okCallback = okCallback;
        this.cancelCallback = cancelCallback;
        this.dialogSettings = dialogSettings;
        this.css = css;
    }
    component: any;
    componentData: any;
    needHeader: boolean;
    headerHtml: string;
    needCloseButton: boolean;
    needFooter: boolean;
    needOkButton: boolean;
    needCancelButton: boolean;
    okButtonText: string;
    cancelButtonText: string;
    okCallback: any;
    cancelCallback: any;
    dialogSettings: any;
    css: string;
    id: string;
    open: any;
    close: any;
}
  //#endregion