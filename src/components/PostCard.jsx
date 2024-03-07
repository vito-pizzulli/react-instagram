import { useAuth } from '../contexts/AuthContext';
import '../style.css';

function PostCard({username, location, image_url, description}) {
    const { serverUrl } = useAuth();

    return (
        <div className='post-card'>
            <img src={`${serverUrl}${image_url}`} alt="Post Pic" />
        </div>
    )
};

export default PostCard;