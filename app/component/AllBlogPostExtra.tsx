'use client';

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BiGrid } from "react-icons/bi";
import { IoList } from "react-icons/io5";
import { RiResetLeftFill } from "react-icons/ri";
import { BlogPostResponse, PostStatus } from '@/types/appTypes';
import BlogPostCard from './BlogPostCard';

interface ApiResponse {
  data: BlogPostResponse[];
  totalCount: number;
}

const AllBlogPost: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<BlogPostResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [currentFilter, setCurrentFilter] = useState<string>('');
  const countPerPage = 9; // Number of items per page

  // Fetch data from API whenever searchQuery, currentFilter, or currentPage changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Construct API URL with query parameters
        const response= await fetch(`/api/blogpost?page=${currentPage}&filter=${encodeURIComponent(currentFilter)}&search=${encodeURIComponent(searchQuery)}`, {
          cache: "no-store",
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
     
        const result: ApiResponse = await response.json();
        
        setData(result.data);
        setTotalPages(Math.ceil(result.totalCount / countPerPage));
      } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to set some error state here
      } finally {
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchData();
    
    // This useEffect will run whenever searchQuery, currentFilter, or currentPage changes
  }, [searchQuery, currentFilter, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    // Reset to first page when search changes
    setCurrentPage(1);
  };

  const handleViewChange = (view: 'grid' | 'list' | 'calendar') => {
    setCurrentView(view);
  };

  const resetFilter = () => {
    setCurrentFilter(''); 
    setInputValue('');   
    setSearchQuery(''); 
    setCurrentPage(1); 
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setCurrentFilter(filter);
    // Reset to first page when filter changes
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Generate page buttons
  const renderPageButtons = (): React.ReactNode[] => {
    const buttons: React.ReactNode[] = [];
    const maxVisibleButtons: number = 5;

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`px-3 py-1 mx-1 rounded ${currentPage === 1
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 hover:bg-gray-300'
          }`}
      >
        1
      </button>
    );

    // Calculate start and end of shown pages
    let startPage: number = Math.max(2, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage: number = Math.min(totalPages - 1, startPage + maxVisibleButtons - 2);

    if (endPage - startPage < maxVisibleButtons - 2) {
      startPage = Math.max(2, endPage - maxVisibleButtons + 2);
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis-1" className="px-2">
          ...
        </span>
      );
    }

    // Add pages between ellipses
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      buttons.push(
        <span key="ellipsis-2" className="px-2">
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === totalPages
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 hover:bg-gray-300'
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="py-5">
      <div className="w-[95%] lg:w-[80%] mx-auto border border-gray-200 rounded-lg p-2 md:p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Items List</h1>

        <div className='md:flex items-center justify-between w-full border-b border-gray-200 pb-2'>
          <div className="relative flex-grow max-w-xl ">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearch}
              placeholder="Search posts..."
              className="block w-full pl-2 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <div onClick={() => setSearchQuery(inputValue)} className="absolute inset-y-0 right-0 pr-3 pl-3 flex items-center bg-gray-900">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <div className="">
              <select
                value={currentFilter}
                onChange={handleFilterChange}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="">{PostStatus.AllPosts}</option>
                <option value={PostStatus.Publish}>{PostStatus.Publish}</option>
                <option value={PostStatus.Draft}>{PostStatus.Draft}</option>
              </select>
            </div>
            <div className="flex space-x-1 border border-gray-300 rounded-md p-1">
              <button
                onClick={() => handleViewChange('grid')}
                className={`p-2 rounded-md ${currentView === 'grid'
                    ? 'bg-gray-900 text-white'
                    : 'text-black'
                  }`}
                aria-label="Grid view"
              >
                <BiGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`p-2 rounded-md ${currentView === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'text-black'
                  }`}
                aria-label="List view"
              >
                <IoList className="h-5 w-5" />
              </button>
              <button
                onClick={resetFilter}
                className={`p-2 rounded-md bg-gray-900 text-white`}
                aria-label="reset filter"
              >
                <RiResetLeftFill className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Data display area */}
        <div className="mb-6 min-h-64">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : data?.length > 0 ? (
            <div className={currentView === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'divide-y'}>
              {data.map((item, index) => (
                <BlogPostCard key={index} blogPost={item}/>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No items found. Try adjusting your search or filter.</p>
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <>
            <div className="flex justify-center items-center my-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 mr-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex items-center">
                {renderPageButtons()}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 ml-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="text-center text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllBlogPost;