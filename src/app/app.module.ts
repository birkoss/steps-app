import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { ChallengesPage } from '../pages/challenges/challenges';
import { DevicesListPage } from '../pages/devices-list/devices-list';
import { LoadingPage } from '../pages/loading/loading';
import { MainTabs } from '../pages/tabs/tabs';

import { StepsProvider } from '../providers/steps';
import { ConfigsProvider } from '../providers/configs';

import { IonicStorageModule } from '@ionic/storage';

import { Health } from '@ionic-native/health';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { HttpModule } from '@angular/http';

import { SocialSharing } from '@ionic-native/social-sharing';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

import { ChartsModule } from 'ng2-charts';

import { NewDeviceModal } from '../modals/new-device/new-device';



@NgModule({
  declarations: [
    MyApp,

    HomePage,
    DashboardPage,
    ChallengesPage,
    LoadingPage,
    DevicesListPage,
    MainTabs,

    NewDeviceModal
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

    HomePage,
    DashboardPage,
    ChallengesPage,
    LoadingPage,
    DevicesListPage,
    MainTabs,

    NewDeviceModal
  ],
  providers: [
    StepsProvider,
    ConfigsProvider,
    SocialSharing,
    Health,
    AndroidPermissions,
    StatusBar,
    SplashScreen,
    UniqueDeviceID,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
