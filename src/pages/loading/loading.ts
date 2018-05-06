import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfigsProvider } from '../../providers/configs';
import { StepsProvider } from '../../providers/steps';


import { SystemsListPage } from '../systems-list/systems-list';
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
		this.configsProvider.load()
		.then(function(str) {
			me.configsProvider.getUserUid()
			.then(function (uuid) {
				me.loading.dismiss();
				//me.navCtrl.setRoot(me.configsProvider.getSystems().length == 0 ? SystemsListPage : SystemsListPage);
				me.navCtrl.setRoot(me.configsProvider.getSystems().length == 0 ? SystemsListPage : MainTabs);
			})
			.catch((err) => { alert("NOP: " + err)});
		})
		.catch((err) => { alert("NOP: " + err)});
	}
}