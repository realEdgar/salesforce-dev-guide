import { LightningElement, wire, track } from 'lwc';
// Building lightning-combobox options
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJ from '@salesforce/schema/Account';

// building Gallery and Account List tabs
import getAccountsByType from '@salesforce/apex/AccountManagerController.getAccountsByType';
const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text' },
    { label: 'Rating', fieldName: 'Rating', type: 'text' },
    { label: 'Industry', fieldName: 'Industry', type: 'text' },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency' },
    { label: 'Customer Priority', fieldName: 'CustomerPriority__c', type: 'text' },
    { label: 'Type', fieldName: 'Type', type: 'text' },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text' },
];

export default class AccountManager extends LightningElement {
    // combobox properties START
    defaultRecordType;
    value;
    @track options = [];
    // combobox prperties END
    
    // Gallery and datatable properties START
    filteredAccounts = [];
    columns = COLUMNS;
    // Gallery and datatable properties END

    get noData() {
        return this.filteredAccounts.length === 0;
    }

    // combobox building logic START
    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJ })
    handleObjectInfo({ error, data }) {
        if(data){
            console.log(data);
            this.defaultRecordType = data.defaultRecordTypeId;
            console.log(this.defaultRecordType+'');
        } else if(error){
            console.log(error);
        }
    }

    @wire(getPicklistValuesByRecordType, {
        objectApiName: ACCOUNT_OBJ,
        recordTypeId: '$defaultRecordType'
    }) handlePicklistValues({ error, data }){
        if(data){
            this.options = data.picklistFieldValues.Type.values.map(picklistEntry => {
                return {
                    label: picklistEntry.label,
                    value: picklistEntry.value
                }
            })
            this.options.unshift({
                label: 'All Types',
                value: 'all'
            });
            this.value = this.options[0].value;
        } else if(error){
            console.log(error);
        }
    }

    handleTypeChange(event) {
        this.value = event.detail.value;
    }
    // combobox building logic END

    // Filtering and build Gallery and datatable logic START
    @wire(getAccountsByType, { accountType: '$value'})
    handleAccountsByType({ error, data }){
        if(data) {
            this.filteredAccounts = data;
        } else if(error) {
            console.error(error);
        }
    }
    // Filtering and build Gallery and datatable logic END
}