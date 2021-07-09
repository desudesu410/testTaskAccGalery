import { LightningElement, wire } from 'lwc';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getsumBudgetAccountsSoql from '@salesforce/apex/AccountController.getsumBudgetAccountsSoql';
import getsumBudgetAccountsApex from '@salesforce/apex/AccountController.getsumBudgetAccountsApex';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

export default class AccountList extends LightningElement {
  @wire(MessageContext) messageContext;
  @wire(getObjectInfo, { 
    objectApiName: ACCOUNT_OBJECT 
  }) objectInfo;
  @wire(getPicklistValues, { 
    recordTypeId: '$objectInfo.data.defaultRecordTypeId', 
    fieldApiName: TYPE_FIELD
  }) accountTypesPicklistValues;
  accounts;
  accountsError;
  sumBudgetAccountsSoql;
  sumBudgetAccountsSoqlError;
  sumBudgetAccountsApex;
  sumBudgetAccountsApexError;
  picklistValueSelected = 'allTypes';

  get picklistOptions() {
    const allTypesValue = {value: 'allTypes', label: 'All Types'};
    const options = JSON.stringify(this.accountTypesPicklistValues?.data?.values);
    return options 
      ? [allTypesValue, ...JSON.parse(options)]
      : [allTypesValue];
  }

  get sumBudgetAccounts() {
    return this.accounts?.reduce((sum, currAccount) => {
      return sum + (currAccount.Budget__c || 0);
    }, 0);
  }

  connectedCallback() {
    this.getAccountsData();
  }

  getAccountsData() {
    getAccounts({accountType: this.picklistValueSelected})
      .then(result => {
        this.accounts = result;
        this.accountsError = undefined;
      })
      .catch(error => {
        this.accountsError = error;
        this.accounts = undefined;
      });

    getsumBudgetAccountsSoql({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsSoql = result;
        this.sumBudgetAccountsSoqlError = undefined;
      })
      .catch(error => {
        this.sumBudgetAccountsSoqlError = error;
        this.sumBudgetAccountsSoql = undefined;
      });

    getsumBudgetAccountsApex({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsApex = result;
        this.sumBudgetAccountsApexError = undefined;
      })
      .catch(error => {
        this.sumBudgetAccountsApexError = error;
        this.sumBudgetAccountsApex = undefined;
      });
  }
  
  handleAccountTypesChange(event) {
    this.picklistValueSelected = event.detail.value;
    this.getAccountsData();
  }

  handleAccountDetails(event) {
    const message = {
      account: event.detail,
    };
    publish(this.messageContext, ACCOUNT_DETAILS_UPDATED_CHANNEL, message);
  }

}