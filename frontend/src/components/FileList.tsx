// import React from 'react';
// import { fileService } from '../services/fileService';
// import { File as FileType } from '../types/file';
// import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export const FileList: React.FC = () => {
//   const queryClient = useQueryClient();

//   // Query for fetching files
//   const { data: files, isLoading, error } = useQuery({
//     queryKey: ['files'],
//     queryFn: fileService.getFiles,
//   });

//   // Mutation for deleting files
//   const deleteMutation = useMutation({
//     mutationFn: fileService.deleteFile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['files'] });
//     },
//   });

//   // Mutation for downloading files
//   const downloadMutation = useMutation({
//     mutationFn: ({ fileUrl, filename }: { fileUrl: string; filename: string }) =>
//       fileService.downloadFile(fileUrl, filename),
//   });

//   const handleDelete = async (id: string) => {
//     try {
//       await deleteMutation.mutateAsync(id);
//     } catch (err) {
//       console.error('Delete error:', err);
//     }
//   };

//   const handleDownload = async (fileUrl: string, filename: string) => {
//     try {
//       await downloadMutation.mutateAsync({ fileUrl, filename });
//     } catch (err) {
//       console.error('Download error:', err);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6">
//         <div className="animate-pulse space-y-4">
//           <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//           <div className="space-y-3">
//             <div className="h-8 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded"></div>
//             <div className="h-8 bg-gray-200 rounded"></div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-50 border-l-4 border-red-400 p-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg
//                 className="h-5 w-5 text-red-400"
//                 viewBox="0 0 20 20"
//                 fill="currentColor"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700">Failed to load files. Please try again.</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold text-gray-900 mb-4">Uploaded Files</h2>
//       {!files || files.length === 0 ? (
//         <div className="text-center py-12">
//           <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
//           <h3 className="mt-2 text-sm font-medium text-gray-900">No files</h3>
//           <p className="mt-1 text-sm text-gray-500">
//             Get started by uploading a file
//           </p>
//         </div>
//       ) : (
//         <div className="mt-6 flow-root">
//           <ul className="-my-5 divide-y divide-gray-200">
//             {files.map((file) => (
//               <li key={file.id} className="py-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="flex-shrink-0">
//                     <DocumentIcon className="h-8 w-8 text-gray-400" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       {file.original_filename}
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       {file.file_type} • {(file.size / 1024).toFixed(2)} KB
//                     </p>
//                     <p className="text-sm text-gray-500">
//                       Uploaded {new Date(file.uploaded_at).toLocaleString()}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleDownload(file.file, file.original_filename)}
//                       disabled={downloadMutation.isPending}
//                       className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
//                     >
//                       <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
//                       Download
//                     </button>
//                     <button
//                       onClick={() => handleDelete(file.id)}
//                       disabled={deleteMutation.isPending}
//                       className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       <TrashIcon className="h-4 w-4 mr-1" />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// import React, { useState } from 'react';
// import { fileService } from '../services/fileService';
// import { File as FileType } from '../types/file';
// import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// export const FileList: React.FC = () => {
//   const queryClient = useQueryClient();

//   const [searchInput, setSearchInput] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   const [filterInputs, setFilterInputs] = useState({
//     file_type: '',
//     min_size: '',
//     max_size: '',
//     start_date: '',
//     end_date: '',
//   });

//   const [filters, setFilters] = useState({ ...filterInputs });

//   const filesQueryKey = ['files', searchTerm, filters] as const;

//   const { data: files, isLoading, error } = useQuery<FileType[], Error>({
//     queryKey: filesQueryKey,
//     queryFn: () =>
//       fileService.getFiles({
//         q: searchTerm,
//         ...filters,
//       }),
//   });

//   const deleteMutation = useMutation<void, Error, string>({
//     mutationFn: (id) => fileService.deleteFile(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: filesQueryKey });
//     },
//   });

//   const downloadMutation = useMutation<void, Error, { fileUrl: string; filename: string }>({
//     mutationFn: ({ fileUrl, filename }) => fileService.downloadFile(fileUrl, filename),
//   });

//   const handleDelete = (id: string) => deleteMutation.mutate(id);
//   const handleDownload = (fileUrl: string, filename: string) =>
//     downloadMutation.mutate({ fileUrl, filename });

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Multiply max_size and min_size by 1024 when submitting
//     const updatedFilters = {
//       ...filterInputs,
//       max_size: filterInputs.max_size
//         ? (parseFloat(filterInputs.max_size) * 1024).toString()  // Convert to string
//         : '',
//       min_size: filterInputs.min_size
//         ? (parseFloat(filterInputs.min_size) * 1024).toString()  // Convert to string
//         : '',
//     };

