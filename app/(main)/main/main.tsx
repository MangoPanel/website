"use client"
import { PDF } from "@/app/lib/pdf";
import { urlR2wrapper, pdfGetAllWrapper } from "@/app/actions/wrapper";
import { useRouter } from 'next/navigation';
import { useEffect, ChangeEvent, useState } from "react";

export function Main({ email }: { email: string }) {
    const [PDF, setPDF] = useState<PDF[]>([]);
    const [unprocessedPDF, setUnprocessedPDF] = useState<PDF[]>([]);
    const [uploadedFiles, setFiles] = useState<File[]>([]);
    
    const handleFiles = function(e: ChangeEvent<HTMLInputElement>) {
        const fileList = e?.target.files;
        if (!fileList)
            return;
        setFiles(prevFiles => [...prevFiles, ...Array.from(fileList)]);
    }

    const removeUploadedFile = (fileToRemove: File) => {
        setFiles(prev => prev.filter(file => file !== fileToRemove));
    };

    useEffect(() => {
        const fetchPDFs = async () => {
            const pdfArr : PDF[] = await pdfGetAllWrapper(email) || [];
            const processed   = pdfArr.filter(pdf => pdf.processed === true);
            const unprocessed = pdfArr.filter(pdf => pdf.processed === false);
            setPDF(processed);
            setUnprocessedPDF(unprocessed);
        };
        fetchPDFs();
        const interval = setInterval(fetchPDFs, 30000);
        return () => clearInterval(interval);
    }, [email]);

    return (
        <main>
            <div id="upload-input" className="upload-component">
                {/* drag n drop functionality later perchance*/}
                <label>
                    Upload PDFs here<br />
                    <input type="file" multiple accept="application/pdf" onChange={handleFiles}></input>
                </label>
            </div>
            <div id="main-content">
                <div id="upload-list" className="upload-component">
                    {uploadedFiles.map((file: File) => (
                        <UploadedFile file={file} email={email} key={file.name} onRemove={() => removeUploadedFile(file)}/> 
                    ))}
                </div>

                <div id="library-container">
                    {PDF.map(pdf => (
                    <MangaCard key={pdf.id} PDF={pdf} />
                    ))}
                    {unprocessedPDF.map(pdf => (
                    <MangaCard key={pdf.id} PDF={pdf} />
                    ))}
                </div>
            </div>
        </main>
    );
}

type UploadedFileProps = {
  file: File;
  email: string;
  onRemove: () => void;
};

function UploadedFile({ file, email, onRemove }: UploadedFileProps) {
    const [disable, setDisable] = useState(false);

    const uploadFile = function(translate: boolean) {
        const form = new FormData();
        form.append("file", file);
        form.append("name", file.name);
        form.append("email", email);
        form.append("translate", String(translate));
        fetch('/api/pdf/process', {
            method: 'POST',
            body: form,
        });
    };

    const changeName = function(e: ChangeEvent<HTMLInputElement>) {
        setDisable(true);
        const newName = e.target.value ? `${e.target.value}.pdf` : `.pdf`;
        const newFile = new File([file], newName, {type: file.type});
        file = newFile;

        setDisable(false);
    }
    
    const uploadOriginal = async() => {
        setDisable(true);
        uploadFile(false);
        onRemove();
    };
    const uploadTranslate = function() {
        setDisable(true);
        {/* TODO */}
        onRemove();
    };
    const cancel = function() {
        setDisable(true);
        onRemove();
    }

    return (
        <div className="upload-file">
            <div className="upload-details">
                <div className="input-wrapper">
                    <input type="text" defaultValue={file.name.slice(0, -4)} onChange={changeName} disabled={disable} placeholder="title"></input>
                    <div className="input-suffix">.pdf</div>
                </div>
                <button disabled={disable} onClick={cancel}>CANCEL</button>
                <button disabled={disable} onClick={uploadOriginal}>SEND ORIGINAL</button>
                <button disabled={disable} onClick={uploadTranslate}>TRANSLATE</button>
            </div>
        </div>
    );
}

function MangaCard({ PDF }: { PDF: PDF }) {
    const router = useRouter();
    const redirect = function() {
        router.push(`/reader/${PDF.email}/${PDF.id}`)
    }
    const deletePDF = function() {
        const form = new FormData();
        form.append("email", PDF.email);
        form.append("r2_key", PDF.r2_key);
        form.append("id", String(PDF.id));
        fetch('/api/pdf/delete', {
            method: 'POST',
            body: form,
        });
    }
    const download = async function() {
        const response = await urlR2wrapper(PDF.r2_key);
        if (response.success && typeof response.url === "string") {
            const link = document.createElement('a');
            link.href = response.url;
            link.download = PDF.name.endsWith('.pdf') ? PDF.name : `${PDF.name}.pdf`;
            link.target = '_blank';
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
            // show error notification
    }
    const redo = function() {
        // TODO
    }
    if (!PDF.processed) {
        return (
            <div className="library-element">
                <p>{PDF.name}</p>
                {/* add loading animation */}
            </div>
        );
    }
    return (
        <div className="library-element">
            <p>{PDF.name}</p>
            <div className="manga-options">
                <button onClick={download}>DOWNLOAD</button>
                <button onClick={redo}>REDO</button>
                <button onClick={redirect}>READ</button>
                <button>RENAME</button> {/* Julia pozostawiam to tobie */}
                <button onClick={deletePDF}>DELETE</button>
            </div>
        </div>
    );
}