import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const {userInfo} = useContext(UserContext);
    const {id} = useParams();
    useEffect(() => {
        
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setPostInfo(postInfo);
                })
            });

    }   , []);


    if(!postInfo) {
        return <div className="loading-container">
            <div className="loading"></div>
            <p>Loading post...</p>
        </div>;
    }   

    return (

        <div className="post-page">
            {postInfo.cover && (
                <div className="image">
                    <img src={'http://localhost:4000/' + postInfo.cover} alt='Post Cover'/>
                </div>
            )}


            <div className="content">
                <h1>{postInfo.title}</h1>

                <div className="meta">
                    <div className="author">by @{postInfo.author.username}</div>
                    <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
                </div>

                <div dangerouslySetInnerHTML={{__html: postInfo.content}}></div>

                {userInfo?.id === postInfo.author._id && (
                    <div className="edit-row">
                        <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487a2.25 2.25 0 013.182 0l1.169 1.17a2.25 2.25 0 010 3.182l-9.19 9.19-3.182-3.182 9.19-9.19zM5.25 18h11.25m-11.25 0a2.25 2.25 0 01-2.25-2.25V6a2.25 2.25 0 012.25-2.25h11.25a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H5.25z" />
                            </svg>
                            Edit this post
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}