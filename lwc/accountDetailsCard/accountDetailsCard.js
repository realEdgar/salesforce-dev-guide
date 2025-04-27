import { LightningElement, api, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';
import ACCOUNT_INDUSTRY from '@salesforce/schema/Account.Industry';
import ACCOUNT_ANNUAL_REVENUE from '@salesforce/schema/Account.AnnualRevenue';
import ACCOUNT_CUSTOMER_PRIORITY from '@salesforce/schema/Account.CustomerPriority__c';
import ACCOUNT_TYPE from '@salesforce/schema/Account.Type';
import ACCOUNT_NUMBER from '@salesforce/schema/Account.AccountNumber';

// Account MAP
import BILLING_CITY from '@salesforce/schema/Account.BillingCity';
import SHIPPING_CITY from '@salesforce/schema/Account.ShippingCity';
import BILLING_STREET from '@salesforce/schema/Account.BillingStreet';
import SHIPPING_STREET from '@salesforce/schema/Account.ShippingStreet';
import BILLING_COUNTRY from '@salesforce/schema/Account.BillingCountry';
import SHIPPING_COUNTRY from '@salesforce/schema/Account.ShippingCountry';
import BILLING_STATE from '@salesforce/schema/Account.BillingState';
import SHIPPING_STATE from '@salesforce/schema/Account.ShippingState';
import BILLING_POSTALCODE from '@salesforce/schema/Account.BillingPostalCode';
import SHIPPING_POSTALCODE from '@salesforce/schema/Account.ShippingPostalCode';
import { getRecord } from 'lightning/uiRecordApi';

import {
    subscribe,
    unsubscribe,
    APPLICATION_SCOPE,
    MessageContext,
} from "lightning/messageService";
import ACCOUNT_MANAGER_CHANNEL from '@salesforce/messageChannel/AccountManagerChannel__c';

const FIELDS = [ACCOUNT_NAME, ACCOUNT_PHONE, ACCOUNT_INDUSTRY, ACCOUNT_ANNUAL_REVENUE, ACCOUNT_CUSTOMER_PRIORITY, ACCOUNT_TYPE, ACCOUNT_NUMBER];
const addressFields = [ACCOUNT_NAME, BILLING_CITY, SHIPPING_CITY, BILLING_STREET, SHIPPING_STREET, BILLING_COUNTRY, SHIPPING_COUNTRY, BILLING_STATE, SHIPPING_STATE, BILLING_POSTALCODE, SHIPPING_POSTALCODE];

export default class AccountDetailsCard extends NavigationMixin(LightningElement) {
    objectApiName = 'Account';
    fields = FIELDS;
    @api accountId;
    subscription;

    @wire(MessageContext)
    context;

    // Account MAP
    center;
    mapMarkers = [];

    @wire(getRecord, { recordId: '$accountId', fields: addressFields })
    handleAccountAddress({ error, data }){
        if(data){
            const { fields } = data;
            this.mapMarkers = [
                {
                    location: {
                        City: fields.BillingCity.value ?? fields.ShippingCity.value,
                        Country: fields.BillingCountry.value ?? fields.ShippingCountry.value,
                        PostalCode: fields.BillingPostalCode.value ?? fields.ShippingPostalCode.value,
                        State: fields.BillingState.value ?? fields.ShippingState.value,
                        Street: fields.BillingStreet.value ?? fields.ShippingStreet.value,
                    },
                    value: this.accountId,
                    title:fields.Name.value,
                    icon: 'standard:account',
                }
            ];
            this.center = this.mapMarkers[0];
        } else if(error){
            this.mapMarkers = [];
            console.error(error);
        }
    }

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