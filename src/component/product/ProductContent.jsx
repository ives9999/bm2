import {Component} from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
export default class ProductContent extends Component{
    constructor(props) {
        super(props);
        this.state = {
        editorState: EditorState.createEmpty(),
        };
        
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }
  
    onEditorStateChange(editorState) {
        this.setState({editorState,});
    };
    render() {
        const { editorState } = this.state;
        return (
            <div className='h-[600px] boder border-gray-700 bg-gray-900'>
                <Editor
                    initialEditorState={editorState}
                    wrapperClassName='demo-wrapper'
                    editorClassName='demo-editor'                                                                                
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        )
    }
}
