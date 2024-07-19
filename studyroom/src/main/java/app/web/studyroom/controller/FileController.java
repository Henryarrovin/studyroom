package app.web.studyroom.controller;

import app.web.studyroom.model.File;
import app.web.studyroom.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/file")
@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<String>> uploadFiles(@RequestParam("files") List<MultipartFile> multipartFiles) throws IOException {
        List<String> filenames = fileService.uploadFiles(multipartFiles);
        return new ResponseEntity<>(filenames, HttpStatus.OK);
    }

    @GetMapping("/download/{filename}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<byte[]> downloadFiles(@PathVariable("filename") String filename) throws IOException {
        File file = fileService.downloadFiles(filename);

        String userHome = System.getProperty("user.home");
        String downloadsPath = userHome + "/Downloads/";

        Path targetPath = Paths.get(downloadsPath + filename);
        Files.write(targetPath, file.getData());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .headers(httpHeaders)
                .body(file.getData());
    }

}
