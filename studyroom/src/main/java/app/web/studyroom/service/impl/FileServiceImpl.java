package app.web.studyroom.service.impl;

import app.web.studyroom.model.File;
import app.web.studyroom.repository.FileRepository;
import app.web.studyroom.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    @Override
    public List<String> uploadFiles(List<MultipartFile> multipartFiles) throws IOException {
        List<String> filenames = new ArrayList<>();
        for (MultipartFile file : multipartFiles) {
            String filename = StringUtils.cleanPath(file.getOriginalFilename());
            File fileEntity = new File();
            fileEntity.setFilename(filename);
            fileEntity.setData(file.getBytes());
            fileEntity.setContentType(file.getContentType());
            fileRepository.save(fileEntity);
            filenames.add(filename);
        }
        return filenames;
    }

    @Override
    public File downloadFiles(String filename) {
        return fileRepository.findByFilename(filename)
                .orElseThrow(() -> new RuntimeException(filename + " was not found on the server"));
    }
}
