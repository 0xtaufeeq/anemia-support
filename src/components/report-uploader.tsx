'use client';

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as pdfjsLib from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';

// Set workerSrc for pdf.js. This is crucial for it to work in Next.js/webpack environments.
// Point to the local copy in the public directory.
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

interface ReportUploaderProps {}

export const ReportUploader: React.FC<ReportUploaderProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [insights, setInsights] = useState<string | null>(null);

  const parsePdf = async (fileToParse: File) => {
    setIsParsing(true);
    setError(null);
    setInsights(null);
    setExtractedText(null);
    try {
      const arrayBuffer = await fileToParse.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let textContent = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const text = await page.getTextContent();
        textContent += text.items.map((s: any) => s.str).join(' ') + '\n'; // Extract text items and join
      }
      if (!textContent.trim()) {
        setError("Could not extract text from PDF. It might be an image-based PDF or empty.");
        setFile(null); // Clear file if no text could be extracted
        return null;
      }
      setExtractedText(textContent);
      return textContent;
    } catch (err) {
      console.error("Error parsing PDF:", err);
      setError("Failed to parse PDF. Ensure it is a valid, non-corrupted PDF file.");
      setFile(null); // Clear file on parsing error
      return null;
    } finally {
      setIsParsing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setInsights(null);
    setExtractedText(null);
    setFile(null);

    if (rejectedFiles && rejectedFiles.length > 0) {
      if (rejectedFiles[0].errors[0]?.code === 'file-too-large') {
        setError("File is too large. Maximum size is 10MB.");
      } else {
        setError("Invalid file type. Please upload a PDF.");
      }
      return;
    }
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      await parsePdf(selectedFile); // Parse immediately after selection
    } 
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }, 
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleRemoveFile = () => {
    setFile(null);
    setError(null);
    setInsights(null);
    setExtractedText(null);
  };

  const handleAnalyze = async () => {
    if (!extractedText) {
      if (file && !isParsing) { // If file is present but no text, try parsing again (edge case)
        setError("Could not extract text from the PDF. Please try re-uploading or use a different file.");
        const text = await parsePdf(file);
        if (!text) return;
      } else if (!file) {
        setError("Please select a PDF file first.");
        return;
      }
      return;
    }
    setIsLoading(true);
    setError(null);
    setInsights(null);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reportText: extractedText }), // Send extracted text
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to analyze report');
      }
      
      setInsights(result.insights);
    } catch (err: any) {
      console.error("Analysis error:", err);
      setError(err.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center text-lg font-semibold">
          <UploadCloud className="mr-2 h-6 w-6 text-primary" /> Upload Blood Report
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1">
          Get AI-powered insights by uploading your blood test report (PDF only).
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div 
          {...getRootProps()} 
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors 
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/20 hover:border-primary/50'}
            ${file && !error ? 'border-green-500 bg-green-500/10' : ''}
            ${error ? 'border-destructive bg-destructive/10' : ''}`}
        >
          <input {...getInputProps()} />
          {isParsing ? (
            <div className="text-center">
                <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-2" />
                <p className="text-primary">Parsing PDF...</p>
            </div>
          ) : file ? (
            <div className="text-center">
              <FileText size={48} className={`${error ? 'text-destructive': 'text-green-600'} mx-auto mb-2`} />
              <p className={`font-semibold ${error ? 'text-destructive': 'text-green-700'}`}>{file.name}</p>
              <p className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</p>
              {extractedText && !error && (
                 <p className="text-xs text-green-600 mt-1">✓ Text extracted</p>
              )}
              {!extractedText && !error && file && (
                  <p className="text-xs text-orange-500 mt-1">! No text found after parsing. Try analysis or re-upload.</p>
              )}
              <div className="mt-3 flex gap-2 justify-center">
                <Button 
                  size="sm" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleAnalyze(); 
                  }} 
                  disabled={isLoading || isParsing || (!extractedText && !file) }
                  className={`${!extractedText && file ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700' }`}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Analyze Report
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleRemoveFile(); 
                  }} 
                  disabled={isLoading || isParsing}
                >Remove</Button>
              </div>
            </div>
          ) : isDragActive ? (
            <p className="text-primary">Drop the PDF file here ...</p>
          ) : (
            <div className="text-center">
              <UploadCloud size={48} className={`mx-auto mb-2 ${error ? 'text-destructive' : 'text-muted-foreground'}`} />
              <p className={`text-sm ${error ? 'text-destructive' : 'text-muted-foreground'}`}>
                Drag & drop your PDF report here, or{' '}
                <span 
                  className="font-semibold text-primary hover:underline" 
                  onClick={(e) => { 
                    e.stopPropagation();
                    open(); 
                  }}
                >
                  click to browse
                </span>.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB.</p>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-3 flex items-center text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" /> 
            {error}
          </div>
        )}
        {insights && !error && (
          <Card className="mt-4 bg-emerald-50 border-emerald-200">
            <CardHeader>
              <CardTitle className="text-md text-emerald-700">Report Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-emerald-600">
              <article className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{insights}</ReactMarkdown>
              </article>
            </CardContent>
          </Card>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Ensure your PDF report is clear and legible for accurate analysis. Image-based PDFs may not be processable.
        </p>
      </CardFooter>
    </Card>
  );
}; 