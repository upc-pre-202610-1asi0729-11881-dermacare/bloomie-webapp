import { Component, inject, OnDestroy, signal, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { SkinAnalysisStore } from '../../../application/skin-analysis.store';
import { IamStore } from '../../../../iam/application/iam.store';

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
  private iamStore = inject(IamStore);

  readonly uploadedPhotoUrl = signal<string | null>(null);
  readonly cameraActive = signal<boolean>(false);
  readonly cameraError = signal<boolean>(false);

  readonly tipKeys: string[] = [
    'skinAnalysis.scanPrepare.tip1',
    'skinAnalysis.scanPrepare.tip2',
    'skinAnalysis.scanPrepare.tip3',
    'skinAnalysis.scanPrepare.tip4',
  ];

  private mediaStream: MediaStream | null = null;

  onUploadPhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    this.uploadedPhotoUrl.set(URL.createObjectURL(file));
    this.stopCamera();
  }

  async onOpenCamera(): Promise<void> {
    this.cameraError.set(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      this.mediaStream = stream;
      this.cameraActive.set(true);
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

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    this.cameraActive.set(false);
  }

  onStartScan(): void {
    const patientId = this.iamStore.currentUser()?.id;
    if (!patientId) return;
    // uploadedPhotoUrl is a local blob/base64 URL for preview only — backend expects a real HTTP URL
    this.store.startAndSubmitFacialScan(patientId, 'https://placehold.co/400x400');
    this.router.navigate(['/skin-analysis/progress']);
  }

  navigateBack(): void {
    this.stopCamera();
    this.router.navigate(['/skin-analysis']);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}
