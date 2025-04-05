'use client'

import React, { useRef } from 'react';
import Button from '@/app/component/Button';
import { BsEyeSlash } from 'react-icons/bs';
import { IoCalendarClearOutline } from 'react-icons/io5';
import { TbSend } from 'react-icons/tb';
import BlogPostForm, {
  BlogPostFormHandle,
} from './BlogPostForm';

const CreateNewPost: React.FC = () => {
  const formRef = useRef<BlogPostFormHandle>(null);

  const handleExternalSubmit = (data: any) => {
    console.log('Form data from BlogPostForm:', data);
    // You can add logic based on which action was triggered (e.g., publish/draft)
  };

  const handleSubmit = (actionType: 'draft' | 'schedule' | 'publish') => {
    console.log(`Triggering form submit for: ${actionType}`);
    formRef.current?.submitForm();
  };

  return (
    <div className="w-[80%] mx-auto px-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Create New Post</h2>
        <div className="flex space-x-2">
          <Button
            text="Save as Draft"
            icon={BsEyeSlash}
            bgColor="bg-white"
            textColor="text-black"
            className="border border-gray-300"
            onClick={() => handleSubmit('draft')}
          />
          <Button
            text="Schedule"
            icon={IoCalendarClearOutline}
            bgColor="bg-white"
            textColor="text-black"
            className="border border-gray-300"
            onClick={() => handleSubmit('schedule')}
          />
          <Button
            text="Publish"
            icon={TbSend}
            bgColor="bg-gray-900"
            textColor="text-white"
            className="border border-gray-300"
            onClick={() => handleSubmit('publish')}
          />
        </div>
      </div>

      <BlogPostForm ref={formRef} onExternalSubmit={handleExternalSubmit} />
    </div>
  );
};

export default CreateNewPost;
