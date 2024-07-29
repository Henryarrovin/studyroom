package app.web.studyroom.service;

import app.web.studyroom.model.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FileService {

    List<String> uploadFiles(String directory, List<MultipartFile> multipartFiles) throws IOException;
    File downloadFiles(String directory, String filename);
    Map<String, Object> getAllFiles();
    File getFileByFilename(String filename);
    void deleteFile(String directory, String filename);

}
