package app.web.studyroom.repository;

import app.web.studyroom.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<File> findByFilename(String filename);
    Optional<File> findByDirectoryAndFilename(String directory, String filename);
}
