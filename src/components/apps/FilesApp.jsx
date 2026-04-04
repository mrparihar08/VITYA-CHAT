import React, { useState } from "react";

const FilesApp = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="miniApp">
      <h3>Files</h3>

      <input type="file" className="inputBox" onChange={handleFileChange} />

      {fileName && (
        <div className="listItem" style={{ marginTop: 12 }}>
          Selected file: <strong>{fileName}</strong>
        </div>
      )}

      <p className="mutedText" style={{ marginTop: 12 }}>
        You can later connect this with upload API.
      </p>
    </div>
  );
};

export default FilesApp;