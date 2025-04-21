import { LightningElement, wire } from 'lwc';
// Building lightning-combobox options
import { getObjectInfo, getPicklistValuesByRecordType } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJ from '@salesforce/schema/Account';

export default class AccountManager extends LightningElement {
    // combobox properties START
    defaultRecordType;
    value;
    options = [];
    // combobox prperties END
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
            console.log(data.picklistFieldValues.Type.values);
            this.options = data.picklistFieldValues.Type.values;
            this.value = this.options[0].value;
        } else if(error){
            console.log(error);
        }
    }

    handleTypeChange(event) {
        this.value = event.detail.value;
    }
    // combobox building logic END
}