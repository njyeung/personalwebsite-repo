import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardData } from './CardData';
import json from '../../assets/data.json'
import { CommonModule, NgFor } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CardComponent, NgFor, CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  deskSrc : string = 'assets/desk/desk-light.jpg'
  deskLayerSrc : string = 'assets/desk/desk-light-layer.png'
  
  inspectcard : CardComponent | null = null

  @ViewChildren(CardComponent, {read: ElementRef}) cards!: QueryList<ElementRef>;
  @ViewChildren(CardComponent) cardComponents!: QueryList<CardComponent>;
  @ViewChild('plane') plane? : ElementRef;
  hideiframe: boolean = false;

  data: CardData[] = []

  release() {

    
    this.cards.forEach((card)=> {
      if(card.nativeElement.firstChild.firstChild.firstChild.innerText == this.inspectcard?.name) {
        card.nativeElement.firstChild.classList.remove('lead-in')
      }
    })

    this.inspectcard=null;
    
  }

  ngOnInit() {
    var values = Object.values(json)

    values.forEach((value:any)=> {
      var card: CardData = {
        id: value.id,
        name: value.name,
        url: value.url,
        date: value.date,
        h1: value.h1,
        p1: value.p1,
        h2: value.h2,
        p2: value.p2,
        bg: value.bg,
        frameworks: value.frameworks
      }
      this.data.push(card)
    })
  }

  ngAfterViewInit() {
    var initialTop = '40%';
    var initialLeft = '50%';
    var zIndexList : any = []

    this.cards.forEach((element)=> {
      var card = element.nativeElement;
     
      // z index management
      card.style.zIndex = String(zIndexList.indexOf(card) + 10);
      zIndexList.push(card)

      // card spawns
      card.style.top = initialTop;
      card.style.left = initialLeft;
      initialTop = `${Number(initialTop.split("%")[0]) - 0.5}%`
      initialLeft = `${(Number(initialLeft.split("%")[0]) + 0.2)}%`
      
      let isDragging = false;

      let offsetX = 0;
      let offsetY = 0;

      let prev = card.getBoundingClientRect();

      card.addEventListener('mousedown', (event: MouseEvent) => {
        event.preventDefault();
        this.hideiframe = true;

        // z index shift
        zIndexList.splice(zIndexList.indexOf(card),1)
        zIndexList.push(card)
        for(let i=0;i<zIndexList.length;i++) {
          zIndexList[i].style.zIndex = String(i + 10)
        }
        
        isDragging = true;
        prev = card.getBoundingClientRect();
        offsetX = event.clientX - card.getBoundingClientRect().left;
        offsetY = event.clientY - card.getBoundingClientRect().top;
        card.style.cursor = 'grabbing'; 
      });

      document.addEventListener('mousemove', (event: MouseEvent) => {
      if (isDragging == true) {
        this.moveCard(card,event.clientX, event.clientY, offsetX, offsetY);
        card.firstChild.classList.add('shadow-float')
      }
    });

      document.addEventListener('mouseup', () => {
        if(isDragging == true) {
          if(card.getBoundingClientRect().x == prev.x && card.getBoundingClientRect().y == prev.y) {
            // This gets the title of the clicked card... sorry
            var title = card.firstChild.firstChild.firstChild.innerText

            this.cardComponents.forEach((component)=> {
              if(component.name == title) {
                
                this.inspectcard = component;
                card.firstChild.classList.add('lead-in')
              }
            })
          }
        }
        card.firstChild.classList.remove('shadow-float')
        this.hideiframe = false;
        isDragging = false;
        card.style.cursor = 'grab';
      });
    });
  }
  
  moveCard(card: any, mouseX: number, mouseY: number, offsetX: number, offsetY: number) {
    const { x, y } = this.getTransformedCoordinates(mouseX, mouseY);

    // boundary calculation
    var left = x/2560<2/5
    var top = y/1440<1/6
    if(left && top) {
      
    }
    else if(!left && top) {
      card.style.left = `${(x - offsetX)}px`;
    }
    else if(left && !top) {
      card.style.top = `${(y - offsetY)}px`;
    }
    else {
      card.style.left = `${(x - offsetX)}px`;
      card.style.top = `${(y - offsetY)}px`;
    }
    
  }

  getTransformedCoordinates(mouseX: number, mouseY: number) {
    const planeElement = this.plane?.nativeElement
    const rect = planeElement.getBoundingClientRect();

    const matrix:any = window.getComputedStyle(planeElement).transform;

    if (matrix === 'none') {
      return { x: mouseX - rect.left, y: mouseY - rect.top };
    }
    
    const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ').map(Number);

    // ????????????????????

    // const [a, b, c, d, e, f] = matrixValues
    
    // // Calculate the inverse transformation
    // const determinant = a * d - b * c;
    // const invA = d / determinant;
    // const invB = -b / determinant;
    // const invC = -c / determinant;
    // const invD = a / determinant;
    // const invE = (c * f - e * d) / determinant;
    // const invF = (b * e - a * f) / determinant;
  
    // const localX = invA * (mouseX - rect.left) + invC * (mouseY - rect.top) + invE;
    // const localY = invB * (mouseX - rect.left) + invD * (mouseY - rect.top) + invF;

    const [a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p] = matrixValues;

    // I HAVE NO CLUE HOW THIS WORKS BUT IT DOES
    const localX = (a * (mouseX - rect.left) + b * (mouseY - rect.top) + c * 0 + d) / (m * (mouseX - rect.left) + n * (mouseY - rect.top) + o * 0 + p);
    const localY = (e * (mouseX - rect.left) + f * (mouseY - rect.top) + g * 0 + h) / (m * (mouseX - rect.left) + n * (mouseY - rect.top) + o * 0 + p);
    
    const xOffset = 450
    const yOffset = -600
    return { x: localX + xOffset, y: localY + yOffset};
  }

}
