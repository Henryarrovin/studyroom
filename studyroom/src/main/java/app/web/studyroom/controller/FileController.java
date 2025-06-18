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

//    @GetMapping("/view")
//    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
//    public ResponseEntity<byte[]> viewFile(
//            @RequestParam("directory") String directory,
//            @RequestParam("filename") String filename
//    ) throws IOException {
//        File file = fileService.downloadFiles(directory, filename);
//
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.parseMediaType(file.getContentType()));
//        headers.setContentDispositionFormData("inline", filename);
//
//        return new ResponseEntity<>(file.getData(), headers, HttpStatus.OK);

    @GetMapping("/view")
    @PreAuthorize("hasAnyAuthority('ADMIN','STUDENT')")
    public ResponseEntity<byte[]> viewFile(
            @RequestParam("directory") String directory,
            @RequestParam("filename") String filename
    ) throws IOException {
        File file = fileService.downloadFiles(directory, filename);

        if (file == null || file.getData() == null) {
            return ResponseEntity.notFound().build();
        }

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = getMimeTypeFromExtension(filename);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(contentType));
        headers.set("Content-Length", String.valueOf(file.getData().length));
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"");

        return new ResponseEntity<>(file.getData(), headers, HttpStatus.OK);
    }

//    private String getMimeTypeFromExtension(String filename) {
//        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
//        return switch (ext) {
//            case "pdf" -> "application/pdf";
//            case "html", "htm" -> "text/html";
//            case "css" -> "text/css";
//            case "js" -> "application/javascript";
//            case "json" -> "application/json";
//            case "java", "txt", "md", "xml" -> "text/plain";
//            case "jpg", "jpeg" -> "image/jpeg";
//            case "png" -> "image/png";
//            case "gif" -> "image/gif";
//            default -> "application/octet-stream";
//        };
//    }

    private String getMimeTypeFromExtension(String filename) {
        String ext = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (ext) {
            case "pdf" -> "application/pdf";
            case "html", "htm" -> "text/html";
            case "css" -> "text/css";
            case "js" -> "application/javascript";
            case "json" -> "application/json";
            case "java", "c", "cpp", "h", "hpp", "cs" -> "text/plain";
            case "txt", "md", "xml", "log", "ini", "cfg" -> "text/plain";
            case "jpg", "jpeg" -> "image/jpeg";
            case "png" -> "image/png";
            case "gif" -> "image/gif";
            case "svg" -> "image/svg+xml";
            case "doc" -> "application/msword";
            case "docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls" -> "application/vnd.ms-excel";
            case "xlsx" -> "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt" -> "application/vnd.ms-powerpoint";
            case "pptx" -> "application/vnd.openxmlformats-officedocument.presentationml.presentation";
            case "zip" -> "application/zip";
            case "rar" -> "application/x-rar-compressed";
            case "tar" -> "application/x-tar";
            case "gz" -> "application/gzip";
            default -> "application/octet-stream";
        };
    }

}
