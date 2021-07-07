public with sharing class accountController {
	@AuraEnabled(Cacheable=true)
	public static Account[] getAccounts() {
		return [
			SELECT
				Id, 
				Name, 
				Owner.Name,
				Budget__c,
				Number_of_Employees__c, 
				Picture_Url__c,
				Type 
			FROM Account
		];
	}
}
