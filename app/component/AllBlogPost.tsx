'use client';

import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { BiGrid } from "react-icons/bi";
import { IoList } from "react-icons/io5";
import { GoCalendar } from "react-icons/go";

// Define types for mock data
interface Item {
  id: number;
  title: string;
  description: string;
}

type MockDataType = {
  [key: number]: Item[];
};

// Mock data to simulate API response
const mockData: MockDataType = {
  1: [
    { id: 1, title: "Item 1", description: "Description for item 1" },
    { id: 2, title: "Item 2", description: "Description for item 2" },
    { id: 3, title: "Item 3", description: "Description for item 3" },
    { id: 4, title: "Item 4", description: "Description for item 4" },
  ],
  2: [
    { id: 5, title: "Item 5", description: "Description for item 5" },
    { id: 6, title: "Item 6", description: "Description for item 6" },
    { id: 7, title: "Item 7", description: "Description for item 7" },
    { id: 8, title: "Item 8", description: "Description for item 8" },
  ],
  3: [
    { id: 9, title: "Item 9", description: "Description for item 9" },
    { id: 10, title: "Item 10", description: "Description for item 10" },
    { id: 11, title: "Item 11", description: "Description for item 11" },
    { id: 12, title: "Item 12", description: "Description for item 12" },
  ],
  4: [
    { id: 13, title: "Item 13", description: "Description for item 13" },
    { id: 14, title: "Item 14", description: "Description for item 14" },
    { id: 15, title: "Item 15", description: "Description for item 15" },
    { id: 16, title: "Item 16", description: "Description for item 16" },
  ],
  5: [
    { id: 17, title: "Item 17", description: "Description for item 17" },
    { id: 18, title: "Item 18", description: "Description for item 18" },
    { id: 19, title: "Item 19", description: "Description for item 19" },
    { id: 20, title: "Item 20", description: "Description for item 20" },
  ],
  6: [
    { id: 21, title: "Item 21", description: "Description for item 21" },
    { id: 22, title: "Item 22", description: "Description for item 22" },
    { id: 23, title: "Item 23", description: "Description for item 23" },
    { id: 24, title: "Item 24", description: "Description for item 24" },
  ],
  7: [
    { id: 25, title: "Item 25", description: "Description for item 25" },
    { id: 26, title: "Item 26", description: "Description for item 26" },
    { id: 27, title: "Item 27", description: "Description for item 27" },
    { id: 28, title: "Item 28", description: "Description for item 28" },
  ],
  8: [
    { id: 29, title: "Item 29", description: "Description for item 29" },
    { id: 30, title: "Item 30", description: "Description for item 30" },
    { id: 31, title: "Item 31", description: "Description for item 31" },
    { id: 32, title: "Item 32", description: "Description for item 32" },
  ],
};

const AllBlogPost: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [data, setData] = useState<Item[]>(mockData[1]);
  const [loading, setLoading] = useState<boolean>(false);
  const totalPages: number = Object.keys(mockData).length;
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentView, setCurrentView] = useState<'grid' | 'list' | 'calendar'>('grid');
  const [currentFilter, setCurrentFilter] = useState<string>('All Posts');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleViewChange = (view: 'grid' | 'list' | 'calendar') => {
    setCurrentView(view);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const filter = e.target.value;
    setCurrentFilter(filter);
  };

  const handlePageChange = (newPage: number): void => {
    if (newPage >= 1 && newPage <= totalPages) {
      setLoading(true);

      // Simulate API call delay
      setTimeout(() => {
        setCurrentPage(newPage);
        setData(mockData[newPage]);
        setLoading(false);
      }, 500);
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
    let endPage: number = Math.min(totalPages - 1, startPage + maxVisibleButtons - 2);

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
      <div className="w-[80%] mx-auto border border-gray-200 rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Items List {currentPage}</h1>

        <div className='flex items-center justify-between w-full border-b border-gray-200 pb-2'>
          <div className="relative flex-grow max-w-xl ">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search posts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className='flex items-center space-x-2'>
            <div className="">
              <select
                value={currentFilter}
                onChange={handleFilterChange}
                className="block pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option>All Posts</option>
                <option>Published</option>
                <option>Drafts</option>
                <option>Archived</option>
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
                onClick={() => handleViewChange('calendar')}
                className={`p-2 rounded-md ${currentView === 'calendar'
                    ? 'bg-gray-900 text-white'
                    : 'text-black'
                  }`}
                aria-label="Calendar view"
              >
                <GoCalendar className="h-5 w-5" />
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
          ) : (
            <div className="divide-y">
              {data.map((item) => (
                <div key={item.id} className="py-4">
                  <h3 className="font-medium text-lg ">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination controls */}
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
      </div>
    </div>
  );
};

export default AllBlogPost;