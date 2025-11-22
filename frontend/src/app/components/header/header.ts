import { Component, effect, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SettingsDialog } from '@/app/components/settings-dialog/settings-dialog';
import { PlannerNavigator } from '@/app/features/planner/components/planner-navigator/planner-navigator';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [PlannerNavigator, ButtonModule, SelectButtonModule, FormsModule, SettingsDialog],
  templateUrl: './header.html',
})
export class Header {
  private platformId = inject(PLATFORM_ID);

  mode = signal<'MONTH' | 'YEAR'>('MONTH');
  settingsDialogVisible = signal(false);
  isDarkMode = signal(false);

  modeOptions = [
    { label: 'Monthly', value: 'MONTH' },
    { label: 'Yearly', value: 'YEAR' },
  ];

  constructor() {
    // Initialize dark mode from localStorage or system preference
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        this.isDarkMode.set(true);
      } else if (!savedTheme) {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDarkMode.set(prefersDark);
      }

      // Apply theme on initialization
      this.applyTheme(this.isDarkMode());
    }

    // Watch for theme changes
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        this.applyTheme(this.isDarkMode());
        localStorage.setItem('theme', this.isDarkMode() ? 'dark' : 'light');
      }
    });
  }

  openDialog() {
    this.settingsDialogVisible.set(true);
  }

  toggleDarkMode() {
    this.isDarkMode.update(current => !current);
  }

  private applyTheme(isDark: boolean) {
    const element = document.documentElement;
    if (isDark) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
  }

  get themeIcon(): string {
    return this.isDarkMode() ? 'pi-sun' : 'pi-moon';
  }
}
