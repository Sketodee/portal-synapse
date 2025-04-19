'use client'

import React, { useState, ChangeEvent, forwardRef, useImperativeHandle } from 'react';

import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })
import 'react-quill-new/dist/quill.snow.css';
import { PostStatus } from '@/types/appTypes';

type Props = {
    isSubmitting: boolean;
    setIsSubmitting: (value: boolean) => void;
};

export type BlogPostFormHandle = {
    submitForm: (status?: PostStatus) => void;
};

// Define interfaces for form data and errors
interface FormData {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string | null;
    // Post settings
    // status: 'draft' | 'published' | 'scheduled';
    category: string;
    tags: string;
    readTime: string;

    // SEO settings
    seoTitle: string;
    seoDescription: string;
}

interface FormErrors {
    title: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    // Post settings
    // status: 'draft' | 'published' | 'scheduled';
    category: string;
    tags: string;
    readTime: string;

    // SEO settings
    seoTitle: string;
    seoDescription: string;
}

const categories = [
    { id: '', name: 'Select a category' },
    { id: 'Technology', name: 'Technology' },
    { id: 'business', name: 'Business' },
    { id: 'health', name: 'Health & Wellness' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'Travel', name: 'Travel' }
];

const BlogPostForm = forwardRef<BlogPostFormHandle, Props>(({  setIsSubmitting }, ref,) => {
    // Form state
    const [formData, setFormData] = useState<FormData>({
        title: '',
        excerpt: '',
        content: '',
        featuredImage: null,
        // Post settings
        category: '',
        tags: '',
        readTime: '',

        // SEO settings
        seoTitle: '',
        seoDescription: ''
    });

    // Validation errors state
    const [errors, setErrors] = useState<FormErrors>({
        title: '',
        excerpt: '',
        content: '',
        featuredImage: '',
        // Post settings
        category: '',
        tags: '',
        readTime: '',

        // SEO settings
        seoTitle: '',
        seoDescription: ''
    });

    // Loading state for submit button
    // const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Handle input changes for text fields, textareas, and select elements
    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Clear error when user types
        if (errors[name as keyof FormErrors]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Handle changes for the rich text editor
    const handleEditorChange = (content: string): void => {
        setFormData({
            ...formData,
            content
        });

        // Clear error when user types in the editor
        if (errors.content) {
            setErrors({
                ...errors,
                content: ''
            });
        }
    };

    // Handle image upload
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];

        if (file) {
            // In a real implementation, you would upload the file to a server
            // For now, we'll simulate by storing the file path and creating a preview

            const formToUpload = new FormData();
            formToUpload.append('file', file);

            const response = await fetch('/api/uploadImage', {
                method: 'POST',
                body: formToUpload,
            });

            const result = await response.json();

            if (!response.ok) {
                setErrors({
                    ...errors,
                    featuredImage: 'error uploading file'
                });
            } else {
                // Store the file path (in a real app, this would be the URL returned from your server)
                setFormData({
                    ...formData,
                    featuredImage: result.data[0] // Using filename as placeholder
                });
            }

            // Create a preview URL for the image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);

            // Clear any previous error
            if (errors.featuredImage) {
                setErrors({
                    ...errors,
                    featuredImage: ''
                });
            }
        }
    };

    // Handle image removal
    const handleRemoveImage = (): void => {
        setFormData({
            ...formData,
            featuredImage: null
        });
        setImagePreview(null);
    };


    // Validate the form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            title: '',
            excerpt: '',
            content: '',
            featuredImage: '',
            // Post settings
            category: '',
            tags: '',
            readTime: '',

            // SEO settings
            seoTitle: '',
            seoDescription: ''
        };

        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }

        if (formData.featuredImage == null) {
            newErrors.featuredImage = 'Image is required';
            isValid = false;
        }

        if (!formData.excerpt.trim()) {
            newErrors.excerpt = 'Excerpt is required';
            isValid = false;
        } else if (formData.excerpt.length > 300) {
            newErrors.excerpt = 'Excerpt must be less than 300 characters';
            isValid = false;
        }

        if (!formData.content.trim() || formData.content === '<p><br></p>') {
            newErrors.content = 'Content is required';
            isValid = false;
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
            isValid = false;
        }

        if (!formData.tags.trim()) {
            newErrors.tags = 'Tags are required';
            isValid = false;
        }

        if (!formData.readTime.trim()) {
            newErrors.readTime = 'Read time is required';
            isValid = false;
        }

        if (!formData.seoTitle.trim()) {
            newErrors.seoTitle = 'SEO title is required';
            isValid = false;
        }

        if (!formData.seoDescription.trim()) {
            newErrors.seoDescription = 'SEO description is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    // const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    const handleSubmit = async (e?: React.FormEvent, status?: string) => {
        if (e) e.preventDefault();

        if (validateForm()) {
            setIsSubmitting(true);

            // Call the external submit function if provided
            const updatedData = { ...formData, status };
            console.log(updatedData)
            // onExternalSubmit(updatedData);

            try {
                const response = await fetch("/api/blogpost", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedData),
                });


                if (!response.ok) {
                    // setMessage({ type: "error", text: "Something went wrong" });
                    console.log("Something went wrong");
                }

            } 
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (error: any) {
                // setMessage({ type: "error", text: error.message });
                console.log(error.message);
            }
            finally {
                setIsSubmitting(false);
            }

        }
    };

    useImperativeHandle(ref, () => ({
        submitForm: (status?: PostStatus) => handleSubmit(undefined, status),
    }));

    // React Quill modules config
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="py-5">
            <form onSubmit={handleSubmit} className='flex space-x-2'>

                <div className='bg-white rounded-lg border border-gray-200 p-6 w-2/3'>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-sm  text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter post title"
                            className={`w-full px-3 py-2 border rounded-md font-normal text-base ${errors.title ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600 font-normal">{errors.title}</p>
                        )}
                    </div>


                    <div className="mb-4">
                        <label htmlFor="excerpt" className="block text-sm  text-gray-700 mb-1">
                            Excerpt
                        </label>
                        <textarea
                            id="excerpt"
                            name="excerpt"
                            rows={3}
                            value={formData.excerpt}
                            onChange={handleInputChange}
                            placeholder="Write a brief excerpt that summarizes your post"
                            className={`w-full px-3 py-2 border rounded-md font-normal text-base ${errors.excerpt ? 'border-red-500' : 'border-gray-300'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {errors.excerpt && (
                            <p className="mt-1 text-sm text-red-600 font-normal">{errors.excerpt}</p>
                        )}
                    </div>


                    <div className="mb-6">
                        <label htmlFor="content" className="block text-sm  text-gray-700 mb-1">
                            Content
                        </label>
                        <div className={`${errors.content ? 'border border-red-500 rounded-md' : ''}`}>
                            <ReactQuill
                                theme="snow"
                                value={formData.content}
                                onChange={handleEditorChange}
                                modules={modules}
                                placeholder="Write your post content here..."
                                className="bg-white rounded-md font-normal"
                            />
                        </div>
                        {errors.content && (
                            <p className="mt-1 text-sm text-red-600 font-normal">{errors.content}</p>
                        )}
                        <p className="mt-2 text-xs text-gray-500">
                            Use the formatting toolbar to style your content.
                        </p>
                    </div>


                    <div className="mb-6 font-normal text-base">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Featured Image
                        </label>
                        <div className={`border rounded-md p-6 flex flex-col items-center justify-center text-center ${errors.featuredImage ? 'border-red-500' : 'border-gray-300'}`}>
                            {imagePreview ? (
                                <div className="w-full relative">
                                    <img
                                        src={imagePreview}
                                        alt="Featured"
                                        className="max-h-64 mx-auto object-contain"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 mt-1 mr-1 hover:bg-red-600 transition-colors"
                                        aria-label="Remove image"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="text-gray-400 mb-3">
                                        <svg className="mx-auto h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700 mb-2">No image selected</p>
                                    <p className="text-gray-500 text-sm mb-4">Upload a featured image for your post</p>
                                </>
                            )}
                            <label className="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md cursor-pointer hover:bg-gray-700 transition-colors mt-2">
                                <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </label>
                            {errors.featuredImage && (
                                <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
                            )}
                        </div>
                    </div>

                </div>

                <div className='w-1/3 font-normal text-base'>
                    {/* Sidebar for settings */}
                    <div className="md:col-span-1 space-y-6">
                        {/* Post Settings */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-medium mb-4">Post Settings</h2>

                            {/* Status */}
                            {/* <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        className={`px-3 py-1 text-sm rounded-md ${formData.status === 'draft'
                                                ? 'bg-blue-100 text-blue-800 font-medium'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        onClick={() => handleStatusChange('draft')}
                                    >
                                        Draft
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-1 text-sm rounded-md ${formData.status === 'published'
                                                ? 'bg-green-100 text-green-800 font-medium'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        onClick={() => handleStatusChange('published')}
                                    >
                                        Published
                                    </button>
                                    <button
                                        type="button"
                                        className={`px-3 py-1 text-sm rounded-md ${formData.status === 'scheduled'
                                                ? 'bg-yellow-100 text-yellow-800 font-medium'
                                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            }`}
                                        onClick={() => handleStatusChange('scheduled')}
                                    >
                                        Scheduled
                                    </button>
                                </div>
                            </div> */}

                            {/* Category */}
                            <div className="mb-4">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                >
                                    {categories.map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && (
                                    <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="mb-4">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tags
                                </label>
                                <input
                                    id="tags"
                                    name="tags"
                                    type="text"
                                    value={formData.tags}
                                    onChange={handleInputChange}
                                    placeholder="Enter tags separated by comma"
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.tags ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.tags && (
                                    <p className="mt-1 text-sm text-red-600">{errors.tags}</p>
                                )}
                            </div>

                            {/* Read Time */}
                            <div className="mb-4">
                                <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                                    Read Time
                                </label>
                                <div className="relative">
                                    <input
                                        id="readTime"
                                        name="readTime"
                                        type="text"
                                        value={formData.readTime}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 5 min"
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.readTime ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.readTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.readTime}</p>
                                )}
                            </div>
                        </div>

                        {/* SEO Settings */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h2 className="text-lg font-medium mb-4">SEO Settings</h2>

                            {/* SEO Title */}
                            <div className="mb-4">
                                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                    SEO Title
                                </label>
                                <input
                                    id="seoTitle"
                                    name="seoTitle"
                                    type="text"
                                    value={formData.seoTitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter SEO title"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.seoTitle ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.seoTitle && (
                                    <p className="mt-1 text-sm text-red-600">{errors.seoTitle}</p>
                                )}
                            </div>

                            {/* SEO Description */}
                            <div className="mb-4">
                                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
                                    SEO Description
                                </label>
                                <textarea
                                    id="seoDescription"
                                    name="seoDescription"
                                    rows={4}
                                    value={formData.seoDescription}
                                    onChange={handleInputChange}
                                    placeholder="Enter SEO description"
                                    className={`w-full px-3 py-2 border rounded-md ${errors.seoDescription ? 'border-red-500' : 'border-gray-300'
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                {errors.seoDescription && (
                                    <p className="mt-1 text-sm text-red-600">{errors.seoDescription}</p>
                                )}
                            </div>
                        </div>


                    </div>
                </div>

            </form>
        </div>
    );
});

export default BlogPostForm;