//     // Update filters with the transformed values
//     setFilters(updatedFilters);
//     setSearchTerm(searchInput.trim());
//   };

//   if (isLoading) return <p className="p-6">Loading files…</p>;
//   if (error) return <p className="p-6 text-red-600">Failed to load files.</p>;

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>

//       {/* Search + Filters */}
//       <form onSubmit={handleSearch} className="mb-6 space-y-4">
//         {/* 🔍 Filename search */}
//         <div>
//           <input
//             type="text"
//             placeholder="Search by filename..."
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             className="w-full p-2 border rounded focus:outline-none focus:ring"
//           />
//         </div>

//         {/* 🎯 Filters grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//           <select
//             value={filterInputs.file_type}
//             onChange={(e) =>
//               setFilterInputs((f) => ({ ...f, file_type: e.target.value }))
//             }
//             className="p-2 border rounded"
//           >
//             <option value="">All Types</option>
//             <option value="image/jpeg">JPG / JPEG</option>
//             <option value="image/png">PNG</option>
//             <option value="image/gif">GIF</option>
//             <option value="application/pdf">PDF</option>
//             <option value="application/msword">DOC</option>
//             <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">DOCX</option>
//             <option value="text/plain">TXT</option>
//             <option value="text/csv">CSV</option>
//             <option value="application/zip">ZIP</option>
//           </select>
//           <input
//             type="number"
//             placeholder="Min size (KB)"
//             value={filterInputs.min_size}
//             onChange={(e) =>
//               setFilterInputs((f) => ({ ...f, min_size: e.target.value }))
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Max size (KB)"
//             value={filterInputs.max_size}
//             onChange={(e) =>
//               setFilterInputs((f) => ({ ...f, max_size: e.target.value }))
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="date"
//             placeholder="Start date"
//             value={filterInputs.start_date}
//             onChange={(e) =>
//               setFilterInputs((f) => ({ ...f, start_date: e.target.value }))
//             }
//             className="p-2 border rounded"
//           />
//           <input
//             type="date"
//             placeholder="End date"
//             value={filterInputs.end_date}
//             onChange={(e) =>
//               setFilterInputs((f) => ({ ...f, end_date: e.target.value }))
//             }
//             className="p-2 border rounded"
//           />
//           {/* 🔘 Actions */}
//           <div className="flex space-x-3 pt-2 grid grid-cols-2 md:grid-cols-2 gap-2">
//             <button
//               type="submit"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Search
//             </button>
//             <button
//               type="button"
//               onClick={() => {
//                 setSearchInput('');
//                 setFilterInputs({
//                   file_type: '',
//                   min_size: '',
//                   max_size: '',
//                   start_date: '',
//                   end_date: '',
//                 });
//                 setSearchTerm('');
//                 setFilters({
//                   file_type: '',
//                   min_size: '',
//                   max_size: '',
//                   start_date: '',
//                   end_date: '',
//                 });
//               }}
//               className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       </form>

//       {/* File Results */}
//       {!files || files.length === 0 ? (
//         <div className="text-center py-12">
//           <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
//           <p className="mt-2 text-gray-600">No files found</p>
//         </div>
//       ) : (
//         <ul className="divide-y divide-gray-200">
//           {files.map((file) => (
//             <li key={file.id} className="py-4 flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <DocumentIcon className="h-8 w-8 text-gray-400" />
//                 <div>
//                   <p className="text-sm font-medium truncate">{file.original_filename}</p>
//                   <p className="text-xs text-gray-500">
//                     {file.file_type} • {(file.size / 1024).toFixed(2)} KB
//                   </p>
//                   <p className="text-xs text-gray-500">
//                     {new Date(file.uploaded_at).toLocaleString()}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleDownload(file.file, file.original_filename)}
//                   disabled={downloadMutation.status === 'pending'}
//                   className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
//                 >
//                   <ArrowDownTrayIcon className="inline h-4 w-4 mr-1" />
//                   Download
//                 </button>
//                 <button
//                   onClick={() => handleDelete(file.id)}
//                   disabled={deleteMutation.status === 'pending'}
//                   className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
//                 >
//                   <TrashIcon className="inline h-4 w-4 mr-1" />
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

