import { Component, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImportChild } from '@/app/shared/models/child';
import { ChildrenService } from '@/app/services/children.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-children-import',
  imports: [ButtonModule],
  templateUrl: './children-import.html',
})
export class ChildrenImport {
  private readonly childrenService = inject(ChildrenService);
  private _snackBar = inject(MatSnackBar);
  fileName = signal<string | null>(null);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file);
    }
  }

  private uploadFile(file: File): void {
    this.fileName.set(file.name);
    this.childrenService.importChildren(file).subscribe({
      next: (importedChildren: ImportChild) => {
        this._snackBar.open(`${importedChildren.importedCount} children imported successfully.`);
      },
      error: () => {
        this._snackBar.open('Error importing children.');
      },
    });
  }
}
