"use client";
import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IoHomeOutline, IoGridOutline, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';

export default function Sidebar(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  
  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      const target = e.target as HTMLElement;
      if (isOpen && target.id === 'overlay') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 bg-black text-white p-3 rounded-md shadow-lg md:hidden"
        aria-label="Open menu"
      >
        <IoMenuOutline className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          id="overlay"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-full bg-white text-black w-64 shadow-xl border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:z-30`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Synapse Blog</h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-black p-2 rounded-md hover:bg-gray-100 md:hidden"
            aria-label="Close menu"
          >
            <IoCloseOutline className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/"
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                  pathname === '/' ? 'bg-gray-100 border-l-4 border-black' : ''
                }`}
              >
                <IoHomeOutline className="w-5 h-5" />
                <span> Home</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/createnewpost"
                className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition-colors ${
                  pathname === '/createnewpost' ? 'bg-gray-100 border-l-4 border-black' : ''
                }`}
              >
                <IoGridOutline className="w-5 h-5" />
                <span>Create New Post</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">© 2025 My App</p>
        </div>
      </div>
    </>
  );
}