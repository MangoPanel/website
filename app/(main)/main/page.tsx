'use client'

import { ChangeEvent, useState } from "react";

export default function Home() {
    const [showUploadList, setShowUploadList] = useState(false);
    const [uploadedFiles, setFiles] = useState<File[]>([]);

    const handleFiles = function(e: ChangeEvent<HTMLInputElement>) {
        const fileList = e?.target.files;
        
        if(!fileList) {
            setShowUploadList(false);
            return;
        }
        setShowUploadList(true);

        for(let i = 0; i < fileList.length; i++) {
            setFiles((uploadedFiles) => ([...uploadedFiles, fileList[i]]));
        }
    }

    return (
        <main>
            <div id="upload-input" className="upload-component">
                {/* drag n drop functionality later perchance*/}
                <label>
                    Upload images here<br />
                    <input type="file" multiple accept="application/pdf" onChange={handleFiles}></input>
                </label>
            </div>
            <div id="main-content">
                {showUploadList && (<div id="upload-list" className="upload-component">
                    {uploadedFiles.map((file: File, index: number) => (
                        <UploadedFile file={file} key={index} /> 
                    ))}
                </div>)}

                <div id="library-container">
                    {/* list of manga; download/read/rename/delete */}
                </div>
            </div>
        </main>
    );
}

function UploadedFile(props: any) {
    var file = props.file;

    const [disabledUpload, setDisabledUpload] = useState(false);
    const [isFileLoading, setIsFileLoading] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleNameChange = function(e: ChangeEvent<HTMLInputElement>) {
        setDisabledUpload(true);
        const newName = e.target.value ? `${e.target.value}.pdf` : `no title.pdf`;
        
        // insert proper name validation here

        const newFile = new File([file], newName, {type: file.type});
        file = newFile;

        setDisabledUpload(false);
    }
    // feel free to change function names my brain is fried
    const handleSendOriginal = function() {
        setIsFileLoading(true);
        setDisabledUpload(true);
    };
    const handleSendToTranslate = function() {
        setIsFileLoading(true);
        setDisabledUpload(true);
    };
    const handleCancel = function() {
        setIsFileLoading(false);
        setDisabledUpload(false);
    }

    return (
        <div className="upload-file">
            <div className="upload-details">
                <div className="input-wrapper">
                    <input type="text" defaultValue={file.name.slice(0, -4)} onChange={handleNameChange} disabled={isFileLoading} placeholder="title"></input>
                    <div className="input-suffix">.pdf</div>
                </div>
                {isFileLoading ? (!isDone && <button onClick={handleCancel}>CANCEL</button>) : (<>
                    <button disabled={disabledUpload} onClick={handleSendOriginal}>SEND ORIGINAL</button>
                    <button disabled={disabledUpload} onClick={handleSendToTranslate}>TRANSLATE</button></>)
                }
                {isDone && <p>wow its done</p>}
            </div>
            <div className={isFileLoading && !isDone ? "progress-bar loading" : "progress-bar not-active"}></div>
        </div>
    );
}

function Manga() {
    return (
        <div className="library-element">
            <p>TITLE</p>
            <div className="manga-options">
                <button>DOWNLOAD</button>
                <button>READ</button>
                <button>RENAME</button>
                <button>DELETE</button>
            </div>
        </div>
    );
}