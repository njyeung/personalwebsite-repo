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
  img = new Image()

  // Caches images
  loadedImages: Map<number, HTMLImageElement> = new Map();
  
  folder = 'jpgs-tiny'

  ngAfterViewInit() {
    this.context = this.canvas?.nativeElement.getContext('2d')
    this.canvas = this.canvas?.nativeElement
    
    // yeah this works better for some reason
    this.canvas.height = 8000
    this.canvas.width = 8000

    const img = new Image();
    img.src = this.currentFrame(1);

    //this is cooked
    let self = this
    img.onload = function() {
      // graceful animation to load image before fade-in
      setTimeout(()=>{self.updateImage(1); console.log("INITIAL LOAD")}, 500);
      
      // sometimes it doesn't load though (might be slow internet or cache???), try again after fade-in animation
      setTimeout(()=>{self.updateImage(1); console.log("SECOND LOAD")}, 1000);
      setTimeout(()=>{self.updateImage(1); console.log("THIRD LOAD")}, 2000);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event:any) {
    this.coverWindow(this.img);
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

    const requestIdleFallback = window.requestIdleCallback || function (cb: any) {
      return setTimeout(cb, 1);
    };
    document.addEventListener('scroll', () => {
      requestIdleFallback(() => this.play(), { timeout: 50 });
    })

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

      if(frameIndex == this.currFrameIndex){
        // TRY THIS FOR OPTIMIZING
      }
      else {
        this.currFrameIndex = frameIndex+1;
        requestAnimationFrame(() => this.updateImage(frameIndex+1));
      } 
    }
  }

  updateImage(index: number) {
    if(this.loadedImages.has(index)) {
      this.img = this.loadedImages.get(index)!;
      this.coverWindow(this.img)
    }
    else {
      const newImg = new Image();
      newImg.src = this.currentFrame(index);
      newImg.onload = () => {
        this.loadedImages.set(index, newImg);
        this.coverWindow(this.img);
      }

    }
  }

  preloadImages() {
    const priorityRange = 10;

    // Load first few frames immediately
    for (let i = 2; i <= priorityRange; i++) {
      this.loadImage(i);
    }

    // Slowly load the rest
    let delay = 0;
    for (let i = priorityRange + 1; i <= this.frameCount; i++) {
      setTimeout(() => {
        this.loadImage(i);
      }, delay);
      delay += 100;
    }
  }

  loadImage(index: number) {
    if (this.loadedImages.has(index)) return;

    const img = new Image();
    img.src = this.currentFrame(index);
    img.onload = () => {
      this.loadedImages.set(index, img);
    };
    img.onerror = () => {
      console.warn(`Failed to load frame ${index}`);
    };
  }

  coverWindow(img: any) {
    const imgRatio = img.height / img.width
    const winRatio = window.innerHeight / window.innerWidth
    if (imgRatio > winRatio) {
      const h = window.innerWidth * imgRatio
      this.context?.drawImage(img, 0, (window.innerHeight - h) / 2, window.innerWidth, h)
    }
    else if (imgRatio < winRatio) {
      const w = window.innerWidth * winRatio / imgRatio
      this.context?.drawImage(img, (window.innerWidth - w) / 2, 0, w, window.innerHeight)
    }
  }
}

