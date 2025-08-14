import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {ImageCroppedEvent, ImageTransform} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Observable, Observer} from 'rxjs';

@Component({
  selector: 'app-image-crop',
  templateUrl: './image-crop.component.html',
  styleUrls: ['./image-crop.component.scss']
})
export class ImageCropComponent implements OnInit {
  imageChangedEvent: any;
  croppedImage: any = '';
  imgTransform = new class implements ImageTransform {
    flipH: boolean;
    flipV: boolean;
    rotate = 0;
    scale = 1;
  };
  showCropper = false;
  imageForUpload: File;

  constructor(@Inject(MAT_DIALOG_DATA) public imageData: any) {
  }

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageData.imageSource.imageForPreview = this.croppedImage;
    this.prepareImageForUpload();
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    // show message
  }

  rotateRight() {
    let oldDegree = this.imgTransform.rotate;
    this.imgTransform = new class implements ImageTransform {
      flipH: boolean;
      flipV: boolean;
      rotate = oldDegree += 90;
      scale: number;
    };
  }

  addPhoto() {
    this.showCropper = true;
    $('#profileImageUpload').click();
  }

  prepareImageForUpload(): any {
    this.createBlobImageFile();
    this.imageData.imageSource.imageForUpload = this.imageForUpload;
  }

  createBlobImageFile(): void {
    const imageContent = this.croppedImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, '');
    this.dataURItoBlob(imageContent).subscribe((blob: Blob) => {
      const imageBlob: Blob = blob;
      const imageName = this.generateName();
      const imageFile: File = new File([imageBlob], imageName, {
        type: 'image/jpeg'
      });
      this.imageForUpload = imageFile;     
    });
  }

  /**Method to Generate a Name for the Image */
  generateName(): string {
    const date: number = new Date().valueOf();
    let text = '';
    const possibleText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
    }
    // Replace extension according to your media type like this
    return date + '.' + text + '.jpeg';
  }

  /* Method to convert Base64Data Url as Image Blob */
  dataURItoBlob(dataURI: string): Observable<Blob> {
    return Observable.create((observer: Observer<Blob>) => {
      const byteString: string = window.atob(dataURI);
      const arrayBuffer: ArrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array: Uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([int8Array], {type: 'image/jpeg'});
      observer.next(blob);
      observer.complete();
    });
  }
}
