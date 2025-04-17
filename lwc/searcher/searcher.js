/**
 * Description: this component search contacts by name using Apex: ContactSearchController
 *              leveraging the wire service and reactivity.
 * Controller: ContactSearchController
 * Methods: [searchContacts]
 */
import { LightningElement, wire } from 'lwc';
import searchContacts from '@salesforce/apex/ContactSearchController.searchContacts';

export default class Searcher extends LightningElement {
    inputValue = '';

    get isResult() {
        return (this.contacts?.data?.length || 0) > 0;
    }

    @wire(searchContacts, {
        contactName: '$inputValue'
    }) contacts;

    handleKeyup(event) {
        this.inputValue = event.target.value;
    }
}