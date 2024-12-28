package com.zel.musicplayer.repo;

import com.zel.musicplayer.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaylistRepository extends JpaRepository<Playlist, Integer> {
}
