// Importing necessary component.
import Post from './Post';

// Component function that encapsulates the UI for the posts container. It dynamically generates one post component for each element of the posts array.
function PostsContainer({posts}) {

    return (
        <div>
            {posts.map((post) => (
                <Post key={post.id} {...post} />
            ))}
        </div>
    )
};

export default PostsContainer;