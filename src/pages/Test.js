import Layout from '../layout/Layout';
import Uploady from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";
const Test = () => {

    return (
        <>
        <Layout>
        <div className="py-10 mx-auto max-w-7xl">
            <main className="isolate">
                <div className="row mt-70">
                <Uploady destination={{ url: process.env.REACT_APP_API + "/member/avatar" }}>
                    <UploadButton className='bg-slate-400'/>
                </Uploady>
                </div>
            </main>
        </div>
        </Layout>
        </>
    );
}

export default Test;