import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  FaFilePdf,
  FaFileWord,
  FaFileAlt,
  FaFileCode,
  FaFileImage,
  FaFileArchive,
  FaJava,
  FaJs,
  FaFile,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  directory: string;
  filename: string;
}

const getFileIcon = (filename: string): JSX.Element => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return <FaFilePdf className="inline text-red-500 mr-2" />;
    case 'doc':
    case 'docx': return <FaFileWord className="inline text-blue-500 mr-2" />;
    case 'txt':
    case 'md': return <FaFileAlt className="inline text-gray-400 mr-2" />;
    case 'js': return <FaJs className="inline text-yellow-400 mr-2" />;
    case 'ts':
    case 'tsx':
    case 'html':
    case 'css': return <FaFileCode className="inline text-purple-400 mr-2" />;
    case 'java': return <FaJava className="inline text-orange-500 mr-2" />;
    case 'json':
    case 'xml': return <FaFileCode className="inline text-teal-400 mr-2" />;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif': return <FaFileImage className="inline text-green-500 mr-2" />;
    case 'zip':
    case 'rar': return <FaFileArchive className="inline text-pink-500 mr-2" />;
    default: return <FaFile className="inline text-gray-500 mr-2" />;
  }
};

const FileViewerModal = ({ isOpen, onClose, directory, filename }: FileViewerModalProps) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const fileUrl = `http://localhost:8080/file/view?directory=${encodeURIComponent(directory)}&filename=${encodeURIComponent(filename)}`;

  useEffect(() => {
    if (!isOpen) return;

    const fetchFileContent = async () => {
      try {
        const res = await fetch(fileUrl);
        const contentType = res.headers.get("Content-Type");

        if (contentType && contentType.startsWith("text")) {
          const text = await res.text();
          setFileContent(text);
        } else if (contentType === "application/pdf") {
          setFileContent("pdf");
        } else {
          setFileContent("Unsupported");
        }
      } catch (err) {
        setFileContent("Error loading file.");
      }
    };

    fetchFileContent();
  }, [isOpen, fileUrl]);

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="relative bg-gray-900 text-white rounded-xl w-[90%] h-[90%] shadow-lg p-6 overflow-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-red-400"
          >
            <FiX size={24} />
          </button>

          {/* Header */}
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            {getFileIcon(filename)} {filename}
          </h3>

          {/* Content */}
          {fileContent === "pdf" ? (
            <iframe
              src={fileUrl}
              className="w-full h-[80%] rounded-lg border border-gray-700"
              title="PDF Viewer"
            />
          ) : fileContent === "Unsupported" ? (
            <p className="text-red-400">This file type is not supported for inline viewing.</p>
          ) : fileContent ? (
            <pre className="whitespace-pre-wrap text-sm bg-gray-800 p-4 rounded-lg border border-gray-700">
              {fileContent}
            </pre>
          ) : (
            <p className="text-gray-400">Loading...</p>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default FileViewerModal;
