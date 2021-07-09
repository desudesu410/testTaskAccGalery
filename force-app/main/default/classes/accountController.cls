public with sharing class AccountController {
	@AuraEnabled(Cacheable = true)
	public static Account[] getAccounts(String accountType) {
		if (accountType == 'allTypes') {
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

	@AuraEnabled
	public static Double getsumBudgetAccountsSoql(String accountType) {
		List<AggregateResult> sumBudget = new List<AggregateResult>();
		if (accountType == 'allTypes') {
			sumBudget = [
				SELECT 
					SUM(Budget__c) Sum
				FROM Account
			];
		} else {
		  sumBudget = [
				SELECT 
					SUM(Budget__c) Sum
				FROM Account	
				WHERE Type = :accountType
			];
		}
		Double result = (Double) sumBudget[0].get('Sum');
		return result;
	}

	@AuraEnabled
	public static Double getsumBudgetAccountsApex(String accountType) {
		Double sumBudget = 0;
		List<Account> listAccount = getAccounts(accountType);
		for(Account acct : listAccount) {
			if (acct.Budget__c != NULL) {
				sumBudget += acct.Budget__c;
			}
		}
		return sumBudget;
	}
}