import { Component, output, signal } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

/**
 * QR code scanner wrapper component using zxing-scanner
 */
@Component({
    selector: 'app-scanner',
    imports: [ZXingScannerModule],
    templateUrl: './scanner.html',
    styleUrl: './scanner.scss',
})
export class Scanner {
    /** Emits the scanned code value when a QR code is successfully scanned */
    readonly scanned = output<string>();

    /** Emits when the scanner encounters an error */
    readonly scanError = output<string>();

    /** Emits when camera permissions are granted or denied */
    readonly permissionResponse = output<boolean>();

    /** The formats to scan for - QR codes only */
    protected readonly formats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];

    /** Whether the scanner has camera permission */
    protected readonly hasPermission = signal<boolean | null>(null);

    /** Whether the scanner is currently active */
    protected readonly isScanning = signal(true);

    /** Available cameras */
    protected readonly availableCameras = signal<MediaDeviceInfo[]>([]);

    /** Currently selected camera */
    protected readonly selectedCamera = signal<MediaDeviceInfo | undefined>(undefined);

    /**
     * Handles successful QR code scan
     */
    onCodeScanned(result: string): void {
        this.isScanning.set(false);
        this.scanned.emit(result);
    }

    /**
     * Handles camera permission response
     */
    onPermissionResponse(hasPermission: boolean): void {
        this.hasPermission.set(hasPermission);
        this.permissionResponse.emit(hasPermission);
    }

    /**
     * Handles available cameras list
     */
    onCamerasFound(cameras: MediaDeviceInfo[]): void {
        this.availableCameras.set(cameras);
        if (cameras.length > 0) {
            // Prefer back camera if available
            const backCamera = cameras.find((c) => c.label.toLowerCase().includes('back'));
            this.selectedCamera.set(backCamera ?? cameras[0]);
        }
    }

    /**
     * Handles scanner errors
     */
    onScanError(error: Error): void {
        this.scanError.emit(error.message);
    }

    /**
     * Resets the scanner to scan again
     */
    reset(): void {
        this.isScanning.set(true);
    }
}
