import {useRef} from 'react'
import { PrimaryOutlineButton } from '../MyButton';
// import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js'
// import { Editor } from 'react-draft-wysiwyg'
// import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// // import {convertToHTML} from 'draft-convert'
// import draftToHtml from 'draftjs-to-html';

import { Editor } from '@tinymce/tinymce-react';

export default function ProductContent({
    formData,
    setFormData,
}) {
    // let bInit = useRef(false)
    const {content} = formData
    // const [editorState, setEditorState] = useState(
    //     () => EditorState.createEmpty()
    // )
    const editorRef = useRef(null);
    const onSave = () => {
        setFormData({
            ...formData,
            content: editorRef.current.getContent()
        });
    }
    // const log = () => {
    //     if (editorRef.current) {
    //         console.info(editorRef.current.getContent());
    //     }
    // }

    return (
        <div className="">
            <div className="flex justify-center mb-4">
                <PrimaryOutlineButton type='button' onClick={onSave}>儲存內容</PrimaryOutlineButton>
            </div>
            <Editor
                apiKey='9kaxgvy2pr9pkod5shlkh5vsgxsvd8ygpv7vs4p63qqqg3vl'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={content}
                //onEditorChange={onChange}
                init={{
                    height: 500,
                    menubar: false,
                    language: 'zh_TW',
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'wordcount', 'media mediaembed',
                        'emoticons', 'hr', 'insertdatetime', 'preview', 'textcolor',
                    ],
                    toolbar: 'undo redo | blocks |' +
                        'bold italic forecolor backcolor hr | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent emoticons | ' +
                        'removeformat | media code preview insertdatetime',
                    content_style: 'body { font-size:14px }',
                    skin: 'oxide-dark',
                    content_css: 'dark',
                    iframe_template_callback: (data) =>
                        `<iframe title="${data.title}" style='width:100%; aspect-ratio:16/9;' src="${data.source}"></iframe>`
                }}
            />
            <div className="flex justify-center mt-4">
                <PrimaryOutlineButton type='button' onClick={onSave}>儲存內容</PrimaryOutlineButton>
            </div>

            {/* <button className='bg-MyWhite' onClick={log}>Log editor content</button> */}
            {/* <Editor
                editorState={editorState}
                onEditorStateChange={setEditorState}
                editorStyle={{ 
                    background: '#111827', 
                    border: '1px solid #9db6dc',
                    color: '#ffffff',
                    height: '300px',
                    marginTop: '-5px',
                    padding: '10px',
                }}
                localization={{
                    locale: 'zh_tw',
                  }}
                toolbarStyle={{
                    // background: '#111827',
                    // borderBottom: '0px',
                }}
                wrapperStyle={{
                    background: '#ff0000',
                }}
                toolbar={{
                    embedded:{
                        embedCallback: embedVideoCallBack
                    }
                }}
            /> */}
        </div>
    )
    // render() {
    //     const { editorState } = this.state;
    //     return (
    //         <div className='h-[600px] boder border-gray-700 bg-gray-900'>
    //             <Editor
    //                 initialEditorState={editorState}
    //                 wrapperClassName='demo-wrapper'
    //                 editorClassName='demo-editor'                                                                                
    //                 onEditorStateChange={this.onEditorStateChange}
    //             />
    //         </div>
    //     )
    // }
}

    // const embedVideoCallBack = (link) =>{
    //     if (link.indexOf("youtube") >= 0){
    //         link = link.replace("watch?v=","embed/");
    //         link = link.replace("/watch/", "/embed/");
    //         link = link.replace("youtu.be/","youtube.com/embed/");
    //     }
    //     return link
    // }
