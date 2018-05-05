import { Component } from '@angular/core';

import { LoadingController, ViewController, NavParams } from 'ionic-angular';

import { StepsSystem, StepsProvider } from '../../providers/steps';
import { ConfigsProvider } from '../../providers/configs';

@Component({
    selector: 'new-system-modal',
    templateUrl: 'new-system.html'
})

export class NewSystemModal {

    private loading:any;

    private systems:StepsSystem[] = [];

    private currentStep:number = 1;
    private currentSystem:StepsSystem;

    private errorMessage:string = "";

    constructor(private loadingCtrl:LoadingController, private stepsProvider:StepsProvider, private configsProvider:ConfigsProvider, private viewCtrl:ViewController) {
        this.systems = this.stepsProvider.getSystems();
    }

    selectSystem(system:StepsSystem) {
        if (this.isSystemAvailable(system.id)) {
            this.currentSystem = system;
            this.currentStep = 2;

            this.askPermissions();
        }
    } 

    close() {
        this.viewCtrl.dismiss();
    }

    private isSystemAvailable(systemID) {
        let available:boolean = true;
        this.configsProvider.getSystems().filter(single_systemID => {
            if (single_systemID == systemID) {
                available = false;
            }
        });
        return available;
    } 

    private askPermissions() {
          this.loading = this.loadingCtrl.create({
            spinner: 'hide',
            content: 'Waiting for the permissions...'
          });

          this.loading.present();

        this.stepsProvider.askPermissions(this.currentSystem.id).then(
            (val) => this.addSystem(val),  
            (err) => this.retrySystem(err)
        );
    }

    private addSystem(json) {
        this.loading.dismiss();

        this.configsProvider.addSystem(this.currentSystem);

        this.currentStep = 3;
    }

    private retrySystem(json) {
        this.loading.dismiss();
        this.errorMessage = json['message'];
    }
}