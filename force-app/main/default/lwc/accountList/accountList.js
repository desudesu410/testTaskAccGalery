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
  picklistValueSelected = 'allTypes';
  accounts;
  errorAccounts;
  sumBudgetAccountsJs;
  sumBudgetAccountsSoql;
  errorSumBudgetAccountsSoql;
  sumBudgetAccountsApex;
  errorSumBudgetAccountsApex;
  selectedTile;

  get picklistOptions() {
    const allTypesValue = {value: 'allTypes', label: 'All Types'};
    const options = JSON.stringify(this.accountTypesPicklistValues.data?.values);
    if (options) {
      return [allTypesValue, ...JSON.parse(options)];
    }
  }

  connectedCallback() {
    this.getAccountsData();
  }

  getAccountsData() {
    getAccounts({accountType: this.picklistValueSelected})
      .then(result => {
        this.accounts = result;
        this.errorAccounts = undefined;
        this.sumBudgetAccountsJs = this.sumBudgetAccounts(this.accounts);
      })
      .catch(error => {
        this.errorAccounts = error;
        this.accounts = undefined;
      });

    getsumBudgetAccountsSoql({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsSoql = result;
        this.errorSumBudgetAccountsSoql = undefined;
      })
      .catch(error => {
        this.errorSumBudgetAccountsSoql = error;
        this.sumBudgetAccountsSoql = undefined;
      });

    getsumBudgetAccountsApex({accountType: this.picklistValueSelected})
      .then(result => {
        this.sumBudgetAccountsApex = result;
        this.errorSumBudgetAccountsSoql = undefined;
      })
      .catch(error => {
        this.errorSumBudgetAccountsApex = error;
        this.sumBudgetAccountsApex = undefined;
      });
  }
  
  handleChangeAccountTypes(event) {
    this.picklistValueSelected = event.detail.value;
    this.getAccountsData();
  }

  handleAccountDetails(event) {
    const clickedTile = event.detail.clickedAccountTile;
    if(this.selectedTile) {
      this.selectedTile.classList.remove('selected');
    }
    clickedTile.classList.add('selected');
    this.selectedTile = clickedTile;
    const message = {
      account: event.detail.account,
    };
    publish(this.messageContext, ACCOUNT_DETAILS_UPDATED_CHANNEL, message);
  }

  sumBudgetAccounts(accounts) {
    return accounts.reduce((sum, currAccount) => {
      return sum + (currAccount.Budget__c || 0);
    }, 0);
  }
}