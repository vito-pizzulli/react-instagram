import { useAuth } from '../contexts/AuthContext';
import '../style.css';

function Post({username, location, image_url, description}) {
    const { serverUrl } = useAuth();

    return (
        <div className='post'>
            <a href={`/${username}`}>{username}</a>
            <p>{location}</p>
            <img src={`${serverUrl}${image_url}`} alt="Post Pic" />
            <p>{description}</p>
        </div>
    )
};

export default Post;