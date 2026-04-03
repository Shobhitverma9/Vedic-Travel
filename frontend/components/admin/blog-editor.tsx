"use client";

import React, { useEffect, useRef } from 'react';
import type EditorJS from '@editorjs/editorjs';
import apiClient from '@/lib/api-client';

interface BlogEditorProps {
    data?: any;
    onChange?: (data: any) => void;
    readOnly?: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({ data, onChange, readOnly }) => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderId = 'editorjs-container';

    useEffect(() => {
        if (!editorRef.current) {
            initEditor();
        }

        return () => {
            if (editorRef.current && editorRef.current.destroy && typeof editorRef.current.destroy === 'function') {
                // editorRef.current.destroy(); // Destroy sometimes causes issues in strict mode
                editorRef.current = null;
            }
        };
    }, []);

    const initEditor = async () => {
        const EditorJS = (await import('@editorjs/editorjs')).default;
        const Header = (await import('@editorjs/header')).default;
        const List = (await import('@editorjs/list')).default;
        const Paragraph = (await import('@editorjs/paragraph')).default;
        const Image = (await import('@editorjs/image')).default;
        const Quote = (await import('@editorjs/quote')).default;
        const Embed = (await import('@editorjs/embed')).default;
        const Table = (await import('@editorjs/table')).default;
        const LinkTool = (await import('@editorjs/link')).default;
        const Underline = (await import('@editorjs/underline')).default;
        const Delimiter = (await import('@editorjs/delimiter')).default;
        const ButtonTool = (await import('./editor-tools/button-tool')).default;
        const Carousel = (await import('./editor-tools/carousel')).default;

        if (editorRef.current) return;

        const editor = new EditorJS({
            holder: holderId,
            data: data,
            readOnly: readOnly,
            placeholder: 'Start writing your blog post here...',
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: true,
                    config: {
                        levels: [1, 2, 3, 4, 5, 6],
                        defaultLevel: 2
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                paragraph: {
                    class: Paragraph,
                    inlineToolbar: true,
                },
                image: {
                    class: Image,
                    config: {
                        uploader: {
                            uploadByFile(file: File) {
                                return new Promise((resolve, reject) => {
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    apiClient.post<{ url: string }>('/blogs/upload', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    })
                                        .then((res) => {
                                            resolve({
                                                success: 1,
                                                file: {
                                                    url: res.data.url,
                                                }
                                            });
                                        })
                                        .catch((err) => {
                                            console.error('Upload failed:', err);
                                            reject(err);
                                        });
                                });
                            },
                            uploadByUrl(url: string) {
                                return Promise.resolve({
                                    success: 1,
                                    file: {
                                        url: url,
                                    }
                                });
                            }
                        }
                    }
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                },
                embed: Embed,
                table: Table,
                linkTool: LinkTool,
                underline: Underline,
                delimiter: Delimiter,
                button: ButtonTool,
                carousel: {
                    class: Carousel,
                    config: {
                        uploader: {
                            uploadByFile(file: File) {
                                return new Promise((resolve, reject) => {
                                    const formData = new FormData();
                                    formData.append('file', file);

                                    apiClient.post<{ url: string }>('/blogs/upload', formData, {
                                        headers: { 'Content-Type': 'multipart/form-data' }
                                    })
                                        .then((res) => {
                                            resolve({
                                                success: 1,
                                                file: {
                                                    url: res.data.url,
                                                }
                                            });
                                        })
                                        .catch((err) => {
                                            console.error('Upload failed:', err);
                                            reject(err);
                                        });
                                });
                            }
                        }
                    }
                },
            },
            onChange: async () => {
                if (onChange) {
                    const savedData = await editor.save();
                    onChange(savedData);
                }
            },
        });

        editorRef.current = editor;
    };

    return (
        <div className="prose max-w-none border rounded-lg p-4 min-h-[400px] bg-white">
            <div id={holderId} />
        </div>
    );
};

export default BlogEditor;
