package com.zel.musicplayer.controller;

import com.zel.musicplayer.entity.Playlist;
import com.zel.musicplayer.entity.Song;
import com.zel.musicplayer.repo.PlaylistRepository;
import com.zel.musicplayer.repo.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class PlaylistController {
    @Autowired
    private PlaylistRepository playlistRepository;

    @Autowired
    private SongRepository songRepository;

    @GetMapping("/playlists")
    public List<Playlist> getAllPlaylists() {
        return playlistRepository.findAll();
    }

    @GetMapping("/playlists/{id}")
    public Playlist getPlaylistById(@PathVariable int id) {
        return playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
    }

    @PostMapping("/playlists/create")
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    @PutMapping("/playlists/{id}")
    public Playlist updatePlaylist(@PathVariable int id, @RequestBody Playlist newPlaylist) {
        return playlistRepository.findById(id).map(playlist -> {
            playlist.setTitle(newPlaylist.getTitle());
            playlist.setDescription(newPlaylist.getDescription());
            playlist.setTracks(newPlaylist.getTracks());
            return playlistRepository.save(playlist);
        }).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
    }

    @DeleteMapping("/playlists/{id}")
    public void deletePlaylist(@PathVariable int id) {
        playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
        playlistRepository.deleteById(id);
    }

    @PostMapping("/playlists/{id}/addSong/{songId}")
    public ResponseEntity<Object> addSongToPlaylist(@PathVariable Integer id, @PathVariable Integer songId) {
        Playlist playlist = playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
        Song song = songRepository.findById(songId).orElseThrow(() -> new IllegalArgumentException("Song with id " + songId + " not found"));

        playlist.getTracks().add(song);
        playlistRepository.save(playlist);

        return ResponseEntity.ok().body("Added song to playlist");

    }

    @DeleteMapping("/playlists/{id}/deleteSong/{songId}")
    public ResponseEntity<Object> deleteSongFromPlaylist(@PathVariable Integer id, @PathVariable Integer songId) {

        Playlist playlist = playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
        Song song = songRepository.findById(songId).orElseThrow(() -> new IllegalArgumentException("Song with id " + songId + " not found"));

        playlist.getTracks().remove(song);

        playlistRepository.save(playlist);
        return ResponseEntity.ok().body("Song deleted from playlist");

    }


}
