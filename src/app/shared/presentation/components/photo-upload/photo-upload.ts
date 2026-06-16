import { Component, DestroyRef, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Reusable profile photo upload widget.
 *
 * @remarks
 * Renders the current photo (or a generic placeholder) as a clickable
 * avatar. Selecting a file triggers an immediate preview; the user can
 * then confirm with "Save" (which calls the backend and updates the
 * store) or discard with "Cancel". Files larger than 1 MB are rejected
 * before the FileReader runs.
 */
@Component({
  selector: 'app-photo-upload',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './photo-upload.html',
  styleUrl: './photo-upload.css',
})
export class PhotoUpload {
  /** Identifier of the user whose photo is being managed. */
  @Input() userId!: number;

  /** Current photo URL shown before any new selection is made. */
  @Input() currentPhotoUrl?: string;

  /** Emits the Base64 data URL after a successful save. */
  @Output() readonly photoUpdated = new EventEmitter<string>();

  private readonly iamStore   = inject(IamStore);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly previewUrl     = signal<string | null>(null);
  protected readonly loading        = signal<boolean>(false);
  protected readonly successMessage = signal<string | null>(null);
  protected readonly errorMessage   = signal<string | null>(null);

  private readonly MAX_SIZE_BYTES = 1 * 1024 * 1024;

  /** Photo shown in the avatar: the new preview if selected, otherwise the stored URL. */
  protected get displayUrl(): string | undefined {
    return this.previewUrl() ?? this.currentPhotoUrl;
  }

  protected onAvatarClick(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  protected onFileSelected(event: Event, fileInput: HTMLInputElement): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (file.size > this.MAX_SIZE_BYTES) {
      this.errorMessage.set('photoUpload.fileTooLarge');
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  protected onSave(): void {
    const url = this.previewUrl();
    if (!url) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.iamStore.updateUserPhoto(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.previewUrl.set(null);
          this.successMessage.set('photoUpload.success');
          this.photoUpdated.emit(url);
          setTimeout(() => this.successMessage.set(null), 3000);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('photoUpload.error');
        },
      });
  }

  protected onCancel(): void {
    this.previewUrl.set(null);
    this.errorMessage.set(null);
  }
}
