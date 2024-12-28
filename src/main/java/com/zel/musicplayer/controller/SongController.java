package com.zel.musicplayer.controller;

import com.zel.musicplayer.entity.Song;
import com.zel.musicplayer.entity.User;
import com.zel.musicplayer.repo.PlaylistRepository;
import com.zel.musicplayer.repo.SongRepository;
import com.zel.musicplayer.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class SongController {
    @Autowired
    private SongRepository songRepository;
    @Autowired
    private PlaylistRepository playlistRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/songs")
    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    @GetMapping("/{playlistId}/songs")
    public List<Song> getSongsByPlaylist(@PathVariable Integer playlistId) {
        return playlistRepository.findById(playlistId).orElseThrow(() -> new IllegalArgumentException("Playlist not found")).getTracks();
    }

    @PostMapping("/songs/add")
    public ResponseEntity<Object> addSong(@RequestBody Song song) {
        if (songRepository.findAll()
                .stream()
                .anyMatch(s -> s.getYtId().equals(song.getYtId())))
            return new ResponseEntity<>("Song already added", HttpStatus.CONFLICT);
        return ResponseEntity.ok(songRepository.save(song));
    }

    @PostMapping("/songs/{id}/fav/{userId}/add")
    public ResponseEntity<Object> favSong(@PathVariable Integer id, @PathVariable Integer userId) {
         songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Song not found or registered")).getUserIds().add(userId);
        return ResponseEntity.ok("Song added to favorites.");
    }
    @GetMapping("/songs/{userid}/favorites")
    public List<Song> getFavoriteSongs(@PathVariable Integer userid) {
        return songRepository.findAll().stream().filter(song -> song.getUserIds().contains(userid)).collect(Collectors.toList());
    }

    @PutMapping("/songs/{id}")
    public Song updateSong(@PathVariable Integer id, @RequestBody Song newSong) {
        return songRepository.findById(id).map(song -> {
            song.setTitle(newSong.getTitle());
            song.setArtist(newSong.getArtist());
            song.setThumbnailUrl(newSong.getThumbnailUrl());
            return songRepository.save(song);
        }).orElseThrow(() -> new IllegalArgumentException("Song not found"));
    }

    @DeleteMapping("/songs/{id}")
    public void deleteSong(@PathVariable Integer id) {
        songRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Song not found"));
        songRepository.deleteById(id);
    }


}
