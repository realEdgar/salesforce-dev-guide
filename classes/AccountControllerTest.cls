@isTest
public with sharing class AccountControllerTest {
    static void dataMaker(){
        List<Account> accounts = new List<Account>();
        for(Integer i = 0; i < 20; i++) {
            Account acc = new Account();
            acc.Name = 'Test Account ' + i + 1;
            acc.Industry = 'Energy';

            accounts.add(acc);
        }

        Database.insert(accounts);
    }
    @isTest
    static void getAccountsTestPositive() {
        dataMaker();
        List<Account> accounts = AccountController.getAccounts();

        Assert.isNotNull(accounts);
        Assert.areEqual(10, accounts.size());
    }
    @isTest
    static void getAccountsTestNegative() {
        AccountController.isTesting = true;
        try {
            List<Account> accounts = AccountController.getAccounts();
        } catch(Exception ex) {
            Assert.isNotNull(ex);
        }
    }
}