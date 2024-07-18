package app.web.studyroom.service;

import app.web.studyroom.model.File;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface FileService {

    List<String> uploadFiles(List<MultipartFile> multipartFiles) throws IOException;
    File downloadFiles(String filename);

}
