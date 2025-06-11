package app.web.studyroom.security;

import app.web.studyroom.model.Role;
import app.web.studyroom.model.User;
import app.web.studyroom.repository.RoleRepository;
import app.web.studyroom.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenProvider {

    private final UserRepository userRepository;
    private final SecretKey key;

    public JwtTokenProvider(RoleRepository roleRepository, UserRepository userRepository, SecretKey key) {
        this.userRepository = userRepository;
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SecurityConstants.JWT_SECRET));
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        List<Role> roles = user.getRoles();

        Role role = roles.isEmpty() ? null : roles.getFirst();
        if (role == null) {
            throw new IllegalStateException("User role not found");
        }
        Date currentDate = new Date();
        Date expiryDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role.getName())
                .setIssuedAt(currentDate)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }


    public String getUsernameFromToken(String token) {
//        Claims claims = Jwts.parser()
//                .setSigningKey(SecurityConstants.JWT_SECRET)
//                .parseClaimsJws(token)
//                .getBody();
//        return claims.getSubject();
        return parseClaims(token).getSubject();
    }

    public String getRoleFromToken(String token) {
//        Claims claims = Jwts.parser()
//                .setSigningKey(SecurityConstants.JWT_SECRET)
//                .parseClaimsJws(token)
//                .getBody();
//        return claims.get("role", String.class);
        return parseClaims(token).get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
//            Jwts.parser().setSigningKey(SecurityConstants.JWT_SECRET).parseClaimsJws(token);
            parseClaims(token);
            return true;
        } catch (Exception e) {
            System.out.println("---------------------------------------ERROR---------------------------------------");
            System.out.println(e.getMessage());
            System.out.println("---------------------------------------END_ERROR---------------------------------------");
            throw new AuthenticationCredentialsNotFoundException("Jwt was expired or invalid");
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
