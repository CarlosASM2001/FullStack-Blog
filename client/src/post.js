import {formatISO9075} from 'date-fns';
import { Link } from 'react-router-dom';

export default function Post({_id,title, summary, cover, content,createdAt, author}){





    return (
        <div className='post'>
            <div className='image'>
                <Link to={`/post/${_id}`}>
                    <img src={'http://localhost:4000/'+cover} alt=''/>
                </Link>
            </div>
            <div className='texts'>
                <Link to={`/post/${_id}`} className='title'>
                    <h2>{title}</h2>
                </Link>
                <p className='info'>
                    <span className='author'>{author.username}</span>
                    <time>{formatISO9075(createdAt)}</time>
                </p>
                <p className='summary'>
                    {summary}
                </p>
            </div>
        </div>

    );
}