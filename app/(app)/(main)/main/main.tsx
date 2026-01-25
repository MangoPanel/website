"use client"
import { PDFtype } from "@/app/lib/pdf";
import { urlR2wrapper, pdfGetAllWrapper } from "@/app/actions/wrapper";
import { useRouter } from 'next/navigation';
import { useEffect, ChangeEvent, useState } from "react";

export function Main({ email }: { email: string }) {
    const [PDF, setPDF] = useState<PDFtype[]>([]);
    const [unprocessedPDF, setUnprocessedPDF] = useState<PDFtype[]>([]);
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
            const pdfArr : PDFtype[] = await pdfGetAllWrapper(email) || [];
            if (pdfArr.length !== 0) {
                const processed   = pdfArr.filter(pdf => pdf.processed === true);
                const unprocessed = pdfArr.filter(pdf => pdf.processed === false);
                setPDF(processed);
                setUnprocessedPDF(unprocessed);
            }
        };
        fetchPDFs();
        const interval = setInterval(fetchPDFs, 3000);
        return () => clearInterval(interval);
    }, [email]);

    return (
        <main>
            <div id="upload-input" className="upload-component">
                {/* drag n drop functionality later perchance*/}
                <p>Upload your PDFs</p>
                <label id="file-button" htmlFor="file-input">
                    Browse...</label>
                <input type="file" multiple accept="application/pdf" id="file-input" onChange={handleFiles}></input>
            </div>
            <div id="main-content">
                {uploadedFiles.length > 0 && <div id="upload-list" className="upload-component">
                    {uploadedFiles.map((file: File) => (
                        <UploadedFile file={file} email={email} key={file.name} onRemove={() => removeUploadedFile(file)}/> 
                    ))}
                </div>}

                <div id="library-container">
                    {( PDF === undefined || PDF.length === 0) && <p>Your library is empty.</p> }
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
        uploadFile(true);
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
                <button className="upload-cancel" disabled={disable} onClick={cancel}>CANCEL</button>
                <button disabled={disable} onClick={uploadOriginal}>SEND ORIGINAL</button>
                <button disabled={disable} onClick={uploadTranslate}>TRANSLATE</button>
            </div>
        </div>
    );
}

function MangaCard({ PDF }: { PDF: PDFtype }) {
    const [editing, setEditing] = useState<string>("");
    const [newTitle, setNewTitle] = useState<string>("");

    const changeTitle = function(e: ChangeEvent<HTMLInputElement>) {
        const titleInput = e.target.value ? `${e.target.value}` : PDF.name;
        setNewTitle(titleInput + ".pdf");
    }

    const router = useRouter();
    const redirect = function() {
        router.push(`/reader/${PDF.email}/${PDF.id}`)
    }
    const rename = function() {
        const form = new FormData();
        form.append("email", PDF.email);
        form.append("r2_key", PDF.r2_key);
        form.append("id", String(PDF.id));
        form.append("name", newTitle);
        fetch('api/pdf/rename', {
            method: 'POST',
            body: form
        });
        setEditing("");
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
        const response = await urlR2wrapper(PDF.r2_key, 60);
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
        const form = new FormData();
        form.append("r2_key", PDF.r2_key);
        form.append("id", String(PDF.id));
        form.append("name", PDF.name);
        form.append("email", PDF.email);
        fetch('/api/pdf/redo', {
            method: 'POST',
            body: form,
        });
    }
    if (!PDF.processed) {
        return (
            <div className="library-element">
                <p>{PDF.name}</p>
                <div className="manga-options">
                    <div className="loader"></div>
                </div>
            </div>
        );
    }
    return (
        <div className="library-element">
            {editing === "" && <p>{PDF.name}</p>}
            {editing === "" && <div className="manga-options">
                <button className="read-button" onClick={redirect}>READ</button>
                <button onClick={() => setEditing("rename")}>RENAME</button>
                <button onClick={download}>DOWNLOAD</button>
                {PDF.translated && <button onClick={redo}>REDO</button>}
                <button onClick={() => setEditing("delete")}>DELETE</button>
            </div>}
            {editing === "delete" && <div className="manga-options editing">
                <p>Are you sure you want to delete <span>{PDF.name}</span>?</p>
                <div className="editing-buttons">
                    <button onClick={() => setEditing("")}>No, go back.</button>
                    <button className="edit-confirm-button" onClick={deletePDF}>Yes, delete it.</button>
                </div>
            </div>}
            {editing === "rename" && <div className="manga-options editing">
                <input type="text" defaultValue={PDF.name.slice(0, -4)} onChange={changeTitle} placeholder="new title"></input>
                <div className="editing-buttons">
                    <button onClick={() => setEditing("")}>Cancel.</button>
                    <button className="edit-confirm-button" onClick={rename}>Rename.</button>
                </div>
            </div>}
        </div>
    );
}