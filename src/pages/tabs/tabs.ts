import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';

export interface TabInterface {
    title: string;
    icon:string;
    pageRoot:any;
}

@Component({
    templateUrl: 'tabs.html'
})

export class MainTabs {
    private tabs: TabInterface[] = [
        {title: 'Dashboard', icon:'home', pageRoot:DashboardPage},
        {title: 'Stats', icon:'stats', pageRoot:DashboardPage},
        {title: 'Challenges', icon:'walk', pageRoot:DashboardPage}
    ];

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
