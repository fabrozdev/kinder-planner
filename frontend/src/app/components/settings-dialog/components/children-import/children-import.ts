import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImportChild } from '@/app/shared/models/child';
import { ChildrenService } from '@/app/services/children.service';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-children-import',
  imports: [ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './children-import.html',
})
export class ChildrenImport {
  private readonly childrenService = inject(ChildrenService);
  private readonly messageService = inject(MessageService);
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${importedChildren.importedCount} children imported successfully.`,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error importing children.',
        });
      },
    });
  }
}
