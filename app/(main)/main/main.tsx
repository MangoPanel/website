"use client"
import { PDF } from "@/app/lib/pdf"
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
            const request = await fetch("/api/pdf/getAll", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }), 
            });
            if (!request.ok) {
                return;
            }
            const data = await request.json();
            const pdfArr : PDF[] = data.pdfArr || [];
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
    return (
        <div className="library-element">
            <p>{PDF.name}</p>
            <div className="manga-options">
                <button>DOWNLOAD</button>
                {PDF.processed && <button>REDO</button>}
                <button>READ</button>
                <button>RENAME</button>
                <button>DELETE</button>
            </div>
        </div>
    );
}