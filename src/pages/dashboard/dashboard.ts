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

	currentDeviceID:string;
	loading:any;

	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, public http:Http, public navCtrl:NavController) { }

	ionViewDidEnter() {
    this.currentDeviceID = this.configsProvider.getDevices()[0]['id'];

    console.log(this.currentDeviceID);
		this.refreshSteps();
	}

  segmentChanged(event) {
    this.currentDeviceID = event.value;
    this.refreshSteps();
  }

	private refreshSteps() {
    console.log("refreshing: " + this.currentDeviceID);

		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Refreshing steps...'
		});
		this.loading.present();

		let me = this;
		this.configsProvider.getSteps(this.currentDeviceID).then(
            (data) => {
            	this.loading.dismiss();
            	me.doughnutChartData = [];
            	data['data']['steps'].reverse().forEach(single_step => {
                alert(single_step.steps);

                if (me.doughnutChartData.length == 0) {
                  me.doughnutChartData.push(single_step.steps);
                }
            	});

              me.doughnutChartData.push( Math.max(0, 6000 - me.doughnutChartData[0]));

              console.log(me.doughnutChartData);
            },  
            (err) => {
            	this.loading.dismiss();
            	alert(err['message']);
            }
        );
	}

  public doughnutChartLabels:string[] = ['Today', 'Goals'];
  public doughnutChartData:number[] = [350, (6000-350)];
  public doughnutChartType:string = 'doughnut';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }



}