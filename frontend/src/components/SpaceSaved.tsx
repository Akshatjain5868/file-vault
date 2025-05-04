// import React, { useEffect, useState } from 'react';
// import { fileService } from '../services/fileService';

// export const SpaceSaved: React.FC = () => {
//   const [spaceSaved, setSpaceSaved] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchSpaceSaved = async () => {
//       try {
//         const data = await fileService.getSpaceSaved();
//         setSpaceSaved(data.total_space_saved_mb); // assuming backend sends { total_space_saved: number }
//       } catch (err) {
//         console.error('Error fetching space saved:', err);
//         setError('Failed to fetch saved space');
//       }
//     };

//     fetchSpaceSaved();
//   }, []);

//   if (error) return <div className="text-red-600">{error}</div>;

//   return (
//     <div className="p-4 rounded shadow-md bg-gray-100 w-fit">
//       <h2 className="text-lg font-semibold mb-2">Total Space Saved</h2>
//       <p className="text-xl">
//         {spaceSaved !== null
//           ? `${(spaceSaved)} MB`
//           : 'Loading...'}
//       </p>
//     </div>
//   );
// };

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import {fileService} from '../services/fileService';

export const SpaceSaved = forwardRef((props, ref) => {
  const [spaceSaved, setSpaceSaved] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSpaceSaved = async () => {
    try {
      const data = await fileService.getSpaceSaved();
      setSpaceSaved(data.total_space_saved_mb);
    } catch (err) {
      console.error('Error fetching space saved:', err);
      setError('Failed to fetch saved space');
    }
  };

  useImperativeHandle(ref, () => ({
    fetchSpaceSaved,
  }));

  useEffect(() => {
    fetchSpaceSaved();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Total Space Saved</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-gray-700 text-xl">
          {spaceSaved !== null ? `${spaceSaved} MB` : 'Loading...'}
        </p>
      )}
    </div>
  );
});

