import Post from './Post';
import '../style.css';

function PostsContainer({posts}) {

    return (
        <div className='posts-container'>
            {posts.map((post) => (
                <Post key={post.id} {...post} />
            ))}
        </div>
    )
};

export default PostsContainer;