'use client';

import { BlogPostResponse } from '@/types/appTypes';
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Button from '../component/Button';
import { LiaEdit } from "react-icons/lia";
import EditModal from '../component/EditModal';

interface ApiResponse {
    data: BlogPostResponse | null;
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<BlogPostResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const response= await fetch(`/api/singleblogpost?id=${encodeURIComponent(id)}`, {
                    cache: "no-store",
                  });

                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }

                const result: ApiResponse = await response.json();

                if (!result.data) {
                    return notFound(); // Show Next.js notFound page
                }

                setData(result.data);
            } catch (error) {
                console.error('Fetch error:', error);
                return notFound(); // Also call notFound() if there's an error
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="p-4 text-gray-500">
                Loading blog post...
            </div>
        );
    }

    if (!data) {
        return null; // notFound() already handles rendering
    }

    return (
        <div className="p-4">
            <div className='w-[80%] mx-auto border border-gray-200 rounded-lg p-6'>
                <div className="flex justify-end items-center mb-4">
                    <Button
                        text="Edit Post"
                        icon={LiaEdit}
                        bgColor="bg-gray-900"
                        textColor="text-white"
                        className=""
                        onClick={() => setShowModal(true)}
                    />
                </div>
                <h1 className="text-2xl font-bold">{data.title}</h1>
                <div
                    className="prose mt-4 blog-content"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            </div>

            {/* Modal */}
            {showModal && (
                <EditModal data={data} onClose={() => setShowModal(false)} />
            )}

        </div>
    );
}
