import { Component, inject, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';
import { FacialScan, FacialScanStatus } from '../../../domain/model/facial-scan.entity';

/**
 * Guides the user through preparation tips before starting a facial scan.
 * Supports uploading a photo from the file system or capturing one live via the device camera.
 * Submits the scan to the store before proceeding to the processing screen.
 */
@Component({
  selector: 'app-scan-prepare',
  standalone: true,
  imports: [MatIconModule, TranslatePipe],
  templateUrl: './scan-prepare.html',
  styleUrl: './scan-prepare.css',
})
export class ScanPrepare implements OnDestroy {
  @ViewChild('videoEl') videoElRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasElRef!: ElementRef<HTMLCanvasElement>;

  protected router = inject(Router);
  protected store = inject(SkinAnalysisStore);

  /** URL of the captured or uploaded photo, or null if none has been provided yet. */
  readonly uploadedPhotoUrl = signal<string | null>(null);

  /** Whether the live camera preview is currently active. */
  readonly cameraActive = signal<boolean>(false);

  /** Whether a camera error occurred (e.g. permission denied). */
  readonly cameraError = signal<boolean>(false);

  /** i18n keys for each preparation tip displayed in the list. */
  readonly tipKeys: string[] = [
    'skinAnalysis.scanPrepare.tip1',
    'skinAnalysis.scanPrepare.tip2',
    'skinAnalysis.scanPrepare.tip3',
    'skinAnalysis.scanPrepare.tip4',
  ];

  /** Active media stream from the camera, kept for cleanup on destroy. */
  private mediaStream: MediaStream | null = null;

  /**
   * Handles a photo file upload from the file input and creates a local preview URL.
   * @param event - The input change event from the file selector.
   */
  onUploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadedPhotoUrl.set(URL.createObjectURL(file));
    this.stopCamera();
  }

  /**
   * Requests camera access from the browser and starts the live preview.
   * Handles cases where the user denies the permission.
   */
  async onOpenCamera(): Promise<void> {
    this.cameraError.set(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      this.mediaStream = stream;
      this.cameraActive.set(true);

      // Assign the stream to the video element after Angular renders it
      setTimeout(() => {
        if (this.videoElRef?.nativeElement) {
          this.videoElRef.nativeElement.srcObject = stream;
        }
      }, 100);
    } catch {
      this.cameraError.set(true);
      this.cameraActive.set(false);
    }
  }

  /**
   * Captures the current video frame as a JPEG image and stores it as the scan photo.
   * Stops the camera after capturing.
   */
  onCapture(): void {
    const video = this.videoElRef?.nativeElement;
    const canvas = this.canvasElRef?.nativeElement;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    this.uploadedPhotoUrl.set(dataUrl);
    this.stopCamera();
  }

  /** Stops the camera stream and hides the preview. */
  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }

  /**
   * Creates a new facial scan in the store and navigates to the progress screen.
   * Uses a placeholder image URL if no photo was captured or uploaded.
   */
  onStartScan(): void {
    const imageUrl = this.uploadedPhotoUrl() ?? 'https://placehold.co/400x400';

    const newScan = new FacialScan({
      id: 0,
      userId: 1,
      skinProfileId: 1,
      imageUrl,
      diagnosis: 'Scan in progress — AI analysis pending.',
      overallScore: 0,
      hydrationScore: 0,
      textureScore: 0,
      sensitivityScore: 0,
      brightnessScore: 0,
      scannedAt: new Date().toISOString(),
      status: FacialScanStatus.InProgress,
    });

    this.store.submitFacialScan(newScan);
    this.router.navigate(['/skin-analysis/progress']);
  }

  /** Navigates back to the skin scan home screen. */
  navigateBack(): void {
    this.stopCamera();
    this.router.navigate(['/skin-analysis']);
  }

  /** Releases camera resources when the component is destroyed. */
  ngOnDestroy(): void {
    this.stopCamera();
  }
}
