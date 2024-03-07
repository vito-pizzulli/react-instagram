import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style.css';

function PostCard({image_url, username, slug}) {
    const { serverUrl } = useAuth();

    return (
        <div className='post-card'>
            <Link to={`/${username}/${slug}`}><img src={`${serverUrl}${image_url}`} alt="Post Pic" /></Link>
        </div>
    )
};

export default PostCard;