import React, { useState } from 'react';
import { fileService } from '../services/fileService';
import { File as FileType } from '../types/file';
import { DocumentIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PaginatedFiles {
  count: number;
  next: string | null;
  previous: string | null;
  results: FileType[];
}

export const FileList: React.FC = () => {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const [filterInputs, setFilterInputs] = useState({
    file_type: '',
    min_size: '',
    max_size: '',
    start_date: '',
    end_date: '',
  });

  const [filters, setFilters] = useState({ ...filterInputs });

  const filesQueryKey: [
    'files',
    string,
    typeof filters,
    number
  ] = ['files', searchTerm, filters, page];

  const { data, isLoading, error } = useQuery<PaginatedFiles, Error, PaginatedFiles, typeof filesQueryKey>(
    {
      queryKey: filesQueryKey,
      queryFn: () =>
        fileService.getFiles({
          q: searchTerm,
          page,
          ...filters,
        }),
    }
  );

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => fileService.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: filesQueryKey });
    },
  });

  const downloadMutation = useMutation<void, Error, { fileUrl: string; filename: string }>({
    mutationFn: ({ fileUrl, filename }) => fileService.downloadFile(fileUrl, filename),
  });

  const handleDelete = (id: string) => deleteMutation.mutate(id);
  const handleDownload = (fileUrl: string, filename: string) =>
    downloadMutation.mutate({ fileUrl, filename });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedFilters = {
      ...filterInputs,
      max_size: filterInputs.max_size
        ? (parseFloat(filterInputs.max_size) * 1024).toString()
        : '',
      min_size: filterInputs.min_size
        ? (parseFloat(filterInputs.min_size) * 1024).toString()
        : '',
    };

    setFilters(updatedFilters);
    setSearchTerm(searchInput.trim());
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput('');
    const resetFilters = {
      file_type: '',
      min_size: '',
      max_size: '',
      start_date: '',
      end_date: '',
    };
    setFilterInputs(resetFilters);
    setSearchTerm('');
    setFilters(resetFilters);
    setPage(1);
  };

  const files = data?.results || [];

  if (isLoading) {
    return <p className="p-6">Loading files…</p>;
  }
  if (error) {
    return <p className="p-6 text-red-600">Failed to load files.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>

      <form onSubmit={handleSearch} className="mb-6 space-y-4">
        <div>
          <input
            type="text"
            placeholder="Search by filename..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <select
            value={filterInputs.file_type}
            onChange={(e) =>
              setFilterInputs((f) => ({ ...f, file_type: e.target.value }))
            }
            className="p-2 border rounded"
          >
            <option value="">All Types</option>
            <option value="image/jpeg">JPG / JPEG</option>
            <option value="image/png">PNG</option>
            <option value="image/gif">GIF</option>
            <option value="application/pdf">PDF</option>
            <option value="application/msword">DOC</option>
            <option value="application/vnd.openxmlformats-officedocument.wordprocessingml.document">
              DOCX
            </option>
            <option value="text/plain">TXT</option>
            <option value="text/csv">CSV</option>
            <option value="application/zip">ZIP</option>
          </select>

          <input
            type="number"
            placeholder="Min size (KB)"
            value={filterInputs.min_size}
            onChange={(e) =>
              setFilterInputs((f) => ({ ...f, min_size: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Max size (KB)"
            value={filterInputs.max_size}
            onChange={(e) =>
              setFilterInputs((f) => ({ ...f, max_size: e.target.value }))
            }
            className="p-2 border rounded"
          />

          <input
            type="date"
            value={filterInputs.start_date}
            onChange={(e) =>
              setFilterInputs((f) => ({ ...f, start_date: e.target.value }))
            }
            className="p-2 border rounded"
          />
          <input
            type="date"
            value={filterInputs.end_date}
            onChange={(e) =>
              setFilterInputs((f) => ({ ...f, end_date: e.target.value }))
            }
            className="p-2 border rounded"
          />

          <div className="flex space-x-3 pt-2 grid grid-cols-2 md:grid-cols-2 gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {!files.length ? (
        <div className="text-center py-12">
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-2 text-gray-600">No files found</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {files.map((file: FileType) => (
              <li
                key={file.id}
                className="py-4 flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <DocumentIcon className="h-8 w-8 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium truncate">
                      {file.original_filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {file.file_type} • {(file.size / 1024).toFixed(2)} KB
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(file.uploaded_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() =>
                      handleDownload(file.file, file.original_filename)
                    }
                    disabled={downloadMutation.status === 'pending'}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <ArrowDownTrayIcon className="inline h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deleteMutation.status === 'pending'}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    <TrashIcon className="inline h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {(data?.count ?? 0) > 10 && (
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm font-medium">Page {page}</span>
              <button
                onClick={() => setPage((prev) => (data?.next ? prev + 1 : prev))}
                disabled={!data?.next}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};




