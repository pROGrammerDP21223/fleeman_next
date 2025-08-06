'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SimplePageTransition({ children }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when pathname changes
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 50); // Reduced delay for faster transition

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div className="spinner-border text-light" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      key={pathname}
      className="page-transition"
      style={{
        minHeight: '100vh',
        width: '100%',
        opacity: 0,
        animation: 'fadeIn 0.3s ease-in-out forwards'
      }}
    >
      {children}
    </div>
  );
} 