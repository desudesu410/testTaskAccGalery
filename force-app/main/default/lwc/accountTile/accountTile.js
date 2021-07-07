import { LightningElement, api } from 'lwc';
import accountGalleryResources from '@salesforce/resourceUrl/account_gallery';

export default class AccountTile extends LightningElement {
  @api account;
  noPicture = `${accountGalleryResources}/img/no-photo.png`

}