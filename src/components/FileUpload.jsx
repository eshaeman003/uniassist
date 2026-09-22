import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

/** Local-only file upload: stores images as data URLs for prototype preview. */
export default function FileUpload({ files, onChange, multiple = true, label = 'Click to upload or drag and drop', hint = 'PNG or JPG, up to 5MB each (stored locally for this prototype)' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList).slice(0, multiple ? 4 : 1);
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onChange((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, name: file.name, dataUrl: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (id) => {
    onChange((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div>
      <div
        className={`file-upload ${dragging ? 'dragging' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      >
        <ImagePlus className="file-upload-icon" />
        <p style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text)' }}>{label}</p>
        <p style={{ fontSize: '0.78rem', marginTop: 4 }}>{hint}</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          onChange={(e) => e.target.files?.length && handleFiles(e.target.files)}
        />
      </div>
      {files?.length > 0 && (
        <div className="file-preview-grid">
          {files.map((f) => (
            <div className="file-preview" key={f.id}>
              <img src={f.dataUrl} alt={f.name} />
              <button type="button" onClick={() => removeFile(f.id)} aria-label={`Remove ${f.name}`}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
