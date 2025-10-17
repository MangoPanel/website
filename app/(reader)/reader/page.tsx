"use client";
import { useEffect, useState, useCallback } from 'react';

type ConvertResponse = {
  images: string[];
  pageCount: number;
  folder?: string;
};


export default function Home() {
  const [images, setImages] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [folder, setFolder] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const request = await fetch('/api/reader', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: '/test.pdf'}),
        });
        if (!request.ok) {
          const text = await request.text();
          throw new Error(text || 'HTTP ${res.status}');
        }
        const data: ConvertResponse = await request.json();
        if (!cancelled) {
          setImages(data.images);
          setIdx(0);
        }
      } 
      catch(e: any) { if (!cancelled) setError(e?.message || 'pdf to image conversion failed'); } 
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  },[]);

  useEffect(() => {
    if (!images) return;
    const preload = [images[idx + 2], images[idx + 3]].filter(Boolean);
    preload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, [idx, images]);

  const prev = useCallback(() => {
    setIdx(i => Math.max(0, i - 2));
  }, []);
  const next = useCallback(() => {
    setIdx(i => (images ? Math.min(images.length - 2, i + 2) : i));
  }, [images]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  useEffect(() => {
  const handleCleanup = async () => {
    if (folder) {
      try {
        await fetch(`/api/cleanup?folder=${encodeURIComponent(folder)}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.warn("Cleanup failed:", err);
      }
    }
  };

  window.addEventListener('beforeunload', handleCleanup);
  window.addEventListener('unload', handleCleanup);

  return () => {
    handleCleanup();
    window.removeEventListener('beforeunload', handleCleanup);
    window.removeEventListener('unload', handleCleanup);
  };
}, [folder]);

  if (loading) {
    return (
      <main>
        <div className="loader"></div>
      </main>
    );
  }
  if (error || !images || images.length === 0) {
    return (
      <main>
        <a>failed to process PDF file</a>
      </main>
    );
  }

  return (
    <main>
      <div className='pages'>
        <div><img src={images[idx]} loading="eager" /></div>
        <div><img src={images[idx+1]} loading="eager" /></div>
      </div>      
    </main>
  );
}