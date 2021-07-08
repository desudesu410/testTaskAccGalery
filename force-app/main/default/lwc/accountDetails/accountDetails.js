import { LightningElement, wire, api } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_DETAILS_UPDATED_CHANNEL from '@salesforce/messageChannel/Account_Details_Updated__c';
import getAccountDetails from '@salesforce/apex/AccountDetailsController.getAccountDetails'
import { NavigationMixin } from 'lightning/navigation';

export default class AccountDetails extends NavigationMixin(LightningElement) {
  subscription = null;
  @api account = null;
  @wire(MessageContext) messageContext;

  connectedCallback() {
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
    getAccountDetails({accountId: message.account})
      .then(result => {
        this.account = result;
        this.error = undefined;
      })
      .catch(error => {
        this.error = error;
        this.account = undefined;
      });
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