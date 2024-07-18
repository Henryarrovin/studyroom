package app.web.studyroom.service.impl;

import app.web.studyroom.dto.AuthResponseDto;
import app.web.studyroom.model.Role;
import app.web.studyroom.model.User;
import app.web.studyroom.repository.RoleRepository;
import app.web.studyroom.repository.UserRepository;
import app.web.studyroom.security.JwtTokenProvider;
import app.web.studyroom.service.UserService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private JwtTokenProvider jwtTokenProvider;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                           JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createUser(User user, List<String> roleNames) {


        user.setFirstName(user.getFirstName());
        user.setLastName(user.getLastName());
        user.setEmail(user.getEmail());
        user.setDateOfBirth(user.getDateOfBirth());
        user.setUsername(user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if(roleNames == null) {
            throw new RuntimeException("Role names must be provided");
        } else {
            List<Role> roles = roleNames.stream()
                    .map(roleName -> roleRepository.findByName(roleName).orElseThrow(() -> {
                        throw new RuntimeException("Role not found: " + roleName);
                    }))
                    .collect(Collectors.toList());
            user.setRoles(roles);
        }
        return userRepository.save(user);
    }

    @Override
    public AuthResponseDto login(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);
        return new AuthResponseDto(token);
    }

    @Override
    public User updateUser(Long id, User user) {
        user.setId(id);
        return userRepository.findById(id)
                .map(existingUser -> {
                    Optional.ofNullable(user.getFirstName()).ifPresent(existingUser::setFirstName);
                    Optional.ofNullable(user.getLastName()).ifPresent(existingUser::setLastName);
                    Optional.ofNullable(user.getEmail()).ifPresent(existingUser::setEmail);
                    Optional.ofNullable(user.getDateOfBirth()).ifPresent(existingUser::setDateOfBirth);
                    Optional.ofNullable(user.getUsername()).ifPresent(existingUser::setUsername);
                    Optional.ofNullable(user.getPassword()).ifPresent(password -> existingUser.setPassword(passwordEncoder.encode(password)));

                    Optional.ofNullable(user.getRoles()).ifPresentOrElse(
                            roles -> {
                                if (!roles.isEmpty()) {
                                    List<Role> updatedRoles = roles.stream()
                                            .map(role -> roleRepository.findByName(role.getName()).orElseThrow(() -> {
                                                throw new RuntimeException("Role not found: " + role.getName());
                                            }))
                                            .collect(Collectors.toList());
                                    existingUser.setRoles(updatedRoles);
                                }
                            },
                            () -> existingUser.setRoles(Collections.emptyList())
                    );

                    return userRepository.save(existingUser);
                }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public List<User> getAllUser() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public boolean isExists(Long id) {
        return userRepository.existsById(id);
    }

}
