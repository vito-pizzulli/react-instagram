import PostCard from './PostCard';
import '../style.css';

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