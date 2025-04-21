import { LightningElement, api } from 'lwc';

export default class AccountCard extends LightningElement {
    @api account;
    accountSelectedId;

    handleSelectedAccount(){
        this.accountSelectedId = this.account.Id;
        const evnt = new CustomEvent('selected', {
            detail: {
                accountId: this.accountSelectedId
            }
        });
        this.dispatchEvent(evnt);
    }
}