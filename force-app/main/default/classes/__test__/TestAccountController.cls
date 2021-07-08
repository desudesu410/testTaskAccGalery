@isTest
public class TestAccountController {
	@testSetup
    public static void setup() {
        List<Account> Accounts = new List<Account>();
        for (Integer i = 0; i < 200; i++) {
            Accounts.add(new Account(Name = 'Acc' + i));
        }
        insert accounts;
    }
    @isTest
    public static void Test() {
        Account[] allAccounts = AccountController.getAccounts('allTypes');
        Account[] someAccounts = AccountController.getAccounts('test');
        system.assertEquals(allAccounts.size(), 200);
        system.assertEquals(someAccounts.size(), 0);
    }
}