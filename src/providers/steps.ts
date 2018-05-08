import { Injectable } from '@angular/core';

import { Health } from '@ionic-native/health';

import { ConfigsProvider } from "./configs"

declare var SamsungHealth:any;

export interface StepsSystem {
    id:string;
    name:string;
}

@Injectable()
export class StepsProvider {
	private systems:StepsSystem[] = [];

    constructor(private health:Health, private configsProvider:ConfigsProvider) {
    	this.systems.push({id:"samsung", name: "Samsung Health"});
        this.systems.push({id:"fitbit", name: "FitBit"});
        this.systems.push({id:"apple", name: "Apple"});
    	this.systems.push({id:"google", name: "Google"});
    }

    public askPermissions(systemID:string) {
        return new Promise((resolve, reject) => {
           switch (systemID) {
                case "apple":
                case "google":
                    this.health.isAvailable()
                    .then((available:boolean) => {
                      console.log(available);
                      this.health.requestAuthorization([
                        'distance', 'nutrition',  //read and write permissions
                        {
                          read: ['steps']       //read only permission
                        }
                      ])
                      .then(res => { 
                          resolve({status:"success", message:res})
                      })
                      .catch(e => reject({status:"error", message:e}));
                    })
                    .catch(e => reject({status:"error", message:e}));
                    break;
                case "samsung":
                    if (this.configsProvider.isDebug()) {
                        resolve({status:"success", message:"Ya man"});
                        //reject({status:"error", message:"Forced as false"});
                    } else {
                        let shealth = new SamsungHealth();
                        shealth.askPermissions('', function(msg) {
                            resolve({status:"success", message:msg});
                        }, function(err) {
                            reject({status:"error", message:err});
                        });
                    }
                    break;
                default:
                    reject({status:"error", message:"not done"});
                    break;
            }
          });
     }

    public getSystems():StepsSystem[] {
    	return this.systems;
    }

    public refreshSteps(systemID:string) {
        console.log("refreshSteps:" + systemID);
        var me = this;

        return new Promise((resolve, reject) => {
           switch (systemID) {
                case "apple":
                case "google":
                    this.health.isAvailable()
                    .then((available:boolean) => {
                      console.log(available);
                      this.health.requestAuthorization([
                        'distance', 'nutrition',  //read and write permissions
                        {
                          read: ['steps']       //read only permission
                        }
                      ])
                      .then(res => { 
                          me.health.queryAggregated({
                              startDate: new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
                              endDate: new Date(),
                              dataType: 'steps',
                              bucket: 'day'
                        })
                        .then((data) => {
                            resolve({status:"success", data:me.convertGoogleAppleSteps(data, systemID)});
                            //alert(JSON.stringify(me.convertGoogleAppleSteps(data)));
                        })
                        .catch(e => reject({status:"error", message:e}));
                      })
                      .catch(e => reject({status:"error", message:e}));
                    })
                    .catch(e => reject({status:"error", message:e}));
                    break;
                case "samsung":
                    if (this.configsProvider.isDebug()) {
                        let date = new Date();
                        let time = date.getTime();

                        let steps_json = '{"time":'+time+',"count":'+Math.floor((Math.random() * 2000) + 1000)+'}, {"time":'+(time-(24 * 60 * 60))+',"count":'+Math.floor((Math.random() * 2000) + 1000)+'}';

                        let data = '[{"uuid":"ALV976sVxD","steps":[' + steps_json + '],"type":17},{"uuid":"+GSb+Jg+XS","steps":[' + steps_json + '],"type":0}]';
                        resolve({status:"success", data:this.convertSamsungHealthSteps(data)});
                        //reject({status:"error", message:"Forced as false"});
                    } else {
                        let shealth = new SamsungHealth();

                        this.askPermissions(systemID).then(
                            (val) => {
                                shealth.getSteps('', function(data) {
                                    resolve({status:"success", data:me.convertSamsungHealthSteps(data)});
                                }, function(err) {
                                    reject({status:"error", message:err + "abc"});
                                });
                            },  
                            (err) => reject({status:"error", message:err + "def"})
                        );
                    }
                    break;
                default:
                    reject({status:"error", message:"not done"});
                    break;
            }
          });
    }

    private convertGoogleAppleSteps(data, systemID) {
        let json = data;

       var systems = [];

       let device = {
            uuid: "",
            systemID: systemID,
            type: ("wearable"),
            steps: []
        };

        systems.push(device);

        json.forEach(single_step => {
            var date = new Date(single_step['startDate']);
            let step = {
                count: single_step['value'],
                date: date.getFullYear() + "-" + this.formatDate(date.getMonth()+1) + "-" + this.formatDate(date.getDate())
            };

            device.steps.push(step);
        });

        return systems;
    }

    private convertSamsungHealthSteps(data) {
        let json = JSON.parse(data);

        var systems = [];

        json.forEach(single_device => {
            let device = {
                uuid: single_device['uuid'],
                systemID: 'samsung',
                type: (single_device['type'] == "0" ? "phone" : "wearable"),
                steps: []
            };

            single_device.steps.forEach(single_step => {
                var date = new Date(single_step['time']);
                let step = {
                    count: single_step['count'],
                    date: date.getFullYear() + "-" + this.formatDate(date.getMonth()+1) + "-" + this.formatDate(date.getDate())
                };

                device.steps.push(step);
            });

            systems.push(device);
        });

        return systems;
    }

    private formatDate(date) {
        if (date < 10) {
            date = "0" + date;
        }
        return date;
    }
}
