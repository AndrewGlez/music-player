package com.zel.musicplayer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.io.Serial;
import java.io.Serializable;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "song")
public class Song implements Serializable {
    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ytId", length = Integer.MAX_VALUE)
    private String ytId;

    @ManyToMany(mappedBy = "tracks")
    @JsonIgnoreProperties("tracks")
    private Set<Playlist> playlistIds;

    @Column(name = "title", length = Integer.MAX_VALUE)
    private String title;

    @Column(name = "artist", length = Integer.MAX_VALUE)
    private String artist;

    @Column(name = "url" , length = Integer.MAX_VALUE)
    private String url;

    @Column(name = "thumbnailUrl", length = Integer.MAX_VALUE)
    private String thumbnailUrl;

}