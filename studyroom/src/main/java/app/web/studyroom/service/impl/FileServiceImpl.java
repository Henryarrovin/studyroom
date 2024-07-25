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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileServiceImpl implements FileService {

    @Autowired
    private FileRepository fileRepository;

    @Override
    public List<String> uploadFiles(String directory, List<MultipartFile> multipartFiles) throws IOException {
        List<String> filenames = new ArrayList<>();
        for (MultipartFile file : multipartFiles) {
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String filename = originalFilename;
            int count = 1;

            while (fileRepository.findByDirectoryAndFilename(directory, filename).isPresent()) {
                filename = getUniqueFilename(originalFilename, count);
                count++;
            }

            File fileEntity = new File();
            fileEntity.setFilename(filename);
            fileEntity.setData(file.getBytes());
            fileEntity.setContentType(file.getContentType());
            fileEntity.setDirectory(directory);
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

    @Override
    public Map<String, Object> getAllFiles() {
        List<File> files = fileRepository.findAll();
        Map<String, Object> directoryMap = new HashMap<>();

        for (File file : files) {
            String[] pathParts = file.getDirectory().split("/");
            Map<String, Object> currentMap = directoryMap;

            for (String part : pathParts) {
                if (!part.isEmpty()) {
                    if (!currentMap.containsKey(part)) {
                        currentMap.put(part, new HashMap<String, Object>());
                    }
                    currentMap = (Map<String, Object>) currentMap.get(part);
                }
            }

            if (!currentMap.containsKey("files")) {
                currentMap.put("files", new ArrayList<File>());
            }
            ((List<File>) currentMap.get("files")).add(file);
        }
        return directoryMap;
    }

    @Override
    public File getFileByFilename(String filename) {
        return fileRepository.findByFilename(filename)
                .orElseThrow(() -> new RuntimeException(filename + " was not found on the server"));
    }

    @Override
    public void deleteFile(String filename) {
        File file = fileRepository.findByFilename(filename)
                .orElseThrow(() -> new RuntimeException(filename + " was not found on the server"));
        fileRepository.delete(file);
    }

    private String getUniqueFilename(String originalFilename, int count) {
        String extension = "";
        String baseName = originalFilename;

        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            baseName = originalFilename.substring(0, dotIndex);
            extension = originalFilename.substring(dotIndex);
        }

        return baseName + " (" + count + ")" + extension;
    }

}
