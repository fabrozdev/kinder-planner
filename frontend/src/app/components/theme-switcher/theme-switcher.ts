import { Component, effect, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-switcher',
  imports: [ButtonModule],
  templateUrl: './theme-switcher.html',
  standalone: true,
})
export class ThemeSwitcher {
  private platformId = inject(PLATFORM_ID);
  isDarkMode = signal(false);

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