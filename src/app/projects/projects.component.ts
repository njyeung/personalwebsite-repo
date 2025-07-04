import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CardComponent } from './card/card.component';
import { CardData } from './CardData';
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
  

  updateDeskSrc() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const aspectRatio = window.innerWidth / window.innerHeight;

    if (aspectRatio <= (9/16)) {
      this.deskSrc = 'assets/desk/desk-light-mobile.jpg';
    } else if (w < 1920) {
      this.deskSrc = 'assets/desk/desk-light-small.jpg';
    } else {
      this.deskSrc = 'assets/desk/desk-light.jpg';
    }
  }

  resizeListener = () => this.updateDeskSrc();

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
    this.updateDeskSrc();
    window.addEventListener('resize', this.resizeListener);

    var values = Object.values(this.hardcoded)

    values.forEach((value:any)=> {
      // tricks github pages into appending /personalwebsite/ onto the link
      var thismightwork = value.bg

      var card: CardData = {
        id: value.id,
        name: value.name,
        url: value.url,
        date: value.date,
        thumbnail: value.thumbnail,
        h1: value.h1,
        p1: value.p1,
        h2: value.h2,
        p2: value.p2,
        bg: thismightwork,
        frameworks: value.frameworks
      }
      this.data.push(card)
    })
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.resizeListener);
  }

  animationFrameId: number | null = null;

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
      let pointerDownTime = 0;
      
      let offsetX = 0;
      let offsetY = 0;

      let prev = card.getBoundingClientRect();

      card.addEventListener('pointerdown', (event: PointerEvent) => {
        event.preventDefault();
        this.hideiframe = true;

        pointerDownTime = Date.now();

        // z index shift so each card ends up on top
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

      document.addEventListener('pointermove', (event: PointerEvent) => {
        if (isDragging == true) {
          if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = requestAnimationFrame(() => {
            this.moveCard(card, event.clientX, event.clientY, offsetX, offsetY);
          });
        }
      }, {passive: false});

      document.addEventListener('pointerup', () => {
        if(isDragging == true) {

          const elapsed = Date.now() - pointerDownTime;

          if(card.getBoundingClientRect().x == prev.x && card.getBoundingClientRect().y == prev.y || elapsed < 100) {
            // This gets the title of the clicked card... sorry
            var title = card.firstChild.firstChild.firstChild.innerText

            this.cardComponents.forEach((component)=> {
              if(component.name == title) {
                card.firstChild.classList.add('lead-in')
                setTimeout(()=>{this.inspectcard = component}, 200);
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

    // I HAVE NO CLUE HOW THIS WORKS BUT IT KINDA DOES
    const localX = (a * (mouseX - rect.left) + b * (mouseY - rect.top) + c * 0 + d) / (m * (mouseX - rect.left) + n * (mouseY - rect.top) + o * 0 + p);
    const localY = (e * (mouseX - rect.left) + f * (mouseY - rect.top) + g * 0 + h) / (m * (mouseX - rect.left) + n * (mouseY - rect.top) + o * 0 + p);
    
    const xOffset = 450
    const yOffset = -600
    return { x: localX + xOffset, y: localY + yOffset};
  }

  hardcoded = {
    
    "Card 8" : {
        "id" : 8,
        "name" : "Music Player",
        "url" : "assets/card-assets/musicplayer.jpg",
        "thumbnail": "assets/card-assets/musicplayer.jpg",
        "date" : "January 2024",
        "h1" : "Simple .Wav File Player",
        "p1" : "Builds upon <b>Java</b>'s Clip class, providing <b>playlists</b>, <b>albums</b>, and a structured library for the user through a simple command line interface. Use youtube-dl to download audio files from youtube, or place your own wav files into the /music directory.",
        "h2" : "Repository",
        "p2" : "Github: <a href='http://github.com/njyeung/Music-Player'>http://github.com/njyeung/Music-Player</a>",
        "bg": "assets/card-textures/yellow-texture.png",
        "frameworks" : ["Java", "PowerShell", "FFMPEG"]
    },
    "Card 7": {
      "id": 7,
      "name": "3D Engine",
      "url": "assets/card-assets/3d-engine.mp4",
      "thumbnail": "assets/card-thumbnails/3d-engine.jpg",
      "date" : "December 2024",
      "h1": "Rasterization",
      "p1": "Reads obj and texture files, creates triangles, and projects them on the screen through a series of matrix transformations",
      "h2": "Links",
      "p2": "Github repo: <a href='https://github.com/njyeung/3d-engine.git'>https://github.com/njyeung/3d-engine.git</a> (Currently only works for MacOS)",
      "bg" : "assets/card-textures/green-texture.png",
      "frameworks": ["GLFW", "C++"]
    },
    "Card 6": {
        "id" : 6,
        "name" : "CS2 Nade Guide",
        "url" : "assets/card-assets/nadeguide-video.mp4",
        "thumbnail": "assets/card-thumbnails/nade-guide.jpg",
        "date" : "November 2024",
        "h1" : "A Tool For Creators",
        "p1" : "Frontend GUI for creating annotation maps in Counter Strike 2. Includes an editor that parses Valve's proprietary KV3 format into JSON, allows users to edit the annotations using a GUI, and converts back to a KV3 file to be loaded into the game.",
        "h2" : "Links",
        "p2" : "Github repo: <a href='https://github.com/njyeung/cs2-nade-guide'>https://github.com/njyeung/cs2-nade-guide</a> | Live website: <a href='https://njyeung.github.io/cs2-nade-guide/'>https://njyeung.github.io/cs2-nade-guide/</a>",
        "bg": "assets/card-textures/orange-texture.png",
        "frameworks" : ["React", "Github Pages", "React Bootstrap", "KV3"]
    },
    "Card 4": {
      "id": 4,
      "name": "PresentLy",
      "url": "assets/card-assets/presently.mp4",
      "thumbnail": "assets/card-thumbnails/presently.jpg",
      "date": "March 2025",
      "h1": "AI Personalized Gift Finder",
      "p1": "A gift recommendation platform that matches presents to a recipient’s interests. After selecting an occasion and filling out a short survey, the app curates gift ideas using a dataset of over 26,000 best-selling Amazon items.",
      "h2": "Links",
      "p2": "Devpost submission: <a href='https://devpost.com/software/presently'>https://devpost.com/software/presently</a> | Github repo: <a href='https://github.com/VishnuR121/presently'>https://github.com/VishnuR121/presently</a> | Live website: <a href='https://presently-eight.vercel.app'>https://presently-eight.vercel.app</a> (backend down)",
      "bg": "assets/card-textures/purple-texture.png",
      "frameworks": ["Next.js", "OpenAI API", "Tailwind", "Framer Motion", "Supabase", "AWS Lambda", "Vercel"]
    },
    "Card 3" : {
        "id" : 3,
        "name" : "Sakura Sushi & Grill",
        "url" : "https://eatsakura.com",
        "thumbnail": "assets/card-thumbnails/sakura.jpg",
        "date" : "May 2024",
        "h1" : "Online Menu",
        "p1" : "Responsive online menu designed to facilitate placing pickup orders and displaying relevant information for the family restaurant. <b>Angular</b> frontend hosted on <b>GitHub Pages</b> and <b>.NET</b> backend hosted on <b>Azure</b>.",
        "h2" : "Links",
        "p2" : "Github repo for frontend: <a href='https://github.com/njyeung/Sakura-Repo'>https://github.com/njyeung/Sakura-Repo</a> | Live website: <a href='https://eatsakura.com'>https://eatsakura.com</a>, (backend source undisclosed)",
        "bg": "assets/card-textures/pink-texture.png",
        "frameworks" : ["Angular", ".NET", "Github Pages", "Bootstrap", "Twilio", "SQLite", "Azure"]
    },
    "Card 2": {
      "id": 2,
      "name": "Buddy",
      "url": "assets/card-assets/buddy.mp4",
      "thumbnail": "assets/card-thumbnails/buddy.jpg",
      "date": "May 2025",
      "h1": "Personal AI Agent",
      "p1": "Connects a <b>Python backend</b> with a <b>React + Webview</b> frontend through a custom <b>C bridge</b> using pipes and threads. Supports <b>persistent chat history</b>, <b>Retrieval-Augmented Generation</b> across projects, <b>user profiles</b>, <b>sliding window summarization</b>, and a flexible <b>tool system</b> for autonomous agent behavior. Extensive writeup available in the README of the repo.",
      "h2": "Links",
      "p2": "Github repo: <a href='https://github.com/njyeung/Buddy'>https://github.com/njyeung/Buddy</a>",
      "bg": "assets/card-textures/blue-texture.png",
      "frameworks": ["Python", "C", "Webview", "React", "Tailwind", "SQLite", "GPT API", "OpenAI Tools"]
    },
    "Card 1": {
      "id": 1,
      "name": "Splitudio",
      "url": "assets/card-assets/splitudio.mp4",
      "thumbnail": "assets/splitudio.jpg",
      "date": "April 2025",
      "h1": "AI-Powered Music Processing",
      "p1": "Web app that separates user-uploaded audio into individual instrument stems using <b>Demucs</b> and transcribes them to <b>MIDI</b> with <b>Basic Pitch</b>. Features <b>GPU-accelerated</b> cloud processing and an interactive <b>NextJS</b> UI for waveform visualization, MIDI play-along, and track control.",
      "h2": "Links",
      "p2": "Website: <a href='https://splitudio-iota.vercel.app/'>https://splitudio-iota.vercel.app</a> (backend down) | Github repo: <a href='https://github.com/ach968/Splitudio'>https://github.com/ach968/Splitudio</a>",
      "bg": "assets/card-textures/white-texture.png",
      "frameworks": ["Next.js", "Shadcn", "Tailwind", "Firebase Functions & Firestore", "GCR ", "Python", "Stripe"]
    }
    
  }
}
