import '../TiptapStyles.css';
import Tiptap from "../Tiptap";
import { useState } from "react";
import { Navigate } from 'react-router-dom';


export default function CreatePost() {


    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);


    async function createNewPost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

   

        const response = await fetch('http://localhost:4000/post', {
            method: 'POST',
            body: data,
            credentials: 'include',
    
        });

        if(response.ok) {
            setRedirect(true);
        }
    }

    if (redirect) { 
        return <Navigate to={'/'} />
    }
    return (
        <div className="create-post">
            <h1>Create New Post</h1>
            <form onSubmit={createNewPost}>
                <input type="title" 
                    placeholder={'Title'}  
                    value={title} 
                    onChange={e => setTitle(e.target.value)} required />
                <input type="summary" 
                    placeholder={'Summary'} 
                    value={summary} 
                    onChange={e => setSummary(e.target.value)} required />
                <input type="file" 
                    onChange={e => setFiles(e.target.files)} />
                <Tiptap value={content} 
                    onChange={setContent} />
                <button type="submit">Publish</button>
            </form>
        </div>
    );
}