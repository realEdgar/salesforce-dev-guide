import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import FIELD_NAME from '@salesforce/schema/Account.Name';
import FIELD_INDUSTRY from '@salesforce/schema/Account.Industry';
import getAccountsPagination from '@salesforce/apex/AccountController.getAccountsPagination';
import numberOfAccounts from '@salesforce/apex/AccountController.numberOfAccounts';

const ACTIONS = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];

const COLUMNS = [
    { label: 'Account Name', fieldName: FIELD_NAME.fieldApiName, type: 'text' },
    { label: 'Industry', fieldName: FIELD_INDUSTRY.fieldApiName, type: 'text' },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

export default class AccountListPagination extends NavigationMixin(LightningElement) {
    // datatable attributes
    columns = COLUMNS;
    data = [];

    // Pagination
    totalPages;
    currentPage = 1;
    pageSize = 3;

    get notAccountData() {
        return this.data.length === 0;
    }

    @wire(numberOfAccounts)
    handleNoAccounts({ error, data }){
        if(data){
            this.totalPages = Math.ceil(data / this.pageSize);
        } else if(error) {
            const message = error.body.message || 'Something Went Wrong!';

            const toast = new ShowToastEvent({
                title: 'Error!',
                message: message,
                variant: 'error'
            });
            this.dispatchEvent(toast);
        }
    }

    @wire(getAccountsPagination, { pageSize: '$pageSize', currentPage: '$currentPage' })
    handleAccounts({ error, data }){
        if(data){
            this.data = data;
        } else if(error){
            const message = error.body.message || 'Something Went Wrong!';

            const toast = new ShowToastEvent({
                title: 'Error!',
                message: message,
                variant: 'error'
            });
            this.dispatchEvent(toast);
        }
    }

    handleRowAction(event){
        const recordId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        
        const pageRef = {
            type: 'standard__recordPage',
            attributes: {
                objectApiName: 'Account',
                recordId: recordId,
                actionName: actionName || 'view'
            }
        }

        this[NavigationMixin.Navigate](pageRef);
    }

    handlePrevious() {
        this.currentPage--;
    }

    handleNext() {
        this.currentPage++;
    }
}