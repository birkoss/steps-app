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
                          alert(res);
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
                var me = this;
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
                        let data = '[{"uuid":"ALV976sVxD","steps":[{"time":1525169605559,"count":1858},{"time":1525083350039,"count":5310},{"time":1524998787752,"count":7763},{"time":1524895168261,"count":12690},{"time":1524823329671,"count":5187},{"time":1524738902179,"count":6553},{"time":1524651147455,"count":7474},{"time":1524585541475,"count":6105},{"time":1524478581570,"count":6173},{"time":1524392886513,"count":13583},{"time":1524305090937,"count":8779},{"time":1524219347128,"count":5449},{"time":1524132949287,"count":6300},{"time":1524046453652,"count":5391},{"time":1523960153604,"count":4814},{"time":1523873493061,"count":2625},{"time":1523789395308,"count":6111},{"time":1523701420368,"count":7545},{"time":1523623363890,"count":6631},{"time":1523538403198,"count":4220},{"time":1523441760517,"count":4729},{"time":1523355615200,"count":5306},{"time":1523269119425,"count":5318},{"time":1523165124458,"count":6918},{"time":1523089146257,"count":6933},{"time":1523009524209,"count":4999},{"time":1522923351083,"count":5279},{"time":1522836969420,"count":6025},{"time":1522750546089,"count":5002},{"time":1522654407925,"count":11352},{"time":1522582184324,"count":7957},{"time":1522516642200,"count":6272}],"type":17},{"uuid":"+GSb+Jg+XS","steps":[{"time":1525107043227,"count":2534},{"time":1525061471800,"count":117},{"time":1524974403145,"count":5595},{"time":1524888003042,"count":4201},{"time":1524805604794,"count":3562},{"time":1524717370109,"count":3080},{"time":1524628802964,"count":3609},{"time":1524542403064,"count":3658},{"time":1524456002935,"count":9470},{"time":1524375819176,"count":2215},{"time":1524288619582,"count":2364},{"time":1524199569225,"count":4478},{"time":1524112773736,"count":2795},{"time":1524028877970,"count":3229},{"time":1523942800779,"count":264},{"time":1523865375973,"count":2798},{"time":1523765679396,"count":3362},{"time":1523678814776,"count":3112},{"time":1523594491568,"count":1965},{"time":1523509665613,"count":1655},{"time":1523422471878,"count":2162},{"time":1523336402726,"count":1856},{"time":1523251182195,"count":1346},{"time":1523160002319,"count":3468},{"time":1523073602519,"count":3133},{"time":1522992422930,"count":1874},{"time":1522904093529,"count":3857},{"time":1522818823223,"count":1569},{"time":1522730622448,"count":7959},{"time":1522641601564,"count":6196},{"time":1522555201061,"count":2475}],"type":0}]';
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
