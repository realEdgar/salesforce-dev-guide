public with sharing class AccountController {
    @TestVisible
    public static Boolean isTesting = false;
    
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(){
        List<Account> accounts = new List<Account>();
        try {
            if(!isTesting) {
                accounts = [SELECT Id, Name, Industry FROM Account LIMIT 10];
            } else if(isTesting) {
                throw new QueryException('Query Error');
            }

            return accounts;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}