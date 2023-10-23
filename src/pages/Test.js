import Layout from '../layout/Layout';
import Uploady, {useUploady} from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
import { UploadPreview } from "@rpldy/upload-preview";

const Test = () => {

    const MyUploadCButton = () => {
        const uploady = useUploady();
    
        const onClick = () => {
            uploady.showFileUpload();
        };
    
        return <button className='rounded-md w-full h-12 mt-8 mr-2 px-5 py-1 bg-borderColor text-sm font-semibold text-myPrimary shadow-sm hover:text-primaryText' onClick={onClick}>Custom Upload Button</button>;
    }

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
                <div className="row mt-70">
                <Uploady>
                <UploadPreview />
    <MyUploadCButton/>
    </Uploady>
                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Test;