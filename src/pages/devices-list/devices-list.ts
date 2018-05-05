import { Component } from '@angular/core';
import { LoadingController, AlertController, NavController, ModalController } from 'ionic-angular';

import { NewDeviceModal } from '../../modals/new-device/new-device';

import { StepsDevice, StepsProvider } from '../../providers/steps';
import { ConfigsProvider } from '../../providers/configs';


@Component({
	selector: 'page-devices-list',
	templateUrl: 'devices-list.html'
})
export class DevicesListPage {

	private loading:any;
	
	private devices:StepsDevice[] = [];

	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, private stepsProvider:StepsProvider, private alertCtrl:AlertController, private modalCtrl:ModalController) {
		console.log("constructor");
	}

	private ionViewDidEnter() {
		this.devices = this.stepsProvider.getConfigDevices();
	}

	private newDevice(event) {
		let modal = this.modalCtrl.create(NewDeviceModal);
        modal.present();
	}

	private refreshSteps(deviceID) {
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Updating steps...'
		});
		this.loading.present();

		let me = this;
		this.stepsProvider.refreshSteps(deviceID).then(
            (data) => {
     
            	this.configsProvider.updateSteps(data['data'])
				.then(function (data) {
					me.loading.dismiss();
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

	private deleteDevice(deviceID) {
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
					this.stepsProvider.deleteDevice(deviceID);
				}
			}
			]
		});
		alert.present();
	}
}
