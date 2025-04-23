import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_ANNUAL_REVENUE from '@salesforce/schema/Account.AnnualRevenue';
import ACCOUNT_CUSTOMER_PRIORITY from '@salesforce/schema/Account.CustomerPriority__c';
import ACCOUNT_TYPE from '@salesforce/schema/Account.Type';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from "lightning/messageService";
import ACCOUNT_MANAGER_CHANNEL from '@salesforce/messageChannel/AccountManagerChannel__c';

const FIELDS = [ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_INDUSTRY, ACCOUNT_ANNUAL_REVENUE, ACCOUNT_CUSTOMER_PRIORITY, ACCOUNT_TYPE, ACCOUNT_NUMBER];

export default class AccountDetailsCard extends NavigationMixin(LightningElement) {
    objectApiName = 'Account';
    fields = FIELDS;
    @api accountId;
    subscription;

    @wire(MessageContext)
    context;

    connectedCallback(){
        this.handleSubscription();
    }

    disconnectedCallback(){
        this.handleUnsubscription();
    }

    handleViewDetailsNavigation() {
        const pageReference = {
            type: 'standard__recordPage',
            attributes: {
                objectApiName: this.objectApiName,
                recordId: this.accountId,
                actionName: 'view'
            }
        }
        this[NavigationMixin.Navigate](pageReference, false);
    }

    handleSubscription() {
        this.subscription = subscribe(
                            this.context, 
                            ACCOUNT_MANAGER_CHANNEL, 
                            (message) => this.handleMessage(message), 
                            { scope: APPLICATION_SCOPE }
                        );
    }

    handleMessage(message) {
        this.accountId = message.recordId;
    }

    handleUnsubscription(){
        unsubscribe(this.subscription);
    }
}