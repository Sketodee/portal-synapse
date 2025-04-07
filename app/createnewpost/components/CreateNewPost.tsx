'use client'

import React, { useRef, useState } from 'react';
import Button from '@/app/component/Button';
import { BsEyeSlash } from 'react-icons/bs';
import { TbSend } from 'react-icons/tb';
import BlogPostForm, {
  BlogPostFormHandle,
} from './BlogPostForm';
import { PostStatus } from '@/types/appTypes';

const CreateNewPost: React.FC = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingStatus, setSubmittingStatus] = useState<null | PostStatus>(null);

  const formRef = useRef<BlogPostFormHandle>(null);

//   const handleExternalSubmit = (data: any) => {
//     // console.log(data)
//     // You can add logic based on which action was triggered (e.g., publish/draft)
//   };

  const handleSubmit = (status: PostStatus) => {
    formRef.current?.submitForm(status);
    setSubmittingStatus(status);
  };

  return (
    <div className="w-[80%] mx-auto px-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Create New Post</h2>   
        <div className="flex space-x-2">
          <Button
             text={isSubmitting && submittingStatus === PostStatus.Draft ? "Saving..." : "Save as Draft"}
            icon={BsEyeSlash}
            bgColor="bg-white"
            textColor="text-black"
            className="border border-gray-300"
            onClick={() => handleSubmit(PostStatus.Draft)}
          />
          <Button
            text={isSubmitting && submittingStatus === PostStatus.Publish ? "Publishing..." : "Publish"}
            icon={TbSend}
            bgColor="bg-gray-900"
            textColor="text-white"
            className="border border-gray-300"
            onClick={() => handleSubmit(PostStatus.Publish)}
          />
        </div>
      </div>

      <BlogPostForm ref={formRef} isSubmitting={isSubmitting} setIsSubmitting={setIsSubmitting}  />
    </div>
  );
};

export default CreateNewPost;

{/* <Button
            text="Schedule"
            icon={IoCalendarClearOutline}
            bgColor="bg-white"
            textColor="text-black"
            className="border border-gray-300"
            onClick={() => handleSubmit(PostStatus.Schedule)}
          /> */}