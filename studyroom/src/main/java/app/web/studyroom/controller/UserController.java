package app.web.studyroom.controller;

import app.web.studyroom.dto.AuthResponseDto;
import app.web.studyroom.dto.LoginDto;
import app.web.studyroom.dto.UserDto;
import app.web.studyroom.mapper.Mapper;
import app.web.studyroom.model.User;
import app.web.studyroom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private Mapper<User, UserDto> userMapper;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> loginUser(@RequestBody LoginDto loginDto) {
        if (loginDto.getUsername() == null || loginDto.getPassword() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        AuthResponseDto token = userService.login(loginDto.getUsername(), loginDto.getPassword());

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {

        if (userDto.getFirstName() == null ||
                userDto.getLastName() == null ||
                userDto.getUsername() == null ||
                userDto.getPassword() == null) {
            return new ResponseEntity<>("All required fields must be provided", HttpStatus.BAD_REQUEST);
        }
        if (userService.existsByUsername(userDto.getUsername())) {
            return new ResponseEntity<>("Username already exists",HttpStatus.CONFLICT);
        }
        User user = userMapper.mapFrom(userDto);
        User createdUser = userService.createUser(user, userDto.getRoles());
        return new ResponseEntity<>(userMapper.mapTo(createdUser), HttpStatus.CREATED);
    }

    @PutMapping("/update-user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, @RequestBody UserDto userDto) {

        if (!userService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        User user = userMapper.mapFrom(userDto);
        User updatedUser = userService.updateUser(id, user);
        return new ResponseEntity<>(userMapper.mapTo(updatedUser), HttpStatus.OK);
    }

    @GetMapping("/get-all-user")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STUDENT')")
    public ResponseEntity<Iterable<UserDto>> getAllUsers() {
        Iterable<User> users = userService.getAllUser();
        List<UserDto> userDto = new ArrayList<>();
        for (User user : users) {
            userDto.add(userMapper.mapTo(user));
        }
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping("/get-user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {

        User user = userService.getUserById(id);

        if (!userService.isExists(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(userMapper.mapTo(user), HttpStatus.OK);
    }

    @DeleteMapping("/delete-user/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/get-user-by-username/{username}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<UserDto> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return new ResponseEntity<>(userMapper.mapTo(user), HttpStatus.OK);
    }

}
