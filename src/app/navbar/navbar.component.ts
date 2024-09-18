import { Component } from '@angular/core';
declare var anime: any;

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  ngAfterViewInit() {

    // wrap everything in spans
    const textWrapper1 = document.querySelector('.an-1');
    textWrapper1!.innerHTML = textWrapper1!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");
    const textWrapper2 = document.querySelector('.an-2');
    textWrapper2!.innerHTML = textWrapper2!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");
    const textWrapper3 = document.querySelector('.an-3');
    textWrapper3!.innerHTML = textWrapper3!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");
    const textWrapper4 = document.querySelector('.an-4');
    textWrapper4!.innerHTML = textWrapper4!.textContent!.replace(/\S/g, "<span class='letter'>$&</span>");

    anime.timeline({loop: false})
    .add({
      duration: 500
    })
    .add({
      targets: '.an-1 .letter',
      scale: [4,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 500,
      delay: (el:any , i:number) => 60*i
    }).add({
      targets: '.an-2 .letter',
      scale: [4,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 500,
      delay: (el:any , i:number) => 60*i
    }).add({
      targets: '.an-3 .letter',
      scale: [4,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 500,
      delay: (el:any , i:number) => 60*i
    }).add({
      targets: '.an-4 .letter',
      scale: [4,1],
      opacity: [0,1],
      translateZ: 0,
      easing: "easeOutExpo",
      duration: 500,
      delay: (el:any , i:number) => 60*i
    }).add({
      // for some reason you need this or the last one doesn't work
    });
  }
}
