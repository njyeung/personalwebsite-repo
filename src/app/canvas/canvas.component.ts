import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css'
})
export class CanvasComponent {
  @ViewChild('main') main: any
  @ViewChild('canvas') canvas: any
  context: CanvasRenderingContext2D | null | undefined

  html = document.documentElement;
  frameCount = 67;
  currFrameIndex = 1;
  img: ImageBitmap | null = null

  // Caches images
  loadedImages: Map<number, ImageBitmap> = new Map();

  // Scroll throttling
  private scrollPending = false;
  
  folder = 'jpgs-tiny'

  ngAfterViewInit() {
    this.context = this.canvas?.nativeElement.getContext('2d')
    this.canvas = this.canvas?.nativeElement

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.updateImage(1)
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    // Update canvas dimensions on resize
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if(this.img) {
      this.coverWindow(this.img);
    }
  }

  currentFrame(index: number){
    return `assets/${this.folder}/frame_${(Math.max(1, index-1)).toString()}.jpg`
  }
  
  constructor() {
    // check which folder to use
    if(window.innerHeight>window.innerWidth) {
      // mobile
      this.folder = 'jpgs-mobile'
    }
    if(window.innerHeight<=window.innerWidth) {
      // desktop
      if(window.innerWidth > 1920 + 20) {
        this.folder = 'jpgs-small'
      }
      else {
        this.folder = 'jpgs-tiny'
      }
    }

    // Throttle scroll events with requestAnimationFrame for better performance?
    document.addEventListener('scroll', () => {
      if (!this.scrollPending) {
        this.scrollPending = true;
        requestAnimationFrame(() => {
          this.play();
          this.scrollPending = false;
        });
      }
    }, { passive: true })

    this.preloadImages()
  }

  play() {
    const height = window.innerHeight * 2.5 // yes im hard coding this
    const scrollTop = this.html.scrollTop;
    const maxScrollTop = height - window.innerHeight;
    

    if(scrollTop <= maxScrollTop) {
      const scrollFraction = scrollTop / maxScrollTop;
      const frameIndex = Math.min(
        this.frameCount - 1,
        Math.ceil(scrollFraction * this.frameCount)
      );

      this.currFrameIndex = frameIndex+1;
      requestAnimationFrame(() => this.updateImage(frameIndex+1));
    }
  }

  async updateImage(index: number) {
    if(!this.loadedImages.has(index)) {
      await this.loadImage(index)
    }

    const bitmap = this.loadedImages.get(index)
    if(bitmap) {
      this.img = bitmap;
      this.coverWindow(bitmap);
    }
  }

  preloadImages() {
    for (let i = 1; i <= this.frameCount; i++) {
      this.loadImage(i);
    }
  }

  async loadImage(index: number) {
    if (this.loadedImages.has(index)) return;
    
    const resp = await fetch(this.currentFrame(index))
    const bitmap = await createImageBitmap(await resp.blob())
    this.loadedImages.set(index, bitmap);
  }

  coverWindow(img: any) {
    // Clear canvas before drawing optimization
    this.context?.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Cache dimensions to avoid repeated property access
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;

    const imgRatio = img.height / img.width
    const winRatio = canvasHeight / canvasWidth
    if (imgRatio > winRatio) {
      const h = canvasWidth * imgRatio
      this.context?.drawImage(img, 0, (canvasHeight - h) / 2, canvasWidth, h)
    }
    else if (imgRatio < winRatio) {
      const w = canvasWidth * winRatio / imgRatio
      this.context?.drawImage(img, (canvasWidth - w) / 2, 0, w, canvasHeight)
    }
  }
}

