import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import 'rxjs/add/operator/map';


@Injectable()
export class ConfigsProvider {

	private configs:Object = {};

    private userUid:number = 0;

    constructor(private http:Http, private uniqueDeviceID:UniqueDeviceID, private storage:Storage) {
    	
    }

    public load() {
        return this.storage.get('steps').then(data => {
            if (data != null) {
                this.configs = JSON.parse(data);
                console.log("Changing default language..." + this.configs['language']);
            }
        });
    }

    public getUserUid() {
        return new Promise((resolve, reject) => {
            this.getCordovaUniqueID().then(
                (uuid:string) => this.getApiUniqueID(uuid).then(
                    (uid:number) => { resolve(uid); }
                )
                .catch((error) => { reject(error); })
            )
            .catch((error) => { reject(error); });
        });
     }

     public isDebug():boolean {
         return (this.userUid == 1);
     }

     public updateSteps(devices:any) {
        return new Promise((resolve, reject) => {
           this.http.get("https://steps.birkoss.com/api/steps/update.php?user_uid=" + this.userUid + "&data=" + btoa(JSON.stringify(devices)))
            .map((res) => res.json()).subscribe(data => {
                if (data['status'] == "success") {
                    resolve(data);
                } else {
                    reject(data['message']);
                }
            });
        });
     }

     public getSteps(deviceID:any) {
        return new Promise((resolve, reject) => {
           this.http.get("https://steps.birkoss.com/api/steps/get.php?user_uid=" + this.userUid + "&device_id=" + encodeURI(deviceID))
            .map((res) => res.json()).subscribe(data => {
                if (data['status'] == "success") {
                    resolve(data);
                } else {
                    reject(data['message']);
                }
            });
        });
     }

     private getCordovaUniqueID() {
        return new Promise((resolve, reject) => {
            if (this.userUid > 0) {
                return resolve(this.userUid);
            } else {
                this.uniqueDeviceID.get()
                    .then((uuid: any) => resolve(uuid))
                    .catch((error: any) => {
                        switch (error) {
                            case "cordova_not_available":
                                resolve("debug_device");
                                break;
                            default:
                                reject(error);
                        }
                    });
            }
        });
     }

     private getApiUniqueID(uuid:string) {
        return new Promise((resolve, reject) => {
           this.http.get("https://steps.birkoss.com/api/user/get.php?device_id=" + uuid)
            .map((res) => res.json()).subscribe(data => {
                if (data['status'] == "success") {
                    this.userUid = data['data']['uid'];
                    resolve(this.userUid);
                } else {
                    reject(data['message']);
                }
            });
        });
     }
}
