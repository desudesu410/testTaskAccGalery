@isTest
public class TestAccountController {
	@testSetup
    public static void setup() {
        List<Account> Accounts = new List<Account>();
        for (Integer i = 0; i < 100; i++) {
            Accounts.add(new Account(Name = 'Acc' + i,
                                     Type = 'Type'+ i,
                                     Budget__c = 1000));
        }
        for (Integer i = 100; i < 200; i++) {
            Accounts.add(new Account(Name = 'Acc' + i,
                                     Type = 'Prospect',
                                     Budget__c = 1000));
        }
        
        insert accounts;
    }
    @isTest
    public static void TestGetAccount() {
        Account[] allAccounts = AccountController.getAccounts('allTypes');
        Account[] oneAccount = AccountController.getAccounts('Type1');
        Account[] prospectAccounts = AccountController.getAccounts('Prospect');
        system.assertEquals(allAccounts.size(), 200);
        system.assertEquals(oneAccount.size(), 1);
        system.assertEquals(prospectAccounts.size(), 100);
    }
    @isTest
    public static void TestSumBudgetAccountsSoql() {
        Double sumBudgetAllAccountsSoql = AccountController.getsumBudgetAccountsSoql('allTypes');
        Double sumBudgetOneAccountsSoql = AccountController.getsumBudgetAccountsSoql('Type2');
        Double sumBudgetPropectAccountsSoql = AccountController.getsumBudgetAccountsSoql('Prospect');
        system.assertEquals(sumBudgetAllAccountsSoql, 200000);
        system.assertEquals(sumBudgetOneAccountsSoql, 1000);
        system.assertEquals(sumBudgetPropectAccountsSoql, 100000);
    }
    @isTest
    public static void TestSumBudgetAccountsApex() {
        Double sumBudgetAllAccountsApex = AccountController.getsumBudgetAccountsApex('allTypes');
        Double sumBudgetOneAccountsApex = AccountController.getsumBudgetAccountsApex('Type3');
        Double sumBudgetPropectAccountsApex = AccountController.getsumBudgetAccountsApex('Prospect');
        system.assertEquals(sumBudgetAllAccountsApex, 200000);
        system.assertEquals(sumBudgetOneAccountsApex, 1000);
        system.assertEquals(sumBudgetPropectAccountsApex, 100000);
    }
}