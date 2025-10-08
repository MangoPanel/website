import Image from 'next/image'
export default function Home() {
    return (
        <main>
            <div id="upload-container">
                <div id="upload-input" className="upload-component">
                    {/* might throw it into a form if necessary */}
                    {/* drag n drop functionality? no submit button it just gets sent to the list (if pdf) */}
                    {/* could make it so you can change the title here at this step? maybe */}
                    <label>
                        Drop images here BLERGHAJHSGDJHA
                        <input type="file" multiple></input>
                    </label>
                </div>
                <div id="upload-list" className="upload-component">
                    {/* TITLE... [start/cancel] + a loading bar*/}
                    <UploadedFile />
                </div>
            </div>
            <div id="library-container">
                {/* list of manga; shows first page, cover functionality perchance? more options on hover */}
                <Manga />
            </div>
        </main>
    );
}

// will probably use some kind of id system
function UploadedFile() {
    return (
        <div className="upload-file">
            <p>TITLE...</p>
            <button>STATE</button><br/>
            <div className="progress-bar"></div>
        </div>
    );
}

// image; download, read, rename, delete options on hover
// id system here too
function Manga() {
    return (
        <div className="library-element">
            <Image className="img" 
                src="/placeholder.webp"
                width={265}
                height={400}
                alt="placeholder"
            />
            <div className="manga-options">
                <button>DOWNLOAD</button>
                <button>READ</button>
                <button>RENAME</button>
                <button>DELETE</button>
            </div>
        </div>
    );
}