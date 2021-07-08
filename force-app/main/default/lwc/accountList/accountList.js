import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import TYPE_FIELD from '@salesforce/schema/Account.Type';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';

export default class AccountList extends LightningElement {
  @wire(MessageContext) messageContext;
  @wire(getPicklistValues, { 
    recordTypeId: '012000000000000AAA', 
    fieldApiName: TYPE_FIELD
  }) accountTypesPicklistValues;
  accounts;
  error;
  picklistValueSelected = 'allTypes';

  get picklistOptions() {
    const allTypesValue = {value: 'allTypes', label: 'All Types'};
    const options = JSON.stringify(this.accountTypesPicklistValues?.data?.values);
    return options 
      ? [allTypesValue, ...JSON.parse(options)]
      : [allTypesValue];
  }

  accountsRender() {
    getAccounts({accountType: this.picklistValueSelected})
      .then(result => {
        this.accounts = result;
        this.error = undefined;
      })
      .catch(error => {
        this.error = error;
        this.accounts = undefined;
      });
  }

  connectedCallback() {
    this.accountsRender();
  }
  
  handleAccountTypesChange(event) {
    this.picklistValueSelected = event.detail.value;
    this.accountsRender();
  }

  handleAccountDetails(event) {
    const message = {
      account: event.detail
    };
    publish(this.messageContext, ACCOUNT_DETAILS_UPDATED_CHANNEL, message);
  }
}