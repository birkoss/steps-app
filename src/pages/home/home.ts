import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AndroidPermissions } from '@ionic-native/android-permissions';

 import { NgZone } from '@angular/core';

import { Http } from '@angular/http';

import { SocialSharing } from '@ionic-native/social-sharing';

import { StepsProvider } from '../../providers/steps';

declare var SamsungHealth:any;


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	logz:any = "";
	shealth:any;
	jsonContent:any = "TEST";

  constructor(private stepsProvider:StepsProvider, private socialSharing: SocialSharing, public http:Http, private zone:NgZone, public navCtrl:NavController, private androidPermissions:AndroidPermissions) {
  	console.log(Window);

  	console.log(stepsProvider.getDevices());
  }

	___ionViewDidEnter() {
		this.androidPermissions.requestPermissions(['com.samsung.android.health.permission.read']);
		this.androidPermissions.requestPermissions(['android.permission.INTERNET']);
		this.addLogz("before");


		this.addLogz("after echo2...");
		this.addLogz("before greet...");

		this.shealth = new SamsungHealth();

		this.refresh();


        

		// cordova.plugins.SamsungHealth.greet("abc", this.ok2, this.notOk);
		//(<any>window).plugin.SamsungHealth.greet("abc", this.ok, this.notOk);
		//cordova.plugins.Shealth.greet("abc");
				this.addLogz("after");

		/*
	  this.health.isAvailable()
		.then((available:boolean) => {
		  this.addLogz(available);
		  this.health.requestAuthorization([
		    'distance', 'nutrition',  //read and write permissions
		    {
		      read: ['steps'],       //read only permission
		      write: ['height', 'weight']  //write only permission
		    }
		  ])
		  .then(res => this.addLogz(res))
		  .catch(e => this.addLogz(e));
		})
		.catch(e => this.addLogz(e));
		*/
	}

	showDebug() {
        this.shealth.debug('birkoss', function(msg) {
        	alert("greet: " + msg);
        }, function(err) {
        	alert("Greet: " + err);
        });
	}

	refresh() {
		var me = this;
	
		this.jsonContent = "SWAY";
        this.shealth.getData('birkoss', function(str) {
        	alert(str);

			me.socialSharing.share(str);

        	alert(str);
        	alert(me);
        	me.zone.run(() => {
				me.jsonContent = str;
			});
        }, function(err) {
        	alert(err);
        });


	}

	refreshedData(str) {
      	alert(str);
        	alert(this.jsonContent);
			this.jsonContent = "okkkkkkk";
			alert(this.jsonContent);

	}

	ok(str) {
		alert("OK: " + str);
		this.addLogz("OK");
		this.addLogz(str);
	}


	ok2(str) {
		alert("OK2: " + str);
		this.addLogz("OK2");
		this.addLogz(str);
	}

	notOk(str) {
		this.addLogz("NOT OK");
		this.addLogz(str);
	}

	addLogz(str) {
		this.logz += str + "<br>";
	}

}
