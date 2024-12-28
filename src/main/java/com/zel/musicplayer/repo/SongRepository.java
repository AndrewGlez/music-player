package com.zel.musicplayer.repo;

import com.zel.musicplayer.entity.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Integer> {
}
