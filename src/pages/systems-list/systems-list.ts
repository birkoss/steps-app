import { Component } from '@angular/core';
import { LoadingController, AlertController, ModalController, NavController, ToastController } from 'ionic-angular';

import { NewSystemModal } from '../../modals/new-system/new-system';
import { MainTabs } from '../tabs/tabs';

import { StepsSystem, StepsProvider } from '../../providers/steps';
import { ConfigsSystem, ConfigsProvider } from '../../providers/configs';


@Component({
	selector: 'page-systems-list',
	templateUrl: 'systems-list.html'
})
export class SystemsListPage {

	private loading:any;
	
	constructor(private navCtrl:NavController, private toastCtrl:ToastController, private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, private stepsProvider:StepsProvider, private alertCtrl:AlertController, private modalCtrl:ModalController) { }

	private refreshSystems(event) {
		this.configsProvider.getSystems().forEach(single_system => {
			this.refreshSteps(single_system.id);
		}, this);
	}

	private isAvailable(systemID:string) {
		return this.configsProvider.getSystems().filter(single_system => {
			return (single_system.id == systemID);
		}, this).length != 1;
	}

	private getLabel(systemID:string) {
		let label = "No stats available";

		this.configsProvider.getSystems().filter(single_system => {
			if (single_system.id == systemID) {
				label = "Updated: " + single_system.lastUpdate;
			}
		}, this);

		return label;
	}

	private addSystem(systemID:string) {
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Waiting for the permissions...'
		});

		this.loading.present();

		this.stepsProvider.askPermissions(systemID).then(
			(val) => {
				this.loading.dismiss();
        		this.configsProvider.addSystem(systemID);

				this.loading = this.loadingCtrl.create({
					spinner: 'hide',
					content: 'Refreshing steps...'
				});
				this.loading.present();

        		this.refreshSteps(systemID)
        		.then((data) => {
					this.loading.dismiss();
					this.navCtrl.setRoot(MainTabs);
        		})
        		.catch((err) => {
					this.loading.dismiss();

					this.showErrorMessage(err['message']);
        		});
			},  
			(err) => {
				this.loading.dismiss();

				this.showErrorMessage(err['message']);
			}
		);
	}

	private refreshSteps(systemID) {
		return new Promise((resolve, reject) => {
			this.stepsProvider.refreshSteps(systemID).then(
	            (data) => {
	            	this.configsProvider.updateSteps(data['data'])
					.then((data) => resolve(data))
					.catch((err) => reject(err));
	            },  
	            (err) => reject(err)
	        );
		});
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

	private showErrorMessage(message:string) {
		let toast = this.toastCtrl.create({
			message: message,
			showCloseButton: true
		});
		toast.present();
	}
}
