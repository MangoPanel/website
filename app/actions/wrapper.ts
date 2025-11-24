'use server';
import { pdfGetAll } from '@/app/lib/pdf';
import { urlR2 } from '@/app/lib/r2';

export async function urlR2wrapper(r2_key: string, expiresIn: number) {
  try {
    const url : string = await urlR2(r2_key, expiresIn);
    return { success: true, url };
  } catch (error) {
    console.error('Download error:', error);
    return { 
      success: false, 
      error: 'Failed to generate download URL' 
    };
  }
}

export async function pdfGetAllWrapper(email : string) {
  return await pdfGetAll(email);
}