import { useEffect, useState } from "react";
import { Navigate,useParams } from "react-router-dom";
import Tiptap from "../Tiptap";



export default function EditPost() {
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();


    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setSummary(postInfo.summary);
                    setContent(postInfo.content);
                })
            });
    }, [id]);

    async function updatePost(e) {
        e.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);

        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        
        const response = await fetch('http://localhost:4000/post', {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });

        if(response.ok) {
            setRedirect(true);
        }

        
    }


    if (redirect) { 
        return <Navigate to={'/post/'+id} />
    }
    return (
        <div className="create-post">
            <h1>Update Post</h1>
            <form onSubmit={updatePost}>
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
                <button type="submit">Update Post</button>
            </form>
        </div>
    );


}
