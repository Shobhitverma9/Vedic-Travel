'use client';

import { useState, useRef } from 'react';
import { filesService } from '@/services/files.service';
import { FileText, X, Upload, Loader2 } from 'lucide-react';

interface PDFUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function PDFUpload({ value, onChange, label = "Upload Itinerary PDF" }: PDFUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const file = files[0];

            if (file.type !== 'application/pdf') {
                alert('Please upload a PDF file.');
                return;
            }

            // Upload logic - reusing filesService which uses resource_type 'auto'
            const response = await filesService.uploadImage(file);
            onChange(response.url);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload PDF');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeFile = () => {
        onChange('');
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{label}</label>
            <div className="flex items-center gap-4">
                {value ? (
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl w-full max-w-md group relative">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-blue-900 truncate">
                                {value.split('/').pop()}
                            </p>
                            <p className="text-[10px] text-blue-400 font-mono">
                                Itinerary PDF Attached
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={removeFile}
                            className="p-1.5 bg-white text-red-500 rounded-full shadow-sm hover:bg-red-50 transition-colors border border-red-100"
                            title="Remove PDF"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        
                        <a 
                            href={value} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-all rounded-xl"
                        />
                    </div>
                ) : (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full max-w-md h-24 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {uploading ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-2 group-hover:bg-blue-100 transition-colors">
                                    <Upload className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                </div>
                                <span className="text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">Click to upload PDF Itinerary</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-tighter">Max Size: 10MB</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
            />
        </div>
    );
}
