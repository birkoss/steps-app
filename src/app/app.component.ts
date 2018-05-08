import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MainTabs } from '../pages/tabs/tabs';
import { LoadingPage } from '../pages/loading/loading';
import { SystemsListPage } from '../pages/systems-list/systems-list';

import { BackgroundMode } from '@ionic-native/background-mode';

import { StepsProvider } from '../providers/steps';
import { ConfigsProvider } from '../providers/configs';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';

export interface PageInterface {
    title:string;
    component:any;
    icon:string;
    index?:number;
}



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
      @ViewChild(Nav) nav:Nav;

    pages:PageInterface[] = [];

  rootPage:any = LoadingPage;

  constructor(private stepsProvider:StepsProvider, private configsProvider:ConfigsProvider, private backgroundMode:BackgroundMode, public menu:MenuController, platform:Platform, statusBar:StatusBar, splashScreen:SplashScreen) {
    platform.ready().then(() => {
      
      try {
        this.backgroundMode.enable();
        
        this.backgroundMode.on("enable").subscribe(y => {
          Observable.interval(15000 * 60).subscribe(x => {
            this.configsProvider.getSystems().forEach(single_system => {
              this.refreshSteps(single_system.id);
            }, this);
          });
        });
      }
      catch(err) {
        //alert(err.message);
      }

        this.pages = [
          {title: 'Dashboard', component:MainTabs, icon: 'home'},
          {title: 'Systems list', component:SystemsListPage, icon: 'man'}
        ];

        statusBar.styleDefault();
        splashScreen.hide();
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }


  private refreshSteps(systemID) {
    return new Promise((resolve, reject) => {
      var me = this;
      this.stepsProvider.refreshSteps(systemID).then(
              (data) => {
                me.configsProvider.updateSteps(data['data'])
          .then((data) => resolve(data))
          .catch((err) => { reject(err) });
              },  
              (err) => { reject(err) }
          );
    });
  }
}

