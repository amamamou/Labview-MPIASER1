import React, { useState } from 'react';

const UploadCSV = () => {
  const [csvData, setCsvData] = useState<string[][] | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const rows = text.split('\n').map((row) => row.split(','));
          setCsvData(rows);
          setPreview(rows.slice(0, 10)); // Preview first 10 rows
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <h1>Upload CSV</h1>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
      {preview.length > 0 && (
        <div>
          <h2>Preview</h2>
          <table>
            <thead>
              <tr>
                {preview[0]?.map((col: string, index: number) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.slice(1).map((row: string[], rowIndex: number) => (
                <tr key={rowIndex}>
                  {row.map((cell: string, cellIndex: number) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadCSV;