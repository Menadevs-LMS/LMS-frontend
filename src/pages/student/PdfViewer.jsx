import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString();

const PdfViewer = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error) {
    console.error('PDF load error:', error);
    setError(error.message || 'Failed to load PDF');
    setLoading(false);
  }

  const onPageLoadSuccess = () => {
    setLoading(false);
  };

  const onPageLoadError = (error) => {
    console.error('Page load error:', error);
    setError(error.message || 'Failed to load page');
  };

  if (error) {
    return (
      <div className="pdf-error">
        <h3>PDF Loading Error</h3>
        <p>{error}</p>
        <details style={{ marginTop: '10px' }}>
          <summary>Troubleshooting Tips</summary>
          <ul style={{ textAlign: 'left', marginTop: '10px' }}>
            <li>Check if the PDF URL is accessible: <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Open PDF directly</a></li>
            <li>Ensure CORS is configured on your S3 bucket</li>
            <li>Verify the PDF file is not corrupted</li>
            <li>Check browser console for additional errors</li>
          </ul>
        </details>
      </div>
    );
  }

  return (
    <div className="pdf-container">
      {loading && <div className="pdf-loading">Loading PDF...</div>}
      
      <Document 
        file={{
          url: pdfUrl,
          httpHeaders: {
            'Cache-Control': 'no-cache'
          }
        }}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div>Loading document...</div>}
        error={<div>Failed to load PDF document.</div>}
        noData={<div>No PDF file specified.</div>}
        options={{
          cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/standard_fonts/',
        }}
      >
        <Page 
          pageNumber={pageNumber} 
          width={600}
          onLoadSuccess={onPageLoadSuccess}
          onLoadError={onPageLoadError}
          loading={<div>Loading page...</div>}
          error={<div>Failed to load page.</div>}
        />
      </Document>
      
      {numPages && (
        <div className="pdf-controls">
          <button 
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Previous
          </button>
          <span>
            Page {pageNumber} of {numPages}
          </span>
          <button 
            disabled={pageNumber >= numPages}
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;