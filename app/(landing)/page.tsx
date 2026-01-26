import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
    return (
        <main>
            <div id="landing-content">
                <div id="text-content">
                    <h1>original PDF in, translated PDF out.</h1>
                    <p>MangoPanel will effortlessly translate the manga <span>with full context of the previous pages using a machine language model around translating the way a writer would translate.</span> Translated pdfs can be downloaded, saved and read using our PDF reader.</p>
                    <p>This is a student project, do not take it seriously.</p>
                    <Link href="/register">
                        <div id="start-button">
                            GET STARTED<span>!!</span>
                        </div>
                    </Link>
                </div>
                <div id="manga-preview">
                    <div id="img-gradient">
                    <Image className="img" 
                            src="/preview.png"
                            width={333}
                            height={500}
                            alt="preview of the translation"
                        />
                    </div>
                    <p>PREVIEW</p>
                </div>
            </div>
        </main>
    );
}