public with sharing class AccountDetailsController {
  @AuraEnabled(Cacheable = true)
  public static Account getAccountDetails(Id accountId) {
    return [
      SELECT
        Name,
        Type,
        Industry,
        Budget__c,
        Description
      FROM Account
      WHERE Id = :accountId
    ];
  }
}
