import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getsumBudgetAccountsSoql from '@salesforce/apex/AccountController.getsumBudgetAccountsSoql';
import getsumBudgetAccountsApex from '@salesforce/apex/AccountController.getsumBudgetAccountsApex';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

export default class AccountList extends LightningElement {
  @wire(MessageContext) messageContext;
  @wire(getPicklistValues, { 
    recordTypeId: '012000000000000AAA', 
    fieldApiName: TYPE_FIELD
  }) accountTypesPicklistValues;
  accounts;
  error;
  sumBudgetAccountsSoql;
  sumBudgetAccountsApex;
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
      return sum + currAccount.Budget__c;
    }, 0);
  }

  connectedCallback() {
    this.getAccountsData();
  }

  getAccountsData() {
    getAccounts({accountType: this.picklistValueSelected})
      .then(result => {
        this.accounts = result;
        this.error = undefined;
      })
      .catch(error => {
        this.error = error;
        this.accounts = undefined;
      });

    getsumBudgetAccountsSoql({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsSoql = result;
      })
      .catch(error => {
        this.error = error;
      });

    getsumBudgetAccountsApex({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsApex = result;
      })
      .catch(error => {
        this.error = error;
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