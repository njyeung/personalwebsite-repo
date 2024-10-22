import { Component, ElementRef, Input, NgModule, ViewChild } from '@angular/core';
import { CardData } from '../CardData';
import { SafePipe } from '../../safe.pipe';
import { UpperCasePipe } from '@angular/common';
@Component({
  selector: 'app-card',
  standalone: true,
  imports: [SafePipe, UpperCasePipe],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @ViewChild('card') card?: ElementRef
  @ViewChild('frame') frame? : ElementRef
  @Input() hideiframe: boolean = false;
  @Input() data: CardData | null = null
  @Input() floatShadow: boolean = false

  id?: string
  name?: string
  url?: string
  date?: string
  h1?: string
  p1?: string
  h2?: string
  p2?: string
  frameworks?: string

  ngOnChanges() {
    if(this.floatShadow==true) {
      this.card?.nativeElement.classList.add('float')
    }
    else {
      this.card?.nativeElement.classList.remove('float')
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
    console.log(this.url)
    this.frameworks = this.data?.frameworks?.join(" | ")
  }
}
