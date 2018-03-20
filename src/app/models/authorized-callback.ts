export class AuthorizedCallbackModel {
    isAuthResponseValid: boolean;
    state: string;
    constructor(isValid: boolean, state: string) {
        this.isAuthResponseValid = isValid;
        this.state = state;
    }
}