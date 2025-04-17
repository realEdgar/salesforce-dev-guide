public with sharing class ContactSearchController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String contactName){
        if(contactName == '') {
            return new List<Contact>();
        }

        String name = '%' + String.escapeSingleQuotes(contactName) + '%';

        return [
            SELECT Id, Name, Phone, Email
            FROM Contact
            WHERE Name LIKE :name
        ];
    }
}