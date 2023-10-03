import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {
  currentIndex = 0;
  isPlaying = false;
  progress = 0; 
  
  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.progress = (this.audio.currentTime / this.audio.duration) * 100;
    });
  }

  songs = [
    { 
      title: 'Sunflower', 
      url: 'assets/media/audio/sunflower.mp3', 
      coverArt: 'assets/media/cover/sunflower.jpeg' 
    },
    //... other songs ...
  ];
  

  audio = new Audio();

  playPause() {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.src = this.songs[this.currentIndex].url;
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    this.audio.src = this.songs[this.currentIndex].url;
    if (this.isPlaying) this.audio.play();
  }

  previous() {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.audio.src = this.songs[this.currentIndex].url;
    if (this.isPlaying) this.audio.play();
  }
}
