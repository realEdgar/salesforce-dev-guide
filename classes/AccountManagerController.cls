public with sharing class AccountManagerController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountsByType(String accountType){
        String query = 'SELECT Id, Name, Phone, Rating, Industry, AnnualRevenue, CustomerPriority__c, Type, AccountNumber FROM Account ';
        if(!String.isBlank(accountType) && accountType != 'all') {
            query += 'WHERE Type = \'' + accountType + '\'';
        }
        
        return (List<Account>) Database.query(query);
    }
}