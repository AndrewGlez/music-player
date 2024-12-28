package com.zel.musicplayer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "song")
@NoArgsConstructor
@Getter
@Setter
public class Song implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String ytId;
    private Integer playlistId;
    @Transient
    private List<Integer> userIds = new ArrayList<>();
    private String title;
    private String artist;
    private String url;
    private String thumbnailUrl;

}
