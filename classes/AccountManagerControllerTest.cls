@isTest
public with sharing class AccountManagerControllerTest {
    @TestSetup
    static void dataMaker(){
        List<Account> accs = new List<Account>();
        for(Integer i = 0; i < 20; i++) {
            Account acc = new Account(
                Name = 'Test ' + i,
                Phone = '1234567890',
                Rating = 'Hot',
                Industry = 'Energy',
                AnnualRevenue = 500000,
                CustomerPriority__c = '',
                Type = i > 9 ? 'Prospect' : 'Customer - Direct', 
                AccountNumber = 'CC12345'
            );
            accs.add(acc);
        }

        insert accs;
    }
    @isTest
    static void getAccountsByTypeTest() {
        List<Account> allAccounts0 = AccountManagerController.getAccountsByType('');
        List<Account> allAccounts1 = AccountManagerController.getAccountsByType('all');
        List<Account> prospectAccounts = AccountManagerController.getAccountsByType('Prospect');
        List<Account> dirCustomerAccounts = AccountManagerController.getAccountsByType('Customer - Direct');

        Assert.isNotNull(allAccounts0);
        Assert.areEqual(20, allAccounts0.size());
        Assert.isNotNull(allAccounts1);
        Assert.areEqual(20, allAccounts1.size());
        Assert.isNotNull(prospectAccounts);
        Assert.areEqual(10, prospectAccounts.size());
        Assert.isNotNull(dirCustomerAccounts);
        Assert.areEqual(10, dirCustomerAccounts.size());
    }
}