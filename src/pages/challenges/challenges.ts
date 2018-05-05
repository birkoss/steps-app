import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';

import { Http } from '@angular/http';

import { ConfigsProvider } from '../../providers/configs';

@Component({
  selector: 'page-challenges',
  templateUrl: 'challenges.html'
})
export class ChallengesPage {

	loading:any;

	constructor(private loadingCtrl:LoadingController, private configsProvider:ConfigsProvider, public navCtrl:NavController) { }

	ionViewDidEnter() {
		
	}
}