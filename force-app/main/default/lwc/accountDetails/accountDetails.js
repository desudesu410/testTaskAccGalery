import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';
import { NavigationMixin } from 'lightning/navigation';

export default class AccountDetails extends NavigationMixin(LightningElement) {
  subscription = null;
  account;
  @wire(MessageContext) messageContext;

  connectedCallback() {
    console.log(this.account)
    this.subscription = subscribe(
      this.messageContext,
      ACCOUNT_DETAILS_UPDATED_CHANNEL,
      (message) => this.handleMessage(message)
    );
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
    this.subscription = null;
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