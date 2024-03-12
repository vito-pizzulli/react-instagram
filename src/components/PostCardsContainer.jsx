import PostCard from './PostCard';

function PostCardsContainer({postCards}) {

    return (
        <div className='post-cards-container'>
            {postCards.map((postCard) => (
                <PostCard key={postCard.id} {...postCard} />
            ))}
        </div>
    )
};

export default PostCardsContainer;