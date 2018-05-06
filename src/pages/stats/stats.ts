import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { ConfigsProvider } from '../../providers/configs';

@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {

	loading:any;
  currentDeviceID:string;

	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, public navCtrl:NavController) { }

	ionViewDidEnter() {
        this.currentDeviceID = this.configsProvider.getDevices()[0]['id'];
		this.refreshSteps();
	}

  segmentChanged(event) {
    this.currentDeviceID = event.value;
    this.refreshSteps();
  }

	private refreshSteps() {
		this.loading = this.loadingCtrl.create({
			spinner: 'hide',
			content: 'Refreshing steps...'
		});
		this.loading.present();

this.barChartLabels = [];

		let me = this;
		this.configsProvider.getSteps(this.currentDeviceID).then(
            (data) => {
            	this.loading.dismiss();
            	console.log(JSON.stringify(this.barChartData));
            	let userData = [];
            	let worldData = [];
            	data['data']['steps'].reverse().forEach(single_step => {

            		this.barChartLabels.push(single_step['date'].substr(5, 10));

            		userData.push(parseInt(single_step.steps));
            	});

              data['data']['stats'].reverse().forEach(single_stat => {
                worldData.push(parseInt(single_stat.average));
              });

      			let clone = JSON.parse(JSON.stringify(this.barChartData));
      			clone[0] = {data:userData, label:"You"};
      			clone[1] = {data:worldData, label:"Average"};

            	this.barChartData = clone;
				console.log(JSON.stringify(this.barChartData));
            },  
            (err) => {
            	this.loading.dismiss();
            	alert(err['message']);
            }
        );
	}

	private barChartOptions:any = {
		scaleShowVerticalLines: false,
		responsive: true,
		maintainAspectRatio: false
	};

	private barChartLabels:string[] = [];
	private barChartType:string = 'bar';
	private barChartLegend:boolean = true;

public barChartData:any[] = [
  {data: [65, 59, 80, 81, 56, 55, 40], label: 'You'},
  {data: [28, 48, 40, 19, 86, 27, 10000], label: 'World'}
];

// events
private chartClicked(e:any):void {
  console.log(e);
}

private chartHovered(e:any):void {
  console.log(e);
}



}