import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfigsProvider } from '../../providers/configs';


import { DevicesListPage } from '../devices-list/devices-list';

@Component({
	selector: 'page-loading',
	templateUrl: 'loading.html'
})
export class LoadingPage {
	private loading:any;

	constructor(private configsProvider:ConfigsProvider, private navCtrl:NavController, private loadingCtrl:LoadingController) { }

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
			me.navCtrl.setRoot(DevicesListPage);
		})
		.catch((err) => { alert("NOP: " + err)});
	}
}