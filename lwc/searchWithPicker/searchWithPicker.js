import { LightningElement, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import FIELD_NAME from '@salesforce/schema/Contact.Name';
import FIELD_PHONE from '@salesforce/schema/Contact.Phone';
import FIELD_EMAIL from '@salesforce/schema/Contact.Email';

const fields = [FIELD_NAME, FIELD_EMAIL, FIELD_PHONE];

export default class SearchWithPicker extends LightningElement {
    recordId;
    fields = fields;

    get isRecord() {
        return this.recordId != undefined;
    }

    handleRecordSelect(event) {
        this.recordId = event.detail.recordId;
    }
}