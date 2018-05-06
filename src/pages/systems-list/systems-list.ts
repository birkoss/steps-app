import { Component } from '@angular/core';
import { LoadingController, AlertController, ModalController } from 'ionic-angular';

import { NewSystemModal } from '../../modals/new-system/new-system';

import { StepsSystem, StepsProvider } from '../../providers/steps';
import { ConfigsSystem, ConfigsProvider } from '../../providers/configs';


@Component({
	selector: 'page-systems-list',
	templateUrl: 'systems-list.html'
})
export class SystemsListPage {

	private loading:any;
	
	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, private stepsProvider:StepsProvider, private alertCtrl:AlertController, private modalCtrl:ModalController) {
		console.log("constructor");
	}

	private newSystem(event) {
		let modal = this.modalCtrl.create(NewSystemModal);
        modal.present();
	}

	private refreshSteps(systemID) {
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Updating steps...'
		});
		this.loading.present();

		let me = this;
		this.stepsProvider.refreshSteps(systemID).then(
            (data) => {
     
            	this.configsProvider.updateSteps(data['data'])
				.then(function (data) {
					me.loading.dismiss();
					// @TODO Do something to show it worked
					//alert("YEP" + data);
				})
				.catch((err) => { 
					me.loading.dismiss();
					alert("NOP: " + err)
				});
            },  
            (err) => {
            	me.loading.dismiss();
            	alert("ERROR: " + err['message']);
            }
        );
	}

	private deleteSystem(systemID) {
		let alert = this.alertCtrl.create({
			title: 'Confirmation',
			message: 'Please confirm you want to do this?',
			buttons: [{
				text: 'Cancel',
				role: 'cancel',
				handler: () => {
					console.log('Cancel clicked');
				}
			},{
				text: 'Delete',
				handler: () => {
					this.configsProvider.deleteSystem(systemID);
				}
			}
			]
		});
		alert.present();
	}
}
