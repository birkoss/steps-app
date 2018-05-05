import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfigsProvider } from '../../providers/configs';
import { StepsProvider } from '../../providers/steps';


import { DevicesListPage } from '../devices-list/devices-list';
import { MainTabs } from '../tabs/tabs';

@Component({
	selector: 'page-loading',
	templateUrl: 'loading.html'
})
export class LoadingPage {
	private loading:any;

	constructor(private stepsProvider:StepsProvider, private configsProvider:ConfigsProvider, private navCtrl:NavController, private loadingCtrl:LoadingController) { }

	ionViewDidEnter() {
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Loading...'
		});
		this.loading.present();

		let me = this;

		this.configsProvider.getUserUid()
		.then(function (uuid) {
			me.loading.dismiss();
			// @TODO: If at least ONE device, go to Dashboard instead
			me.navCtrl.setRoot(me.stepsProvider.getConfigDevices().length == 0 ? DevicesListPage : MainTabs);
		})
		.catch((err) => { alert("NOP: " + err)});
	}
}