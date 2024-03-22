// Importing necessary component.
import PostCard from './PostCard';

// Component function that encapsulates the UI for the post cards container. It dynamically generates one post card component for each element of the postCards array.
function PostCardsContainer({postCards}) {

    return (
        <div className='postCardsContainer row justify-content-start'>
            {postCards.map((postCard) => (
                <PostCard key={postCard.id} {...postCard} />
            ))}
        </div>
    )
};

export default PostCardsContainer;