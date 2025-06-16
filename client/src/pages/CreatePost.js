export default function CreatePost() {
    return (
        <div className="create-post">
            <h1>Create New Post</h1>
            <form>
                <input type="title" placeholder={'Title'} required />
                <input type="sumamry" placeholder={'Summary'} required />
                <input type="file"/>
                <textarea type="content" placeholder={'content'} required></textarea>
                <button type="submit">Publish</button>
            </form>
        </div>
    );
}