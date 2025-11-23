import { Component } from '@angular/core';
import { SettingsButton } from '@/app/components/settings-button/settings-button';
import { ThemeSwitcher } from '@/app/components/theme-switcher/theme-switcher';
import { ModeSwitcher } from '@/app/components/mode-switcher/mode-switcher';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { Button, ButtonModule } from 'primeng/button';
import { LocationButton } from '@/app/components/location-button/location-button';
import { Divider } from 'primeng/divider';

@Component({
  selector: 'app-header',
  imports: [
    PlannerNavigator,
    SettingsButton,
    ThemeSwitcher,
    ModeSwitcher,
    ButtonModule,
    LocationButton,
    Divider,
  ],
  templateUrl: './header.html',
})
export class Header {}
