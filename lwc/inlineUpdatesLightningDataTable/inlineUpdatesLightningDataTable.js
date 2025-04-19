import { LightningElement, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import FIELD_NAME from '@salesforce/schema/Account.Name';
import FIELD_INDUSTRY from '@salesforce/schema/Account.Industry';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const COLUMNS = [
    { label: 'Account Name', fieldName: FIELD_NAME.fieldApiName, type: 'text', editable: true },
    { label: 'Industry', fieldName: FIELD_INDUSTRY.fieldApiName, type: 'text', editable: true }
];

export default class InlineUpdatesLightningDataTable extends LightningElement {
    data = [];
    columns = COLUMNS;
    wiredAccounts;
    draftValues = [];

    get notAccountData() {
        return this.data.length === 0;
    }

    @wire(getAccounts)
    handleAccounts(results){
        this.wiredAccounts = results;
        const { error, data } = results;
        
        if(data){
            this.data = data;
        } else if(error) {
            console.error(error);
        }
    }

    async handleSave(event) {
        this.draftValues = event.detail.draftValues;

        const toUpdatePromises = this.draftValues.map(fieldValues => {
            const fields = { ...fieldValues }
            return updateRecord({ fields });
        });

        Promise.all(toUpdatePromises)
        .then((result) => {
            const toast = new ShowToastEvent({
                title: 'Success!',
                message: 'Records updated successfully',
                variant: 'success'
            });

            this.dispatchEvent(toast);
            refreshApex(this.wiredAccounts);
        }).catch(error => console.error(error))
        .finally(() => {
            this.draftValues = [];
        })
    }
}