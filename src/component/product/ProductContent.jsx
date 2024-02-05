import {useState, useEffect, useRef} from 'react'
import { EditorState, convertToRaw, convertFromHTML, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import {convertToHTML} from 'draft-convert'
import draftToHtml from 'draftjs-to-html'

export default function ProductContent({
    formData,
    setFormData,
}) {
    let bInit = useRef(false)
    const {content} = formData
    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty()
    )

    useEffect(() => {
        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        setFormData({
            ...formData,
            content: html
        })
        if (content !== undefined && content !== null && content.length > 0 && !bInit.current) {
            bInit.current = true
            setEditorState(EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(content))))
        }    
    }, [content, editorState])
    return (
        <div className="">
            <Editor
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
                toolbarStyle={{
                    // background: '#111827',
                    // borderBottom: '0px',
                }}
                wrapperStyle={{
                    background: '#ff0000',
                }}
            />
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
