"use client"
import { useEffect, useState, useCallback  } from "react";

function pageLink(folder : string, page : number) {
  return `${folder}/page-${page.toString().padStart(3, '0')}.jpg`;
}

async function checkPageExists(folder: string, page: number): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = pageLink(folder, page);
  });
}

export function Main({ folder }: { folder: string }) {
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState<number | null>(null);

  useEffect(() => {
    const discoverLastPage = async () => {
      if (lastPage !== null) return;
      
      let testPage = 1;
      while (await checkPageExists(folder, testPage))
        testPage++;
      setLastPage(testPage - 1);
    };
    
    discoverLastPage();
  }, [folder, lastPage]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setPage(prev => Math.max(1, prev - 2));
    } else if (e.key === 'ArrowRight') {
      setPage(prev => prev + 2);
    }
  }, []);

  useEffect(() => {
    if (lastPage && page > lastPage) {
      setPage(prev => Math.max(1, prev - 2));
    }
  }, [page, lastPage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
      <main>
      <div className='pages'>
          <div><img src={pageLink(folder, page)} loading="eager" alt={`page ${page}`} /></div>
          <div><img src={pageLink(folder, page + 1)} loading="eager" alt={`page ${page + 1}`} /></div>
      </div>      
      </main>
  );
}