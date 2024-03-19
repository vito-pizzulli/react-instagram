import PostCard from './PostCard';

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