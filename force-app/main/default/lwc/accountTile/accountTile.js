import { LightningElement, api } from 'lwc';
import accountGalleryResources from '@salesforce/resourceUrl/account_gallery';

export default class AccountTile extends LightningElement {
  @api account;
  noPictureImage = `${accountGalleryResources}/img/no-photo.png`;

  handleAccountDetail() {
    const selectEvent = new CustomEvent('accountclick', {
      detail: this.account
    });
    this.dispatchEvent(selectEvent);
  }
}