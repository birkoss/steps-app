import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { BackgroundMode } from '@ionic-native/background-mode';


import { MyApp } from './app.component';

import { DashboardPage } from '../pages/dashboard/dashboard';
import { ChallengesPage } from '../pages/challenges/challenges';
import { StatsPage } from '../pages/stats/stats';
import { SystemsListPage } from '../pages/systems-list/systems-list';
import { LoadingPage } from '../pages/loading/loading';
import { MainTabs } from '../pages/tabs/tabs';

import { StepsProvider } from '../providers/steps';
import { ConfigsProvider } from '../providers/configs';

import { DayPrettify } from '../pipes/day-prettify';
import { DatePrettify } from '../pipes/date-prettify';

import { IonicStorageModule } from '@ionic/storage';

import { Health } from '@ionic-native/health';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { HttpModule } from '@angular/http';

import { SocialSharing } from '@ionic-native/social-sharing';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    MyApp,

    DayPrettify,
    DatePrettify,

    DashboardPage,
    ChallengesPage,
    StatsPage,
    LoadingPage,
    SystemsListPage,
    MainTabs
  ],
  imports: [
    BrowserModule,
    ChartsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    DashboardPage,
    ChallengesPage,
    StatsPage,
    LoadingPage,
    SystemsListPage,
    MainTabs
  ],
  providers: [
    StepsProvider,
    ConfigsProvider,
    SocialSharing,
    Health,
    BackgroundMode,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
