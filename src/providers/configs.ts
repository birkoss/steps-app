import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Storage } from '@ionic/storage';

import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import 'rxjs/add/operator/map';

export interface ConfigsDevice {
    id:string;
    type:string;
}

export interface ConfigsSystem {
    id:string;
    devices:ConfigsDevice[];
    currentDeviceID:string;
    lastUpdate:string;
}

@Injectable()
export class ConfigsProvider {

    private systems:ConfigsSystem[];

    private userUid:number = 0;

    constructor(private http:Http, private uniqueDeviceID:UniqueDeviceID, private storage:Storage) {
        this.systems = [];
    }

    /* Save & Load */

    public load() {
        return new Promise((resolve, reject) => {
            this.storage.get('configs').then(data => {
                if (data != null) {
                    data = JSON.parse(data);
                    this.systems = data['systems'];

                    console.log("loading: ", data, this.systems);
                }
                resolve("ok");
            });
        });
    }

    public save() {
        let data = {
            systems: this.systems
        };
        this.storage.set('configs', JSON.stringify(data));
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
                    console.log(data);
                    /* Change the updated date */
                    this.getSystems().forEach(single_system => {
                        if (single_system.id == data['data']['systemID']) {
                            single_system.lastUpdate = data['data']['date_updated'];
                        }
                    }, this);
                    this.save();

                    /* Add new devices */
                    devices.forEach(single_device => {
                        this.addDevice(single_device.uuid, single_device.type, single_device.systemID);
                    }, this);

                    resolve(data);
                } else {
                    reject(data['message']);
                }
            });
        });
     }

     public getSteps(deviceID:any) {
        return new Promise((resolve, reject) => {
            //alert("https://steps.birkoss.com/api/steps/get.php?user_uid=" + this.userUid + "&device_id=" + btoa(deviceID));
           this.http.get("https://steps.birkoss.com/api/steps/get.php?user_uid=" + this.userUid + "&device_id=" + btoa(deviceID))
            .map((res) => res.json()).subscribe(data => {
                if (data['status'] == "success") {
                    resolve(data);
                } else {
                    reject(data['message']);
                }
            });
        });
     }

     public getMe(deviceID:any) {
        return new Promise((resolve, reject) => {
            console.log("https://steps.birkoss.com/api/steps/me.php?user_uid=" + this.userUid + "&device_id=" + btoa(deviceID));
           this.http.get("https://steps.birkoss.com/api/steps/me.php?user_uid=" + this.userUid + "&device_id=" + btoa(deviceID))
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

    /* Systems Management */

    public addSystem(systemID:string) {
        let found = false;
        this.systems.forEach(single_system => {
            if (single_system.id == systemID) {
                found = true;
            }
        }, this);

        if (!found) {
            let system:ConfigsSystem = {
                id: systemID,
                devices: [],
                currentDeviceID: "",
                lastUpdate: ""
            }
            system.id = systemID;
            this.systems.push(system);
            this.save();
        }
    }

    public deleteSystem(systemID:string) {
        let index = -1;
        this.systems = this.systems.filter(single_system => {
            if (single_system.id == systemID) {
                return false;
            }
            return true;
        });

        this.save();

        return true;
    }

    public getSystems():ConfigsSystem[] {
        return this.systems;
    }

    public addDevice(deviceID:string, deviceType:string, systemID:string) {
        if (deviceType == "") {
            deviceType = "wearable";
        }
        if (deviceID == "") {
            deviceID = systemID;
        }
        console.log(deviceID, deviceType, systemID);
        this.systems.forEach(single_system => {
            console.log(single_system);
            if (single_system.id == systemID) {
                if (single_system.devices.filter(single_device => {
                    return (single_device.id == deviceID);
                }, this).length != 1) {
                    let device:ConfigsDevice = {id:deviceID, type:deviceType};
                    single_system.devices.push(device);
                    if (single_system.currentDeviceID == "") {
                        single_system.currentDeviceID = deviceID;
                    }
                }
            }

        }, this);

        this.save();
    }

    public getDevices():ConfigsDevice[] {
        return this.getSystems()[0]['devices'];
    }
}
