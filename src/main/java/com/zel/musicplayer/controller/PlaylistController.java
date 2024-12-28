package com.zel.musicplayer.controller;

import com.zel.musicplayer.entity.Playlist;
import com.zel.musicplayer.entity.Song;
import com.zel.musicplayer.entity.User;
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

    @GetMapping("/playlists?q={id}")
    public Playlist getPlaylistById(@RequestParam int id) {
        return playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
    }

    @PostMapping("/playlists/create")
    public Playlist createPlaylist(@RequestBody Playlist playlist) {
        return playlistRepository.save(playlist);
    }

    @PutMapping("/playlists?q={id}")
    public Playlist updatePlaylist(@RequestParam int id, @RequestBody Playlist newPlaylist) {
        return playlistRepository.findById(id).map(playlist -> {
            playlist.setTitle(newPlaylist.getTitle());
            playlist.setDescription(newPlaylist.getDescription());
            playlist.setTracks(newPlaylist.getTracks());
            return playlistRepository.save(playlist);
        }).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
    }

    @DeleteMapping("/playlists?q={id}")
    public void deletePlaylist(@RequestParam int id) {
        playlistRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Playlist with id " + id + " not found"));
        playlistRepository.deleteById(id);
    }

    @PostMapping("/playlists/{playlistId}/addSong/{songId}")
    public ResponseEntity<String> addSongToPlaylist( @PathVariable Integer playlistId, @PathVariable Integer songId) {
        songRepository.findById(songId)
                .orElseThrow(() -> new IllegalArgumentException("Song with id " + songId + " not found"))
                .setPlaylistId(playlistId);
        return ResponseEntity.ok("Added song " +
                songRepository.findById(songId).get().getTitle()
                + " to playlist " + playlistRepository.findById(playlistId).get().getTitle());
    }
}