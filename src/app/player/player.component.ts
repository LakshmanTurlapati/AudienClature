import { Component, OnInit, Renderer2, ElementRef, ViewChild,EventEmitter,Output } from '@angular/core';
import { NgZone } from '@angular/core';
import { StyleManagerService } from '../services/style-manager.service';


@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    @ViewChild('seekBar', { static: false }) seekBar!: ElementRef<HTMLInputElement>;
    @ViewChild('coverArt') coverArt!: ElementRef;
    @Output() backgroundStyleChange = new EventEmitter<string>();


  showGlobe = false;
  currentIndex = 0;
  isPlaying = false;
  currentTime = 0; // Current time in seconds
  duration = 0; // Duration in seconds
  audio = new Audio();
  progress = 0; 
  backgroundStyle: string = 'linear-gradient(to right, #000000, #1a1a1a)'; // Default background
  playerStyle: string = 'rgba(0, 0, 0, 0.5)';
  
  toggleGlobeVisibility() {
    this.showGlobe = !this.showGlobe;
}
  songs: any[] = [
    {
      title: 'Sunflower',
      artist: 'Post Malone, Swae Lee',
      src: 'assets/media/audio/sunflower.mp3',
      cover: 'assets/media/cover/sunflower.jpeg'
    },
    {
        title: "I Ain't Worried",
        artist: 'OneRepublic',
        src: 'assets/media/audio/iaintworried.mp3', 
        cover: 'assets/media/cover/iaintworried.jpeg'
      },
      {
        title: "Am I Dreaming",
        artist: 'Metro Boomin',
        src: 'assets/media/audio/amidreaming.mp3', 
        cover: 'assets/media/cover/amidreaming.jpeg'
      },
      {
        title: "Wrapped around your finger",
        artist: 'Post Malone',
        src: 'assets/media/audio/wrappedaroundyourfinger.mp3', 
        cover: 'assets/media/cover/wrappedaroundyourfinger.jpeg'
      }
    // ... other songs
  ];

  constructor(private renderer: Renderer2, private zone: NgZone,private styleManager: StyleManagerService,
    ) {
    // Bind the context of `this` to the event handlers
    this.audio.addEventListener('timeupdate', this.updateTime.bind(this));
    this.audio.addEventListener('loadedmetadata', this.updateDuration.bind(this));
    this.audio.addEventListener('ended', this.onSongEnd.bind(this));
    
  }

  ngOnInit() {
    this.audio.src = this.songs[this.currentIndex].src;
    this.audio.load();
  }

  play() {
    this.isPlaying = true;
    this.audio.play();
  }

  playPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    // Check if the next song index is within the bounds of the songs array
    if (this.currentIndex < this.songs.length - 1) {
      this.currentIndex++; // Increment the index to go to the next song
    } else {
      this.currentIndex = 0; // Loop back to the first song
    }
    this.loadSong();
  }


  previous() {
    // Check if the previous song index is within the bounds of the songs array
    if (this.currentIndex > 0) {
      this.currentIndex--; // Decrement the index to go to the previous song
    } else {
      this.currentIndex = this.songs.length - 1; // Loop back to the last song
    }
    this.loadSong();
  }
  onSongEnd() {
    this.next(); 
  }
  loadSong() {
    this.audio.pause();
    this.audio.currentTime = 0;
  
    const selectedSong = this.songs[this.currentIndex];
    this.audio.src = selectedSong.src;
    
   
    this.audio.load();
    this.isPlaying = true;
    this.audio.play();
  
    this.currentTime = 0;
    this.updateDuration();
  }
  
  updateDuration() {
    this.zone.run(() => {
      this.duration = this.audio.duration;
      this.updateProgress(); // Update progress bar whenever duration changes
    });
  }
  
  ngOnDestroy() {
    this.audio.pause();
    this.audio.removeEventListener('timeupdate', this.updateTime.bind(this));
    this.audio.removeEventListener('loadedmetadata', this.updateDuration.bind(this));
    this.audio.removeEventListener('ended', this.onSongEnd.bind(this));
  }
  

  pause() {
    this.isPlaying = false;
    this.audio.pause();
  }

  updateTime() {
    this.zone.run(() => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });
  }

  updateBackground(color: string) {
    this.backgroundStyle = `linear-gradient(to right, ${color}, #1a1a1a)`;
    this.backgroundStyleChange.emit(this.backgroundStyle); 
    this.styleManager.setBackgroundStyle(this.backgroundStyle);


  }

  onCoverArtLoad() {
    if (this.coverArt && this.coverArt.nativeElement.complete) {
      // Once the cover art has loaded, call the getDominantColor function
      this.getDominantColor(this.coverArt.nativeElement);
      
    }
  }

    updatePlayerBackground(color: string) {
        // Create a darker shade of the dominant color
        
      }

  

  getDominantColor(imgElement: HTMLImageElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Exit if canvas context is not available

    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0);

    // Get the pixel data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    // Calculate the average color
    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    // Update the background with the new color
    this.zone.run(() => {
      this.updateBackground(`rgb(${r},${g},${b})`);
    });
  }


  

  seekTo(event: any) {
    const seekTime = event.target.value;
    this.audio.currentTime = seekTime;
    this.currentTime = seekTime;
  }

 updateProgress() {
  this.progress = (this.currentTime / this.duration) * 100;
  if (this.seekBar && this.seekBar.nativeElement) {
    this.renderer.setStyle(this.seekBar.nativeElement, 'background', `linear-gradient(to right, #1DB954 0%, #1DB954 ${this.progress}%, #444 ${this.progress}%, #444 100%)`);
  }
}
formatTime(timeInSeconds: number): string {
    const minutes: string = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds: string = Math.floor(timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
  
  
}
