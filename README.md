# Apex Trigger: Opportunity Line Item Revenue Roll-Up and Discount Logic
## Overview
This Salesforce Apex solution implements a **trigger** on the `OpportunityLineItem` object to manage *revenue roll-up calculations*, enforce custom validation rules, and apply dynamic discounts. The solution is **bulkified**, adheres to Salesforce governor limits, and includes comprehensive test coverage.

### Features
- **Revenue Roll-Up**: Updates `Total_Revenue__c` on the parent `Opportunity` based on `OpportunityLineItem` `UnitPrice`.
- **Custom Validation**: Prevents deletion of `OpportunityLineItem` records for `Closed Won` Opportunities.
- **Dynamic Discount**: Applies a *10% discount* to `UnitPrice` if `Total_Revenue__c` exceeds $50,000, logged in `Discount_Log__c`.
- **Error Handling**: Rolls back transactions on failure with user-friendly error messages.
- **Bulkification**: Handles *200+ records* efficiently.

---

## Repository Structure
```plaintext
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
