import { Component, inject, model } from '@angular/core';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LocationService } from '@/app/services/location.service';
import { CreateLocation } from '@/app/shared/models/location';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-location-dialog',
  imports: [Button, Dialog, InputText, FormsModule, ReactiveFormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './location-dialog.html',
  standalone: true,
})
export class LocationDialog {
  private readonly locationService = inject(LocationService);
  private readonly messageService = inject(MessageService);

  locationForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required, Validators.minLength(1)]),
  });

  visible = model.required<boolean>();

  close() {
    this.locationForm.reset();
    this.visible.set(false);
  }

  save() {
    if (this.locationForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please enter a location name.',
      });
      return;
    }

    const location: CreateLocation = {
      name: this.locationForm.get('name')?.value || '',
    };

    this.locationService.createLocation(location).subscribe({
      next: (createdLocation) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Location "${createdLocation.name}" created successfully.`,
        });
        this.close();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error creating location.',
        });
      },
    });
  }

  get isNameValid(): boolean {
    return this.locationForm.get('name')?.valid || false;
  }
}
