'use client';

import { useState, useRef } from 'react';
import { filesService } from '@/services/files.service';

interface ImageUploadProps {
    value: string[];
    onChange: (urls: string[]) => void;
    maxFiles?: number;
}

export default function ImageUpload({ value = [], onChange, maxFiles = 5 }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        try {
            setUploading(true);
            const filesArray = Array.from(files);

            // If multiple files allowed and selected
            if (maxFiles > 1 && (value.length + filesArray.length) > maxFiles) {
                alert(`You can only upload a maximum of ${maxFiles} images.`);
                return;
            }

            // Upload logic
            if (filesArray.length === 1) {
                const response = await filesService.uploadImage(filesArray[0]);
                onChange([...value, response.url]);
            } else {
                const response = await filesService.uploadImages(filesArray);
                onChange([...value, ...response.urls]);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload images');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {value.map((url, index) => (
                    <div key={index} className="relative w-32 h-32 group">
                        <img
                            src={url}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border border-gray-200"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {value.length < maxFiles && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-saffron hover:bg-saffron/5 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''
                            }`}
                    >
                        {uploading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron"></div>
                        ) : (
                            <>
                                <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                <span className="text-xs text-gray-500 font-medium">Add Image</span>
                            </>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple={maxFiles > 1}
                onChange={handleFileChange}
            />
            <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, WEBP. Max size: 5MB.
            </p>
        </div>
    );
}
