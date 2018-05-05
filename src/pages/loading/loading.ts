import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConfigsProvider } from '../../providers/configs';


import { DevicesListPage } from '../devices-list/devices-list';

@Component({
	selector: 'page-loading',
	templateUrl: 'loading.html'
})
export class LoadingPage {
	private currentDeviceID:string = "";

	constructor(private configsProvider:ConfigsProvider, private navCtrl:NavController) { }

	ionViewDidEnter() {
		let me = this;

		this.configsProvider.getUserUid()
		.then(function (uuid) {
			me.navCtrl.setRoot(DevicesListPage);
		})
		.catch((err) => { alert("NOP: " + err)});
	}
}