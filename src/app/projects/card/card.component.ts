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
  @ViewChild('frame') frame? : ElementRef
  @ViewChild('backface') backface? : ElementRef 
  @ViewChild('glare') glare? : ElementRef
  @Input() hideiframe: boolean = false;
  @Input() data: CardData | null = null;
  @Input() floatShadow: boolean = false;
  @Input() inspectcard: boolean = false;

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

  backfaceVisible: boolean = true

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
      // make the card rotateX and rotateY perspective follow the mouse
      // add glare that also follows mouse
      setTimeout(()=>{
        this.backface?.nativeElement.classList.add('opac0')

        this.card?.nativeElement.addEventListener('mousemove', (event: MouseEvent)=> {
          
          var pX = event.clientX/window.innerWidth
          var pY = event.clientY/window.innerHeight
          var transX = this.scale(0, 1, -30, 30, pX)
          var transY = this.scale(0, 1, -30, 30, pY)

          this.card?.nativeElement.setAttribute('style', `transform: rotateX(${-transY}deg) rotateY(${transX}deg)`)

          this.glare?.nativeElement.setAttribute('style', `background: radial-gradient(circle at ${(1-pX)*100}% ${(1-pY)*100}%, rgba(255,255,255,0.2) 30%, transparent 80%)`)
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
