import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  // Add any other expected properties if needed
}
interface SpotifyPlaylistTrack {
  track: {
      name: string;
      album: {
          images: { url: string }[];
      };
      uri: string;
  };
}

interface SpotifyPlaylistResponse {
  items: SpotifyPlaylistTrack[];
}
interface SpotifyError {
  message: string;
}
interface SpotifyDeviceEvent {
  device_id: string;
}
interface SpotifyPlayerState {
  context: {
      uri: string;
      metadata: any;
  };
  disallows: {
      pausing: boolean;
      skipping_prev: boolean;
  };
  duration: number;
  paused: boolean;
  position: number;
  repeat_mode: number;
  shuffle: boolean;
  track_window: {
      current_track: {
          album: {
              uri: string;
              name: string;
              images: [{ url: string }];
              // ... more album properties if needed
          };
          artists: [
              {
                  uri: string;
                  name: string;
              }
          ];
          duration_ms: number;
          uri: string;
          name: string;
          // ... more track properties if needed
      };
      next_tracks: Array<any>; // Similarly structured to current_track
      previous_tracks: Array<any>; // Similarly structured to current_track
  };
}




@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
    currentIndex = 0;
    isPlaying = false;
    progress = 0;
    songs: any[] = [];
    deviceId!: string;


    // Spotify configurations
    clientId = 'REMOVED_SPOTIFY_CLIENT_ID';
    clientSecret = 'REMOVED_SPOTIFY_CLIENT_SECRET';
    token: string = '';
    player: any;

    constructor(private http: HttpClient) {}

    ngOnInit() {
        this.authenticateAndSetupPlayer();
    }

    authenticateAndSetupPlayer() {
      // Fetch the access token
      this.http.post<SpotifyAuthResponse>('https://accounts.spotify.com/api/token', 
          'grant_type=client_credentials',
          {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret)
              }
          }
      ).subscribe(data => {
          this.token = data.access_token;
          this.setupSpotifyPlayer();
          this.fetchPlaylistDetails();
      });
  }
  

  fetchPlaylistDetails() {
    const playlistId = '37i9dQZF1DXcrFZ8UTtxv9';
    this.http.get<SpotifyPlaylistResponse>(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': 'Bearer ' + this.token
        }
    }).subscribe(data => {
        this.songs = data.items.map(item => ({
            title: item.track.name,
            coverArt: item.track.album.images[0].url,
            uri: item.track.uri
        }));
    });
}


    setupSpotifyPlayer() {
        if (window['Spotify']) {
            this.initializePlayer();
        } else {
            setTimeout(() => this.setupSpotifyPlayer(), 1000);
        }
    }

    initializePlayer() {
      this.player = new window['Spotify'].Player({
          name: 'Your Angular Spotify Player',
          getOAuthToken: (cb: (token: string) => void) => { cb(this.token); }
      });
  
      // Error handling
      this.player.addListener('initialization_error', ({ message }: SpotifyError) => { console.error(message); });
      this.player.addListener('authentication_error', ({ message }: SpotifyError) => { console.error(message); });
      this.player.addListener('account_error', ({ message }: SpotifyError) => { console.error(message); });
      this.player.addListener('playback_error', ({ message }: SpotifyError) => { console.error(message); });
  
      // Playback status updates
      this.player.addListener('player_state_changed', (state: SpotifyPlayerState) => {
        console.log(state);
    });
    
  
      // Ready
      this.player.addListener('ready', ({ device_id }: SpotifyDeviceEvent) => {
        console.log('Ready with Device ID', device_id);
        this.deviceId = device_id;
    });
    
  
      // Not Ready
    this.player.addListener('not_ready', ({ device_id }: SpotifyDeviceEvent) => {
    console.log('Device ID has gone offline', device_id);
});

  
      // Connect to the player
      this.player.connect();
  }
  

    playPause() {
        if (this.isPlaying) {
            this.player.pause().then(() => {
                console.log('Paused Playback');
                this.isPlaying = false;
            });
        } else {
            this.player.resume().then(() => {
                console.log('Resumed Playback');
                this.isPlaying = true;
            });
        }
    }

    playTrack(uri: string) {
        this.http.put(`https://api.spotify.com/v1/me/player/play?device_id=${this.deviceId}`, 
        { uris: [uri] }, 
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        }).subscribe();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.songs.length;
        this.playTrack(this.songs[this.currentIndex].uri);
    }

    previous() {
        this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
        this.playTrack(this.songs[this.currentIndex].uri);
    }
}
