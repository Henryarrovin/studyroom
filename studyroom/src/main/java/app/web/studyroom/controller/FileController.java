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
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/file")
//@CrossOrigin(origins = "http://localhost:5173")
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<List<String>> uploadFiles(
            @RequestParam("directory") String directory,
            @RequestParam("files") List<MultipartFile> multipartFiles) throws IOException {
        if (multipartFiles.isEmpty() || directory == null || directory.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        List<String> filenames = fileService.uploadFiles(directory ,multipartFiles);
        return new ResponseEntity<>(filenames, HttpStatus.OK);
    }

    @GetMapping("/download")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<byte[]> downloadFiles(
            @RequestParam("directory") String directory,
            @RequestParam("filename") String filename
    ) throws IOException {
        File file = fileService.downloadFiles(directory, filename);

//        String userHome = System.getProperty("user.home");
//        String downloadsPath = userHome + "/Downloads/";

//        Path targetPath = Paths.get(downloadsPath + filename);
//        Files.write(targetPath, file.getData());

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.getContentType()))
                .headers(httpHeaders)
                .body(file.getData());
    }

    @GetMapping("/all-files")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<Map<String, Object>> getAllFiles() {
        Map<String, Object> files = fileService.getAllFiles();
        return new ResponseEntity<>(files, HttpStatus.OK);
    }

    @GetMapping("/get-file/{filename}")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<File> getFileByFilename(@PathVariable("filename") String filename) {
        File file = fileService.getFileByFilename(filename);
        return new ResponseEntity<>(file, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public ResponseEntity<?> deleteFile(
            @RequestParam("directory") String directory,
            @RequestParam("filename") String filename
    ) {
        fileService.deleteFile(directory, filename);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
