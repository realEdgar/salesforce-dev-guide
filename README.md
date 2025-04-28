Challenge X:
Apex Trigger: Opportunity Line Item Revenue Roll-Up and Discount Logic

Overview
This Salesforce Apex solution implements a trigger on the OpportunityLineItem object to manage revenue roll-up calculations, enforce custom validation rules, and apply dynamic discounts based on business requirements. The solution is optimized for bulk operations, adheres to Salesforce governor limits, and includes comprehensive test coverage.

Features
Revenue Roll-Up: Calculates the total UnitPrice of all OpportunityLineItem records and updates the Total_Revenue__c field on the parent Opportunity.

Custom Validation: Prevents deletion of OpportunityLineItem records if the parent Opportunity is in the Closed Won stage.

Dynamic Discount: Applies a 10% discount to all OpportunityLineItem UnitPrice values if the Total_Revenue__c exceeds $50,000, logging the discount in the Discount_Log__c custom object.

Error Handling: Ensures robust error handling with transaction rollback and user-friendly error messages.

Bulkification: Optimized to handle 200+ records efficiently without hitting governor limits.

├── force-app/main/default/
│   ├── classes/
│   │   ├── OpportunityLineItemTriggerHandler.cls
│   │   ├── OpportunityLineItemTriggerHandlerTest.cls
│   ├── triggers/
│   │   ├── OpportunityLineItemTrigger.trigger
│   ├── objects/
│   │   ├── Opportunity/
│   │   │   ├── fields/
│   │   │   │   ├── Total_Revenue__c.field-meta.xml
│   │   ├── Discount_Log__c/
│   │   │   ├── fields/
│   │   │   │   ├── Opportunity__c.field-meta.xml
│   │   │   │   ├── Applied_Date__c.field-meta.xml
│   │   │   │   ├── Total_Discount_Amount__c.field-meta.xml
├── README.md
