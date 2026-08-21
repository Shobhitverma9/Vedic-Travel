"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import apiClient from "@/lib/api-client";

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    endpoint?: string;
    className?: string;
    onUploadStart?: () => void;
    onUploadEnd?: () => void;
}

export function ImageUpload({ value, onChange, endpoint = "/blog/upload", className, onUploadStart, onUploadEnd }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            await uploadFile(file);
        }
    };

    const uploadFile = async (file: File) => {
        setIsUploading(true);
        if (onUploadStart) onUploadStart();
        const formData = new FormData();
        formData.append("file", file);

        try {
            const { data } = await apiClient.post<{ url: string }>(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onChange(data.url);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
            if (onUploadEnd) onUploadEnd();
            // Reset input so same file can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemove = () => {
        onChange("");
    };

    // Extract height class from className if provided
    const heightClass = className?.match(/(h-\d+|h-\[[\d.]+(?:px|rem|em|%)\])/)?.[0];
    const otherClasses = className?.replace(/(h-\d+|h-\[[\d.]+(?:px|rem|em|%)\])/, '').trim();

    // Extract aspect ratio class if provided
    const aspectClass = className?.match(/aspect-(?:square|video|\[.+\])/)?.[0];
    const internalOtherClasses = otherClasses?.replace(/aspect-(?:square|video|\[.+\])/, '').trim();

    return (
        <div className={cn(internalOtherClasses)}>
            <div
                className={cn(
                    "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors relative overflow-hidden w-full",
                    aspectClass,
                    heightClass || (aspectClass ? "" : (value ? "h-64" : "p-6 h-40"))
                )}
                onClick={() => !value && fileInputRef.current?.click()}
            >
                {value ? (
                    <>
                        <Image
                            src={value}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="absolute bottom-2 right-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                            >
                                Change
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                        {isUploading ? (
                            <>
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p className="text-sm">Uploading...</p>
                            </>
                        ) : (
                            <>
                                <Upload className="h-8 w-8 mb-2" />
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs">Supports JPG, PNG, WEBP</p>
                            </>
                        )}
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />
            </div>
            {value && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground break-all mt-2">
                    <ImageIcon className="h-3 w-3 flex-shrink-0" />
                    {value}
                </div>
            )}
        </div>
    );
}
