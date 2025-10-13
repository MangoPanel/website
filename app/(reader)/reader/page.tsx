"use client";
import { useEffect, useState, useCallback } from 'react';

type ConvertResponse = {
  images: string[];
  pageCount: number;
};


export default function Home() {
  const [images, setImages] = useState<string[] | null>(null);
  const [idx, setIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/reader', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({url: '/test.pdf'}),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'HTTP ${res.status}');
        }
        const data: ConvertResponse = await res.json();
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

  const prev = useCallback(() => {
    setIdx(i => Math.max(0, i - 1));
  }, []);
  const next = useCallback(() => {
    setIdx(i => (images ? Math.min(images.length - 1, i + 1) : i));
  }, [images]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  if (loading) {
    return (
      <main>
        <a>loading</a>
      </main>
    );  
  }
  if (error || !images || images.length === 0) {
    return (
      <main>
        <a>{error}</a>
      </main>
    );
  }

  return (
    <main>
      <div className='pages'>
        <img src={images[idx]}/>
      </div>      
    </main>
  );
}