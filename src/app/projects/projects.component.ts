import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CardComponent } from './card/card.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  deskSrc : string = 'assets/desk/desk-light.jpg'

  @ViewChildren(CardComponent, {read: ElementRef}) cards!: QueryList<ElementRef>;
  @ViewChild('plane') plane? : ElementRef;
  @ViewChild('detector') detector? : ElementRef;

  ngAfterViewInit() {
    
    
    const rect = this.plane?.nativeElement.getBoundingClientRect()
    this.cards.forEach((element)=> {
      var card = element.nativeElement;

      card.style.top = '50%'
      card.style.left = '50%'

      var drag: any = null;
      let offsetX = 0;
      let offsetY = 0; 
      
      card.onmousedown = function(e:any) {
        drag = card
        const rect = card.getBoundingClientRect();
        console.log(rect)
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
      }
      document.onmouseup = function() {
        drag = null
      }
      document.onmousemove = function(e) {
        
        if (drag == null) return
        const mappedX = ((e.clientX - rect.left - offsetX) / rect.width) * 100;
        const mappedY = ((e.clientY - rect.top - offsetY) / rect.height) * 100;

        // Set the card's position using the calculated percentages
        drag.style.position = 'absolute'; // Ensure absolute positioning
        drag.style.left = mappedX + '%';
        drag.style.top = mappedY + '%';

        // var x = e.clientX
        // var y = e.clientY
        // card.style.top = y + 'px'
        // card.style.left = x + 'px'
        // console.log(x + ' ' + y)
      }
    })
  }

}
