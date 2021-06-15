import { Component, Input, OnInit } from '@angular/core';
import { ImageModel } from 'src/app/models/image.model';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  @Input()
  public images: ImageModel[] = [];

  public hoveredImage?: ImageModel;
  public selectedImage?: ImageModel;
  public imageModalIsOpened: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public onMouseIn(image: ImageModel): void {
    this.hoveredImage = image;
  }

  public onMouseOut(): void {
    this.hoveredImage = undefined;
  }

  public onImageClick(image: ImageModel): void {
    this.selectedImage = image;
    this.imageModalIsOpened = true;
  }

  public closeImageModal(): void {
    this.imageModalIsOpened = false;
    this.selectedImage = undefined;
  }

  public selectNextImage() {
    if (this.selectedImage) {
      const index = this.images.indexOf(this.selectedImage);

      if (index >= 0 && index < this.images.length - 1)
        this.selectedImage = this.images[index + 1];
    }
  }

  public selectPrevImage() {
    if (this.selectedImage) {
      const index = this.images.indexOf(this.selectedImage);

      if (index > 0)
        this.selectedImage = this.images[index - 1];
    }
  }
}
