import {useState, useEffect} from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import {convertToHTML} from 'draft-convert'
import draftToHtml from 'draftjs-to-html'

export default function ProductContent() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const [convertedContent, setConvertedContent] = useState(null)

    // const onChange = (state) => {
    //     setEditorState(state)
    //     convertRawToHTML()
    // }

    // const convertRawToHTML = () =>{
    //     let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    //     console.info(html)
    //     //let html = convertToHTML(editorState.getCurrentContent())
    //     setConvertedContent(html)
    // }
    // let html = ''
    // console.info(editorState.getCurrentContent())
    // let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    // console.info(html)
    // setConvertedContent(html)

    // const [convertedContent, setConvertedContent] = useState(null)

    useEffect(() => {
        let html = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        console.info(html)
        setConvertedContent(html)
    
    //     let html = convertToHTML(editorState.getCurrentContent())
    //     setConvertedContent(html)
    }, [editorState])
    // console.info(convertedContent)
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //     editorState: EditorState.createEmpty(),
    //     };
        
    //     this.onEditorStateChange = this.onEditorStateChange.bind(this);
    // }
  
    // onEditorStateChange(editorState) {
    //     this.setState({editorState,});
    // };
    return (
        <div className="App">
            <header className="text-MyWhite text-xl mb-6">
                Rich Text Editor Example
            </header>

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
