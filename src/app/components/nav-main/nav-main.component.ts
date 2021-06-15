import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import * as p5 from 'p5';

let p: p5;

@Component({
  selector: 'app-nav-main',
  templateUrl: './nav-main.component.html',
  styleUrls: ['./nav-main.component.css']
})
export class NavMainComponent implements OnInit {
  private menuObjects?: MenuObjects;
  private images: p5.Image[] = [];

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  ngOnInit(): void {

    p = new p5(p => {
      let x = 100;
      let y = 100;

      p.preload = () => {
        const imagesPaths = [
          'assets/icons/Characters.png',
          'assets/icons/visual-development.png',
          'assets/icons/sketches-and-drawings.png',
          'assets/icons/animation2.gif'
        ];

        imagesPaths.forEach(path => this.images.push(p.loadImage(path)));
      }

      p.setup = () => {
        p.createCanvas(p.windowWidth / 1.5, p.windowHeight / 1.5).parent('canvas-container');
        p.angleMode(p.DEGREES);
        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);

        this.menuObjects = new MenuObjects(this.images);
      }

      p.draw = () => {
        p.background(255);
        this.menuObjects?.show();
      };
    }, this.el.nativeElement);
  }
}


class MenuObjects {
  private readonly delta = 0.2;
  private readonly maxScale = 1.3;
  private readonly maxTint = p.color(255, 255);
  private readonly midTint = p.color(114, 255);
  private readonly minTint = p.color(0, 255);

  // private idx: number = -1;
  private images: p5.Image[] = [];
  private xPositions: number[] = [];
  private yPositions: number[] = [];
  private imagesOriginalH: number[] = [];
  private imagesOriginalW: number[] = [];
  private tints: p5.Color[] = [];

  private noneIsHovered = true;

  constructor(images: p5.Image[]) {
    this.images = images;

    const imgXdist = p.width / 4;
    // const imgYdist = p.height / 2;

    this.images.forEach(image => image.resize(
      imgXdist / image.height * image.width,
      imgXdist / image.height * image.height))

    let imgPosX = imgXdist / 2;
    let imgPosY = imgXdist / 2;

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      const initScale = 0.7;

      this.xPositions.push(imgPosX);
      this.yPositions.push(imgPosY);
      this.imagesOriginalH.push(image.height * initScale);
      this.imagesOriginalW.push(image.width * initScale);
      this.tints.push(p.color(255, 255));

      // if ((i + 1) % 3 === 0) {
      //   imgPosX = imgXdist / 2;
      //   imgPosY += imgYdist;
      // } else {
        imgPosX += imgXdist;
      // }
    }
  }

  public show(): void {
    let noneIsHoveredInternal = true;

    for (let i = 0; i < this.images.length; i++) {
      const image = this.images[i];
      const x = this.xPositions[i];
      const y = this.yPositions[i];

      const originalW = this.imagesOriginalW[i];
      const originalH = this.imagesOriginalH[i];

      const dist = p.dist(p.mouseX, p.mouseY, x, y);
      
      const tintR = 60;
      const tintG = 80;
      const tintB = 60;
      const tintA = 120;

      if (dist < originalH) {
        if (noneIsHoveredInternal) {
          noneIsHoveredInternal = false;
        }

        if (image.height < originalH * this.maxScale) {
          const scale = p.lerp(1, this.maxScale, this.delta);

          image.width *= scale;
          image.height *= scale;
        }

        if (this.tints[i] != this.maxTint) {
          this.tints[i] = p.lerpColor(this.tints[i], this.maxTint, this.delta);
          p.tint(this.tints[i]);
        }

      } else {
        if (image.width !== originalW && image.height !== originalH) {
          const w = p.lerp(image.width, originalW, this.delta);
          const h = p.lerp(image.height, originalH, this.delta);

          image.width = w;
          image.height = h;
        }

        if (this.tints[i] != this.minTint) {
          this.tints[i] = p.lerpColor(this.tints[i], this.minTint, this.delta);
          p.tint(this.tints[i]);
        }
      }

      // If none of the menu items is selected reset the
      // effects.
      if (this.noneIsHovered) {
        console.log("none is hovered");
        if (this.tints[i] != this.midTint) {
          this.tints[i] = p.lerpColor(this.tints[i], this.maxTint, this.delta);
          p.tint(this.tints[i]);
        }
      }

      p.image(image, x, y);
    }

    this.noneIsHovered = noneIsHoveredInternal;
  }
}

