import { Component } from '@angular/core';

import { LoadingController, ViewController, NavParams } from 'ionic-angular';

import { StepsDevice, StepsProvider } from '../../providers/steps';

@Component({
    selector: 'new-device-modal',
    templateUrl: 'new-device.html'
})

export class NewDeviceModal {

    private loading:any;

    private devices:StepsDevice[] = [];

    private currentStep:number = 1;
    private currentDevice:StepsDevice;

    private errorMessage:string = "";

    constructor(private loadingCtrl:LoadingController, private stepsProvider:StepsProvider, public viewCtrl:ViewController) {
        this.devices = this.stepsProvider.getDevices();
    }

    selectDevice(device:StepsDevice) {
        if (this.isDeviceAvailable(device.id)) {
            this.currentDevice = device;
            this.currentStep = 2;

            this.askPermissions();
        }
    } 

    close() {
        this.viewCtrl.dismiss();
    }

    private isDeviceAvailable(device_id) {
        let available:boolean = true;
        this.stepsProvider.getConfigDevices().filter(single_device_id => {
            if (single_device_id == device_id) {
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

        this.stepsProvider.askPermissions(this.currentDevice.id).then(
            (val) => this.addDevice(val),  
            (err) => this.retryDevice(err)
        );
    }

    private addDevice(json) {
        this.loading.dismiss();

        this.stepsProvider.addDevice(this.currentDevice);

        this.currentStep = 3;
    }

    private retryDevice(json) {
        this.loading.dismiss();
        this.errorMessage = json['message'];
    }
}