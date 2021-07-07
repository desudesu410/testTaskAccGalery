import { LightningElement, wire } from 'lwc';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

export default class AccountList extends LightningElement {
  @wire(getPicklistValues, { 
    recordTypeId: '012000000000000AAA', 
    fieldApiName: TYPE_FIELD
  }) accountTypesPicklistValues;
  accounts;
  error;
  picklistValue  = 'allTypes';

  connectedCallback() {
    getAccounts()
      .then(result => {
        this.accounts = result;
      })
      .catch(error => {
        this.error = error;
      });
  }
  
  get picklistOptions() {
    const allTypes = {value: 'allTypes', label: 'All Types'};
    const options = JSON.stringify(this.accountTypesPicklistValues?.data?.values);
    return options 
      ? [allTypes, ...JSON.parse(options)]
      : [allTypes];
  }

  handleAccountTypesChange(event) {
    this.picklistValue = event.detail.value;
  }
}