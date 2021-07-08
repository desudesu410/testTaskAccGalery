public with sharing class AccountController {
	@AuraEnabled(Cacheable = true)
	public static Account[] getAllAccounts() {
		return [
			SELECT
				Id, 
				Name, 
				Owner.Name,
				Budget__c,
				Number_of_Employees__c, 
				Picture_Url__c,
				Type,
				Industry,
				Description
			FROM Account
			ORDER BY Name
		];
	}

	@AuraEnabled(Cacheable = true)
	public static Account[] getAccounts(String accountType) {
		if (accountType == 'allTypes') {
			return getAllAccounts();
		}
		return [
			SELECT
				Id, 
				Name, 
				Owner.Name,
				Budget__c,
				Number_of_Employees__c, 
				Picture_Url__c,
				Type,
				Industry,
				Description
			FROM Account
			WHERE Type = :accountType
			ORDER BY Name
		];
	}
}
