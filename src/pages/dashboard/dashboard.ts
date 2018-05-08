import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { Http } from '@angular/http';

import { ConfigsProvider } from '../../providers/configs';

declare var SamsungHealth:any;


@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html'
})
export class DashboardPage {

	currentFilter:string;
	loading:any;

  today:Object = {};

	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, public http:Http, public navCtrl:NavController) { }

	ionViewDidEnter() {
    this.currentFilter = "days";
    console.log(this.currentFilter);
		this.getData();
	}

  segmentChanged(event) {
    this.currentFilter = event.value;
    this.getData();
  }

	private getData() {
    console.log("refreshing: " + this.currentFilter);

		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Refreshing steps...'
		});
		this.loading.present();

		let me = this;
		this.configsProvider.getMe(this.configsProvider.getDevices()[0]['id']).then(
            (data) => {
            	this.loading.dismiss();

            	me.today = data['data']['today'];
              me.today['dayOfWeek'] = new Date(me.today['date']).getDay();


              console.log(me.today);
            },  
            (err) => {
            	this.loading.dismiss();
            	alert("ERROR: " + err['message']);
            }
        );
	}
}