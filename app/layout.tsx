import './globals.css';
import Sidebar from './component/Sidebar';
import { ReactNode } from 'react';

export const metadata = {
  title: 'My Next.js App',
  description: 'App with responsive sidebar navigation',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning={true}    >
      <body className='font-brandFont'>
        <div className="flex min-h-screen bg-white">
          <Sidebar />
          
          <main className="flex-1 md:ml-64">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}