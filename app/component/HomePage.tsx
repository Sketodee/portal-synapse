import React from 'react'
import Button from './Button'
import { FaPlus } from 'react-icons/fa'

const HomePage = () => {
  return (
    <div className='w-[80%] mx-auto px-2'>
        <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Blog Management</h2>   
        <div className="flex space-x-2">
          <Button
            text= "New Post"
            icon={FaPlus}
            bgColor="bg-gray-900"
            textColor="text-white"
            className=""
          />
        </div>
      </div>
    </div>
  )
}

export default HomePage