import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @ViewChild('card') container? : ElementRef;
  
  ngAfterViewInit() {
    // var card = this.container?.nativeElement
    // card.style.top = '50%'
    // card.style.left = '50%'

    // var drag: any = null;
    
    // card.onmousedown = function() {
    //   drag = card
    // }
    // document.onmouseup = function() {
    //   drag = null
    // }
    // document.onmousemove = function(e) {
    //   if (drag == null) return
      
    //   var x = e.pageX;
    //   var y = e.pageY

    //   card.style.top = y + 'px'
    //   card.style.left = x + 'px'
    //   // console.log(x + ' ' + y)
    // }
  }
}
