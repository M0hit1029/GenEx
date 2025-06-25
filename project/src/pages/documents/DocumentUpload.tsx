import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useProject } from '../../context/projectContext';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  Trash2,
  Link as LinkIcon,
  ExternalLink,
  Check,
  AlertCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from '../../components/ui/Toaster';
import axios from 'axios';

export type FileStatus = 'uploading' | 'processing' | 'complete' | 'error';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  progress: number;
  preview?: string;
  error?: string;
  source: File | string;
}

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [promptInput, setPromptInput] = useState(''); // New state for prompt
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [isLoadingProjectDetails, setIsLoadingProjectDetails] = useState(true);
  const [projectDetailsError, setProjectDetailsError] = useState<string | null>(null);
  const { projectName, projectId, userId, setProjectId, setUserId } = useProject();

  useEffect(() => {
    let isMounted = true;

    const getDetails = async () => {
      setIsLoadingProjectDetails(true);
      setProjectDetailsError(null);
      setUserId(null);
      setProjectId(null);

      try {
        const projectname = localStorage.getItem('projectname');
        const response = await axios.post('http://localhost:5000/auth/getDetails', {
          name: projectname,
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = response.data;
        if (isMounted) {
          setUserId(data.userId);
          localStorage.setItem('userid', data.userId);
          setProjectId(data.projectId);
          localStorage.setItem('projectid', data.projectId);
          setProjectDetailsError(null);
          console.log('Fetched User ID:', data.userId, 'Project ID:', data.projectId);
          setIsLoadingProjectDetails(false);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching project details:', error);
          let errorMessage = 'Failed to fetch project details.';
          if (axios.isAxiosError(error) && error.response) {
            errorMessage = error.response.data?.message || error.response.statusText || error.message;
          } else if (axios.isAxiosError(error) && error.request) {
            errorMessage = 'Network error while fetching project details.';
          } else {
            errorMessage = error.message;
          }
          setProjectDetailsError(errorMessage);
          setIsLoadingProjectDetails(false);
        }
      }
    };

    if (projectName) {
      getDetails();
    } else {
      setIsLoadingProjectDetails(false);
      setProjectDetailsError('Project name is not available.');
    }

    return () => {
      isMounted = false;
    };
  }, [projectName, setUserId, setProjectId]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substring(2),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading' as FileStatus,
      progress: 0,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      source: file,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    newFiles.forEach(file => {
      const uploadTimer = setInterval(() => {
        setFiles(prevFiles => {
          return prevFiles.map(f => {
            if (f.id === file.id) {
              const newProgress = f.progress + 10;
              if (newProgress >= 100) {
                clearInterval(uploadTimer);
                return { ...f, progress: 100, status: 'processing' };
              }
              return { ...f, progress: newProgress };
            }
            return f;
          });
        });
      }, 300);

      setTimeout(() => {
        setFiles(prevFiles => {
          return prevFiles.map(f => {
            if (f.id === file.id && f.status === 'processing') {
              const isError = Math.random() < 0.1;
              return {
                ...f,
                status: isError ? 'error' : 'complete',
                error: isError ? 'Simulated processing failure: Invalid format or corrupt data.' : undefined,
              };
            }
            return f;
          });
        });
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      }, 5000 + Math.random() * 2000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'message/rfc822': ['.eml'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv'],
    },
  });

  const addUrlDocument = () => {
    if (!urlInput.trim()) {
      toast({
        title: 'Input Empty',
        message: 'Please enter a URL.',
        type: 'info',
      });
      return;
    }

    const urlRegex = /^(http|https):\/\/[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:[0-9]{1,5})?([a-zA-Z0-9][-a-zA-Z0-9()@:%_\+.~#?&//=]*)?$/;
    if (!urlInput.match(urlRegex)) {
      toast({
        title: 'Invalid URL',
        message: 'Please enter a valid URL starting with http or https.',
        type: 'error',
      });
      return;
    }

    const newFile: UploadedFile = {
      id: Math.random().toString(36).substring(2),
      name: urlInput.split('/').pop() || 'External Document',
      size: 0,
      type: 'url',
      status: 'processing',
      progress: 100,
      source: urlInput,
    };

    setFiles(prev => [...prev, newFile]);
    setUrlInput('');

    setTimeout(() => {
      setFiles(prevFiles => {
        return prevFiles.map(f => {
          if (f.id === newFile.id && f.status === 'processing') {
            const isError = false;
            return {
              ...f,
              status: isError ? 'error' : 'complete',
              error: isError ? 'Simulated URL processing failure.' : undefined,
            };
          }
          return f;
        });
      });

      toast({
        title: isError ? 'URL Processing Error' : 'URL Added',
        message: isError ? 'Failed to process the provided URL.' : 'The URL has been added to your documents list.',
        type: isError ? 'error' : 'success',
      });
    }, 3000);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
    if (selectedFileId === id) {
      setSelectedFileId(null);
    }
    toast({
      title: 'Removed',
      message: 'The document has been removed from the list.',
      type: 'info',
    });
  };

  const processAllDocuments = async () => {
    const filesToUpload = files.filter(file => file.type !== 'url');
    const urlsToProcess = files.filter(file => file.type === 'url');

    if (filesToUpload.length === 0 && urlsToProcess.length === 0) {
      toast({
        title: 'No Documents Ready',
        message: 'Please upload or add documents. Ensure they are not in an error state.',
        type: 'info',
      });
      return;
    }

    if (!userId || !projectId) {
      toast({
        title: 'Error',
        message: 'User or Project ID is still loading or unavailable. Cannot process documents.',
        type: 'error',
      });
      return;
    }

    setIsProcessingAll(true);
    const formData = new FormData();

    filesToUpload.forEach(file => {
      formData.append('files', file.source as File);
    });

    formData.append('userId', userId);
    formData.append('projectId', projectId);
    formData.append('prompt', promptInput.trim() || ''); // Add prompt to FormData

    try {
      const response = await axios.post('http://localhost:5000/extract/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          console.log(`Overall Upload Progress: ${percentCompleted}%`);
        }
      });
      console.log('Backend Response:', response.data);
      
    } catch (error) {
      console.log('API Error during document processing:', error);
      let errorMessage = 'An unexpected error occurred.';
      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
          errorMessage = 'Network error: No response from server.';
        } else {
          errorMessage = `Request error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Processing Failed',
        message: errorMessage,
        type: 'error',
      });
    } finally {
      navigate('/projects/1/requirements');
      setIsProcessingAll(false);
    }
  };

  const getFileIcon = (file: UploadedFile) => {
    if (file.type === 'url') return <LinkIcon size={20} className="text-primary-500 dark:text-primary-400" />;
    if (file.type.includes('pdf')) return <File size={20} className="text-error-500 dark:text-error-400" />;
    if (file.type.includes('word')) return <FileText size={20} className="text-primary-500 dark:text-primary-400" />;
    if (file.type.includes('excel') || file.type.includes('spreadsheet')) return <FileSpreadsheet size={20} className="text-success-500 dark:text-success-400" />;
    if (file.type.includes('image')) return <FileImage size={20} className="text-secondary-500 dark:text-secondary-400" />;
    return <File size={20} className="text-gray-500 dark:text-gray-400" />;
  };

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'complete':
        return <Check size={16} className="text-success-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-error-500" />;
      case 'processing':
        return (
          <svg className="animate-spin h-4 w-4 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      case 'uploading':
        return null;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: FileStatus) => {
    switch (status) {
      case 'uploading': return 'Uploading';
      case 'processing': return 'Processing';
      case 'complete': return 'Complete';
      case 'error': return 'Error';
      default: return 'Pending';
    }
  };

  const getStatusClass = (status: FileStatus) => {
    switch (status) {
      case 'complete': return 'text-success-600 dark:text-success-400';
      case 'error': return 'text-error-600 dark:text-error-400';
      case 'processing': return 'text-primary-600 dark:text-primary-400';
      case 'uploading': return 'text-gray-600 dark:text-gray-400';
      default: return 'text-gray-500 dark:text-gray-500';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Clear prompt input
  const clearPrompt = () => {
    setPromptInput('');
    toast({
      title: 'Prompt Cleared',
      message: 'The prompt has been cleared.',
      type: 'info',
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Document Upload
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload documents for AI processing and requirements extraction
          </p>
        </div>
        {isLoadingProjectDetails && <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 sm:mt-0">Loading project info...</div>}
        {projectDetailsError && <div className="text-sm text-error-600 dark:text-error-400 mt-2 sm:mt-0">{projectDetailsError}</div>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-900/20'
                : 'border-gray-300 hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload
                size={36}
                className={`mx-auto ${
                  isDragActive ? 'text-primary-500 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'
                }`}
              />
              <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {isDragActive ? 'Drop the files here...' : 'Drag & drop files here, or click to browse'}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Accepts Word, Excel, PDF, and image files
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Uploaded Documents ({files.length})
              </h2>
            </div>
            {files.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {files.map((file) => (
                  <li
                    key={file.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer ${
                      selectedFileId === file.id ? 'bg-gray-50 dark:bg-gray-750' : ''
                    }`}
                    onClick={() => setSelectedFileId(file.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          {getFileIcon(file)}
                        </div>
                        <div className="ml-3 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {file.size > 0 && <span className="mr-2">{formatFileSize(file.size)}</span>}
                            <span className={`flex items-center ${getStatusClass(file.status)}`}>
                              {getStatusIcon(file.status)}
                              <span className="ml-1">{getStatusLabel(file.status)}</span>
                            </span>
                          </div>
                          {file.status === 'error' && file.error && (
                            <p className="text-xs text-error-600 dark:text-error-400 mt-1">
                              {file.error}
                            </p>
                          )}
                          {file.status === 'uploading' && (
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                              <div
                                className="bg-primary-600 dark:bg-primary-500 h-1.5 rounded-full"
                                style={{ width: `${file.progress}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="text-gray-400 hover:text-error-500 dark:text-gray-500 dark:hover:text-error-400"
                          title="Remove document"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No documents uploaded yet
              </div>
            )}
            {files.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={processAllDocuments}
                  className="w-full"
                  disabled={
                    isProcessingAll ||
                    files.some(f => f.status === 'uploading' || f.status === 'processing') ||
                    !userId ||
                    !projectId
                  }
                  isLoading={isProcessingAll}
                >
                  {isProcessingAll ? 'Processing...' : 'Process All Documents'}
                </Button>
              </div>
            )}
          </div>

          {/* Prompt Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Custom Prompt for AI Processing
            </h2>
            <div className="flex flex-col space-y-2">
              <div className="relative">
                <MessageSquare size={16} className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Enter a prompt to guide AI processing (e.g., 'Extract user stories for a web application focusing on user authentication.')"
                  className="w-full p-3 pl-10 bg-gray-800 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200 resize-y min-h-[100px]"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  onClick={clearPrompt}
                  variant="outline"
                  disabled={!promptInput.trim()}
                >
                  Clear Prompt
                </Button>
              </div>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Optional: Provide specific instructions to tailor the AI's requirement extraction.
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Document Preview
              </h2>
            </div>
            {selectedFileId ? (
              <>
                {files.find(f => f.id === selectedFileId)?.preview ? (
                  <div className="p-4">
                    <img
                      src={files.find(f => f.id === selectedFileId)?.preview}
                      alt={`Preview of ${files.find(f => f.id === selectedFileId)?.name}`}
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="bg-gray-100 dark:bg-gray-750 rounded-md p-6 flex flex-col items-center justify-center">
                      {getFileIcon(files.find(f => f.id === selectedFileId)!)}
                      <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-full text-center">
                        {files.find(f => f.id === selectedFileId)?.name}
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Preview not available
                      </p>
                      {files.find(f => f.id === selectedFileId)?.type === 'url' && (
                        <a
                          href={files.find(f => f.id === selectedFileId)?.source as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-4 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          Open in new tab
                          <ExternalLink size={12} className="ml-1" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedFileId(null)}
                    className="w-full"
                    leftIcon={<X size={16} />}
                  >
                    Close Preview
                  </Button>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400 h-[300px] flex items-center justify-center">
                <div>
                  <File size={32} className="mx-auto text-gray-400 dark:text-gray-500" />
                  <p className="mt-2">Select a document from the list to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 dark:bg-gray-750 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tips for better requirement extraction
        </h3>
        <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
          <li>Use structured documents with clear headings and sections.</li>
          <li>Ensure documents are not password protected or encrypted.</li>
          <li>For scanned documents (images/PDFs), ensure the text is clear and readable by OCR software.</li>
          <li>When uploading URLs, ensure the content is publicly accessible and in a supported document format.</li>
          <li>The system works best with formal requirement specifications, user stories, or technical documentation.</li>
          <li>Provide a clear prompt to guide the AI in extracting relevant requirements.</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;