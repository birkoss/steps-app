import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { DashboardPage } from '../dashboard/dashboard';
import { StatsPage } from '../stats/stats';
import { ChallengesPage } from '../challenges/challenges';

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
        {title: 'Stats', icon:'stats', pageRoot:StatsPage},
        {title: 'Challenges', icon:'walk', pageRoot:ChallengesPage}
    ];

    mySelectedIndex: number;

    constructor(navParams: NavParams) {
        this.mySelectedIndex = navParams.data.tabIndex || 0;
    }
}
