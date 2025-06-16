import '../TiptapStyles.css';
import Tiptap from "../Tiptap";
import { useState } from "react";


export default function CreatePost() {


    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');



    return (
        <div className="create-post">
            <h1>Create New Post</h1>
            <form>
                <input type="title" placeholder={'Title'} required />
                <input type="sumamry" placeholder={'Summary'} required />
                <input type="file"/>
                <Tiptap value={content} />
                <button type="submit">Publish</button>
            </form>
        </div>
    );
}