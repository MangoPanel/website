import Image from 'next/image'
import Link from 'next/link'
export default function Home() {
    return (
        <main>
            {/* <div className="hero">
                <div className="upper">
                    <h1 className="white">original PDF in, translated PDF out</h1>
                    <p className="white">MangoPanel will effortlessly translate the manga <span className="purple">with full context of the previous pages using a machine language model around translating the way a writer would translate.</span> Translated pdfs can be downloaded, saved and read using our PDF reader.</p>
                </div>
                <div className="lower">
                    <div>
                        <Image className="img" 
                            src="/placeholder.webp"
                            width={484}
                            height={726}
                            alt="placeholder"
                        />
                    </div>
                    <div>
                        <Link href="/register" className="white button">GET STARTED</Link>
                    </div>
                </div>
            </div>
            <div>
                
            </div> */}
            <div id="landing-content">
                <div id="text-content">
                    <h1>original PDF in, translated PDF out.</h1>
                    <p>MangoPanel will effortlessly translate the manga <span>with full context of the previous pages using a machine language model around translating the way a writer would translate.</span> Translated pdfs can be downloaded, saved and read using our PDF reader.</p>
                    <Link href="/register">
                        <div id="start-button">
                            GET STARTED<span>!!</span>
                        </div>
                    </Link>
                </div>
                <div id="manga-preview">
                    <div id="img-gradient">
                    <Image className="img" 
                            src="/placeholder.webp"
                            width={333}
                            height={500}
                            alt="placeholder"
                        />
                    </div>
                    <p>PREVIEW</p>
                </div>
            </div>
        </main>
    );
}