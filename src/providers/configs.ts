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
        this.configs['systems']	= [];
    }

    public load() {
        return new Promise((resolve, reject) => {
            this.storage.get('configs').then(data => {
                if (data != null) {
                    this.configs = JSON.parse(data);
                    console.log("loading: ", data, this.configs);
                }
                resolve("ok");
            });
        });
    }

    public save() {
        this.storage.set('configs', JSON.stringify(this.configs));
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
    public addSystem(system:any) {
        this.configs['systems'].push(system.id);
        this.save();
    }



    public deleteSystem(systemID:string) {
        let index = this.configs['systems'].indexOf(systemID);
        if (index > -1) {
            this.configs['systems'].splice(index, 1);
            this.save();
            return true;
        }

        return false;
    }

    public getSystems():any[] {
        return this.configs['systems'];
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
