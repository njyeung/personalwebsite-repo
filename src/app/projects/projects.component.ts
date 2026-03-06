import { Component, ElementRef, Inject, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  private isBrowser: boolean;

  updateDeskSrc() {
    if (!this.isBrowser) return;
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

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.updateDeskSrc();
    if (this.isBrowser) {
      window.addEventListener('resize', this.resizeListener);
    }

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
    if (this.isBrowser) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

  animationFrameId: number | null = null;

  ngAfterViewInit() {
    if (!this.isBrowser) return;

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
    "Card 7": {
      "id": 7,
      "name": "Oriyon",
      "url": "https://oriyon.tech",
      "thumbnail": "assets/card-thumbnails/oriyon.png",
      "date": "April 2025",
      "h1": "Text to CAD",
      "p1": "AI chatbot powered by a random forest regression model that predicts aerodynamic performance with an MAE of 0.06. Reduced parametric CAD model generation time by >93% by using CadQuery to automate geometry creation and STL meshing, facilitating instant part downloads",
      "h2": "Links",
      "p2": "Website (try now!): <a href='https://oriyon.tech'>https://oriyon.tech</a>",
      "bg": "assets/card-textures/metal-texture.png",
      "frameworks": ["Python", "Typescript", "FastAPI", "AWS", "Docker", "Redis"]
    },
    "Card 6": {
      "id": 6,
      "name": "Map Reduce",
      "url": "assets/card-assets/map-reduce.png",
      "thumbnail": "assets/card-thumbnails/map-reduce.png",
      "date" : "December 2024",
      "h1": "Large Scale Data Processing",
      "p1": "Reimplementation of MapReduce based on the <a href='https://static.googleusercontent.com/media/research.google.com/en//archive/mapreduce-osdi04.pdf'>google research paper</a>. Distributed system with a Boss (Go), and worker nodes (Python). Features a web dashboard for submitting jobs and viewing utilization/progress. Demos include counting large (10GB) csv files and a 2-job \"chained\" ridge regression.",
      "h2": "Links",
      "p2": "Github repo: <a href='https://github.com/parallax9999/MapReduce'>https://github.com/parallax9999/MapReduce</a>",
      "bg" : "assets/card-textures/yellow-texture.png",
      "frameworks": ["Docker", "Go", "Python", "Typescript"]
    },
    "Card 5": {
      "id": 5,
      "name": "Piazza Bot",
      "url": "https://cdn.jsdelivr.net/gh/njyeung/piazza-bot@main/Piazza%20Bot.pdf",
      "thumbnail": "assets/card-thumbnails/piazza-bot.png",
      "date": "December 2025",
      "h1": "Answering Piazza Posts",
      "p1": "Distributed system with Kaltury Gallery scrapers, local models (embedding & llm), and RAG pipeline. Answers Piazza posts with citations and timestamps directly from lecture transcripts. Supports user defined parsers for each class.",
      "h2": "Links",
      "p2": "Github repo: <a href='https://github.com/njyeung/piazza-bot'>https://github.com/njyeung/piazza-bot</a> | Writeup: <a href='https://github.com/njyeung/piazza-bot/blob/main/Piazza%20Bot.pdf'>Piazza_Bot.pdf</a>",
      "bg": "assets/card-textures/blue-texture.png",
      "frameworks": ["Cassandra", "Redis", "Kafka", "Docker", "RAG", "Go", "Python"]
    },
    "Card 4": {
      "id": 4,
      "name": "3Docs",
      "url": "assets/card-assets/3docs.mp4",
      "thumbnail": "assets/card-thumbnails/3docs.jpg",
      "date": "November 2025",
      "h1": "Generate Interactive 3D Repair Guides",
      "p1": "3Docs is a platform that transforms boring old PDF manuals into interactive 3D manuals complete with voice guidance and PDF references for each step of a process.",
      "h2": "1st Place @ Madhacks 2025!",
      "p2": "Devpost: <a href='https://devpost.com/software/3docs'>https://devpost.com/software/3docs</a> | Github repo: <a href='https://github.com/r-thak/3Docs-MadHacks2025-Winner'>https://github.com/r-thak/3Docs-MadHacks2025-Winner</a>",
      "bg": "assets/card-textures/white-texture.png",
      "frameworks": ["Next.js", "Python", "Fish Audio", "Gemini", "GCR", "Sqlite", "Tripo AI"]
    },
    "Card 3": {
      "id": 3,
      "name": "Perp",
      "url": "assets/card-assets/perp.mp4",
      "thumbnail": "assets/card-thumbnails/perp.png",
      "date" : "November 2025",
      "h1": "Never Miss A Meeting",
      "p1": "Perp is a meeting bot that everyone can chat with during a meeting to stay on the same page the entire time. To fully integrated into workflows, it simply works with existing tools like Notion, Slack, Zoom, Google Meets, and Microsoft Outlook.",
      "h2": "Y Combinator Agent Jam 25 Winner!",
      "p2": "Hackathon submission: <a href='https://drive.google.com/file/d/1ODcaGTL4Pwpajh7hrChk8HOtIbSu_5qO/view?usp=drive_link'>Video Demo</a>",
      "bg" : "assets/card-textures/purple-texture.png",
      "frameworks": ["Typescript", "Slack", "Zoom", "Notion"]
    },
    "Card 2": {
      "id": 2,
      "name": "HoppyShare",
      "url": "https://www.hoppyshare.com/",
      "thumbnail": "assets/card-thumbnails/hoppyshare.png",
      "date": "July 2025",
      "h1": "One Clipboard, All Your Devices.",
      "p1": "Syncs your clipboard across ALL your devices, whether you're connected to the internet or not. Windows, MacOS, Linux, and Android supported. Powered by MQTT and BLE, with a cute mascot that sits in your systray.",
      "h2": "Links",
      "p2": "Website (try now!): <a href='https://www.hoppyshare.com/'>https://www.hoppyshare.com/</a> | Github repo: <a href='https://github.com/njyeung/hoppyshare'>https://github.com/njyeung/hoppyshare</a>",
      "bg": "assets/card-textures/orange-texture.png",
      "frameworks": ["MQTT", "Next.js", "Docker", "Go", "Supabase", "Python", "AWS", "Kotlin"]
    },
    "Card 1": {
      "id": 1,
      "name": "Reels",
      "url": "assets/card-assets/reels.mp4",
      "thumbnail": "assets/card-thumbnails/reels.jpg",
      "date": "March 2026",
      "h1": "Instagram Reels in the Terminal",
      "p1": "TUI app to watch, like, and browse comments on Instagram Reels directly from the command line. Uses Kitty graphics protocol for inline video. Available on npm, Homebrew, and AUR.",
      "h2": "Links",
      "p2": "Github repo: <a href='https://github.com/njyeung/reels'>https://github.com/njyeung/reels</a>",
      "bg": "assets/card-textures/pink-texture.png",
      "frameworks": ["Go", "FFmpeg", "Kitty Graphics", "npm", "Homebrew"]
    }
  }
}
