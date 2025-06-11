package app.web.studyroom.config;

import app.web.studyroom.model.Role;
import app.web.studyroom.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RoleSeeder {

    @Bean
    public CommandLineRunner run(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                Role adminRole = Role.builder()
                        .name("ADMIN")
                        .build();
                Role studentRole = Role.builder()
                        .name("STUDENT")
                        .build();

                roleRepository.save(adminRole);
                roleRepository.save(studentRole);
                System.out.println("Roles added: ADMIN, STUDENT");
            } else {
                System.out.println("Roles already exist in the database.");
            }
        };
    }

}
