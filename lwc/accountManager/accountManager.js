import { LightningElement, wire, track } from 'lwc';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
// Building lightning-combobox options
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJ from '@salesforce/schema/Account';

// building Gallery and Account List tabs
import getAccountsByType from '@salesforce/apex/AccountManagerController.getAccountsByType';
const COLUMNS = [
    { label: 'Account Name', fieldName: 'Name', type: 'text', editable: true },
    { label: 'Rating', fieldName: 'Rating', type: 'text', editable: true },
    { label: 'Industry', fieldName: 'Industry', type: 'text', editable: true },
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', type: 'currency', editable: true },
    { label: 'Customer Priority', fieldName: 'CustomerPriority__c', type: 'text', editable: true },
    { label: 'Type', fieldName: 'Type', type: 'text', editable: true },
    { label: 'Account Number', fieldName: 'AccountNumber', type: 'text', editable: true },
];

export default class AccountManager extends NavigationMixin(LightningElement) {
    // combobox properties START
    defaultRecordType;
    value;
    @track options = [];
    // combobox prperties END
    
    // Gallery and datatable properties START
    filteredAccounts = [];
    columns = COLUMNS;
    draftValues = [];
    wiredAccounts;
    // Gallery and datatable properties END

    get noData() {
        return this.filteredAccounts.length === 0;
    }

    // Properties for selected account START
    selectedAccountId;
    // Properties for selected account END

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
    handleAccountsByType(res){
        this.wiredAccounts = res;
        const { error, data } = res;
        if(data) {
            this.filteredAccounts = data;
        } else if(error) {
            console.error(error);
        }
    }
    // Filtering and build Gallery and datatable logic END

    // Logic for selected account START
    handleSelectedAccount(event) {
        this.selectedAccountId = event.detail.accountId;
    }
    // Logic for selected account END

    // Save records in inline edition START
    async handleSave(event) {
        this.draftValues = event.detail.draftValues;

        const toUpdatePromises = this.draftValues.map(field => {
            const fields = { ...field }
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
    // Save records in inline edition END

    // Create Account Logic START
    handleNewAccount() {
        const pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            }
        }
        this[NavigationMixin.Navigate](pageReference);
    }
    // Create Account Logic END
}