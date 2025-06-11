import { Component, ElementRef, Input, NgModule, ViewChild } from '@angular/core';
import { CardData } from '../CardData';
import { SafePipe } from '../../safe.pipe';
import { CommonModule, UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [SafePipe, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @ViewChild('card') card?: ElementRef
  @ViewChild('backface') backface? : ElementRef
  @ViewChild('glare') glare? : ElementRef
  @Input() hideiframe: boolean = false;
  @Input() data: CardData | null = null;
  @Input() floatShadow: boolean = false;
  @Input() inspectcard: boolean = false;

  urlType: "iframe" | "video" | "image" = "iframe";

  id?: string
  name?: string
  url?: string
  date?: string
  h1?: string
  p1?: string
  h2?: string
  p2?: string
  bg?: string
  frameworks?: string

  backgroundUrl : string = ""

  ngOnChanges() {
    if(this.inspectcard == false) {
      if(this.floatShadow==true) {
        this.card?.nativeElement.classList.add('float')
      }
      else {
        this.card?.nativeElement.classList.remove('float')
      }
    }
  }

  ngOnInit() {
    this.id = String(this.data?.id).padStart(3, '0')
    this.name = this.data?.name
    this.url = this.data?.url
    this.date = this.data?.date
    this.h1 = this.data?.h1
    this.p1 = this.data?.p1
    this.h2 = this.data?.h2
    this.p2 = this.data?.p2
    this.bg = this.data?.bg
    this.frameworks = this.data?.frameworks?.join(" | ")

    this.backgroundUrl = `url(${this.bg})`

    if(this.url?.endsWith(".mp4")) {
      this.urlType = "video";
    }
    else if(this.url?.endsWith(".jpg") || this.url?.endsWith(".png") || this.url?.endsWith(".jpeg")) {
      this.urlType = "image";
    }
    else {
      this.urlType = "iframe"
    }
  }

  ngAfterViewInit() {
    if(this.inspectcard == false) {
      this.card?.nativeElement.classList.add('static-shadow')
    }
    else {
      this.card?.nativeElement.classList.add('animation')
    }

    if(this.inspectcard == true) {

      // make backface invisible after peekin animation
      // make the card rotateX and rotateY follow the mouse
      // add glare that also follows mouse
      // add card edge glare
      setTimeout(()=>{
        this.backface?.nativeElement.classList.add('opac0')

        this.card?.nativeElement.addEventListener('mousemove', (event: MouseEvent)=> {
          var pX = event.clientX/window.innerWidth
          var pY = event.clientY/window.innerHeight
          var transX = this.scale(0, 1, -30, 30, pX)
          var transY = this.scale(0, 1, -30, 30, pY)

          var c = pY * 100
          var edgeGradient = `linear-gradient(135deg,
          transparent ${c-55}%, rgba(255,255,255,0.5) ${c-50}%, transparent ${c-45}%,
          transparent ${c-10}%, rgba(255,255,255,1) ${c}%, transparent ${c+10}%,
          transparent ${c+25}%, rgba(255,255,255, 0.6) ${c+30}%, transparent ${c+35}%,
          transparent ${c+50}%, rgba(255,255,255, 0.8) ${c+60}%, transparent ${c+70}%)`

          this.card?.nativeElement.setAttribute('style', `transform: rotateX(${-transY}deg) rotateY(${transX}deg);
            background: ${edgeGradient}, linear-gradient(135deg, rgba(192,192,192,1) 10%, rgba(235,235,235,1) 30%, rgba(192,192,192,1) 50%, rgba(218,218,218,1) 78%, rgba(192,192,192,1) 95%)`)
          this.glare?.nativeElement.setAttribute('style', `background: radial-gradient(circle at ${(1-pX)*100}% ${(1-pY)*100+10}%, rgba(255,255,255,0.2) 30%, transparent 70%)`)
        })
      }, 1000)
    }
  }

  scale(oldMin: number, oldMax: number, newMin: number, newMax: number, oldValue :number) {
    var oldRange = (oldMax - oldMin)
    if (oldRange == 0)
        var newValue = newMin
    else {
        var newRange = (newMax - newMin)
        var newValue = (((oldValue - oldMin) * newRange) / oldRange) + newMin
    }
    return newValue
  }
}
