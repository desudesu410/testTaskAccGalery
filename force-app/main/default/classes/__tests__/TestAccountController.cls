@isTest
public class TestAccountController {
	@testSetup
    public static void setup() {
        List<Account> Accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            Accounts.add(new Account(Name = 'Acc' + i,
                                     Type = 'Type'+ i,
                                     Budget__c = 1000));
        }
        insert accounts;
    }
    @isTest
    public static void TestGetAccount() {
        Account[] allAccounts = AccountController.getAccounts('allTypes');
        Account[] someAccounts = AccountController.getAccounts('Type23');
        system.assertEquals(allAccounts.size(), 200);
        system.assertEquals(someAccounts.size(), 1);
    }
    @isTest
    public static void TestSumBudgetAcoountsSoql() {
        Double sumBudgetAllAccountsSoql = AccountController.getsumBudgetAccountsSoql('allTypes');
        Double sumBudgetSomeAccountsSoql = AccountController.getsumBudgetAccountsSoql('Type20');
        system.assertEquals(sumBudgetAllAccountsSoql, 200000);
        system.assertEquals(sumBudgetSomeAccountsSoql, 1000);
    }
    @isTest
    public static void TestSumBudgetAcoountsApex() {
        Double sumBudgetAllAccountsApex = AccountController.getsumBudgetAccountsApex('allTypes');
        Double sumBudgetSomeAccountsApex = AccountController.getsumBudgetAccountsApex('Type111');
        system.assertEquals(sumBudgetAllAccountsApex, 200000);
        system.assertEquals(sumBudgetSomeAccountsApex, 1000);
    }
}