import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MainTabs } from '../pages/tabs/tabs';
import { LoadingPage } from '../pages/loading/loading';
import { DevicesListPage } from '../pages/devices-list/devices-list';

import { StepsProvider } from '../providers/steps';

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

  constructor(stepsProvider:StepsProvider, public menu:MenuController, platform:Platform, statusBar:StatusBar, splashScreen:SplashScreen) {
    platform.ready().then(() => {
      stepsProvider.load().then(result => {

        console.log("Loaded: " + result);

        this.pages = [
          {title: 'Dashboard', component:MainTabs, icon: 'home'},
          {title: 'Devices list', component:DevicesListPage, icon: 'man'}
        ];

        statusBar.styleDefault();
        splashScreen.hide();
      });
    });
  }

  openPage(page) {
    this.menu.close();
    this.nav.setRoot(page.component);
  }
}

