import { LightningElement, wire } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { NavigationMixin } from 'lightning/navigation';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';


export default class AccountDetails extends NavigationMixin(LightningElement) {
  subscriptionToDetails = null;
  account;
  @wire(MessageContext) messageContext;

  connectedCallback() {
    this.subscriptionToDetails = subscribe(
      this.messageContext,
      ACCOUNT_DETAILS_UPDATED_CHANNEL,
      (message) => this.handleMessage(message)
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscriptionToDetails);
    this.subscriptionToDetails = null;
  }

  handleMessage(message) {
    this.account = message.account;
  }

  handleOpenFullAccountDetails() {
    const accountId = this.account.Id;
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: accountId,
        objectApiName: 'Account',
        actionName: 'view',
      },
    });
  }
}