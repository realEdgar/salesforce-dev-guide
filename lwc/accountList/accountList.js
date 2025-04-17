import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import FIELD_NAME from '@salesforce/schema/Account.Name';
import FIELD_INDUSTRY from '@salesforce/schema/Account.Industry';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

const ACTIONS = [
    { label: 'View', name: 'view' },
    { label: 'Edit', name: 'edit' },
];

const COLUMNS = [
    { label: 'Account Name', fieldName: FIELD_NAME.fieldApiName, type: 'button', 
        typeAttributes: {
            label: { fieldName: 'buttonLabel' },
            variant: 'base',
            name: 'view'
        }
    },
    { label: 'Industry', fieldName: FIELD_INDUSTRY.fieldApiName, type: 'text' },
    { type: 'action', typeAttributes: { rowActions: ACTIONS } }
];

export default class AccountList extends NavigationMixin(LightningElement) {
    columns = COLUMNS;
    data = [];

    get notAccountData() {
        return this.data.length === 0;
    }

    @wire(getAccounts)
    handleAccounts({ error, data }){
        if(data){
            this.data = data.map(row => {
                const newRow = { ...row };
                newRow.buttonLabel = row.Name;

                return newRow;
            });
            const toast = new ShowToastEvent({
                title: 'Success!',
                message: 'Data Table successfuly uploaded...',
                variant: 'success'
            });
            this.dispatchEvent(toast);
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
}