'use client'
import { BlogPostResponse } from '@/types/appTypes';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdDeleteSweep } from "react-icons/md";
import DeleteModal from './DeleteModal';
import { toast } from 'react-toastify';

interface BlogPostCardProps {
  blogPost: BlogPostResponse;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ blogPost }) => {
  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    console.log(`Post ID to delete: ${blogPost._id}`);
    try {
      const response = await fetch(`/api/singleblogpost?id=${blogPost._id}`, {
        method: "DELETE",
      });


      if (!response.ok) {
        // setMessage({ type: "error", text: "Something went wrong" });
        console.log("Something went wrong");
      } else {
        toast.success("Post deleted successfuly");
        setShowModal(false);
      }

    } 
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (error: any) {
      // setMessage({ type: "error", text: error.message });
      toast.error(error.message);
    }
    // close the modal after action
  };

  function splitCommaSeparatedString(input: string): string[] {
    return input.split(',').map(item => item.trim()).filter(item => item !== '');
  }

  const tags = splitCommaSeparatedString(blogPost.tags);

  return (
    <div className="max-w-md overflow-hidden border border-gray-200 rounded-lg  bg-white mt-3">
      {/* Card Image */}
      <div className="relative">
        <img
          src={blogPost.featuredImage}
          alt={blogPost.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {blogPost.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <button className="bg-white rounded-full p-1 shadow-sm cursor-pointer" onClick={() => setShowModal(true)}>
            <MdDeleteSweep className="text-red-500 hover:text-red-500" size={24} />
          </button>
        </div>
      </div>

      <Link href={`/${blogPost._id}`} >
        {/* Card Content */}
        <div className="px-4 py-2 border-b border-gray-200  ">
          <div className="flex items-center justify-between mb-2">
            <div className='flex'>
              {tags.map((tag, index) => (
                <p key={index} className="text-sm bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full mr-2">{tag}</p>
              ))}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {blogPost.readTime} min
            </div>
          </div>
          <h2 className="text-xl font-medium text-gray-800 mb-2 line-clamp-1">{blogPost.title}</h2>
          <p className="text-gray-600 mb-4 line-clamp-2">{blogPost.excerpt}</p>
        </div>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center text-gray-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">2025-03-28</span>
          </div>
          {/* <button className="text-gray-900 font-medium hover:text-gray-900">
                Edit
              </button> */}
        </div>
      </Link>
      {showModal && (
        <DeleteModal
          postId={blogPost._id}
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default BlogPostCard;