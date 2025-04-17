import { LightningElement, api } from 'lwc';

export default class Paginator extends LightningElement {
    @api numberOfPages;
    @api currentPage;

    get isFirstPage() {
        return this.currentPage === 1;
    }

    get isLastPage() {
        return this.currentPage >= this.numberOfPages;
    }

    handlePrevious() {
        const previousEvent = new CustomEvent('previous');
        this.dispatchEvent(previousEvent);
    }

    handleNext() {
        const nextEvent = new CustomEvent('next');
        this.dispatchEvent(nextEvent);
    }
}