package com.zel.musicplayer.controller;

import com.zel.musicplayer.entity.User;
import com.zel.musicplayer.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/users/{id}")
    public User getUserById(@PathVariable int id) {
        return userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
    }

    @PostMapping("/users/create")
    public User createUser(@RequestBody User user) {
        return userRepository.save(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable int id, @RequestBody User newUser) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(newUser.getEmail());
            user.setPassword(newUser.getPassword());
            user.setPlaylists(newUser.getPlaylists());
            user.setCountry(newUser.getCountry());
            return userRepository.save(user);
        }).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable int id) {
        userRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("User with id " + id + " not found"));
        userRepository.deleteById(id);
    }

    @PostMapping("/users/login")
    public ResponseEntity<Object> loginUser(@RequestBody HashMap<String, Object> body) {
        String email = (String) body.get("email");
        String password = (String) body.get("password");

        for (User user : userRepository.findAll()) {
            if (user.getEmail().equals(email) && user.getPassword().equals(password)) {
                return ResponseEntity.ok(user);
            }
        }

        return ResponseEntity.badRequest().body("Wrong email or password");
    }

    @PostMapping("/user/test")
    public ResponseEntity<Object> test(@RequestBody HashMap<String, Object> body) {
        for (Map.Entry<String, Object> entry : body.entrySet()) {
            if (entry.getKey().equals("claves")) {
                List<Integer> claves = (List<Integer>) entry.getValue();
                for (Integer clave : claves) {
                    System.out.println(clave);
                }
                break; // Exit the loop after finding the desired key
            }
        }
        return ResponseEntity.ok().build();
    }
}
