@isTest
public with sharing class ContactSearchControllerTest {
    @TestSetup
    static void dataMaker(){
        List<Contact> contacts = new List<Contact>();
        for(Integer i = 0; i < 20; i++) {
            Contact ctc = new Contact();
            ctc.FirstName = 'Test';
            ctc.LastName = 'Test ' + i;
            ctc.Phone = '1112223336';
            ctc.Email = 'test@test.com';
            
            contacts.add(ctc);
        }

        Database.insert(contacts);
    }

    @isTest
    static void searchContacts() {
        List<Contact> contacts = ContactSearchController.searchContacts('Test');
        List<Contact> contactsNotFound = ContactSearchController.searchContacts('Other');
        List<Contact> contactsNotFoundEmpty = ContactSearchController.searchContacts('');

        Assert.isNotNull(contacts);
        Assert.areEqual(20, contacts.size());
        Assert.areEqual(0, contactsNotFound.size());
        Assert.areEqual(0, contactsNotFoundEmpty.size());
    }
}