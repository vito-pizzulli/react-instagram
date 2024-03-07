import { useAuth } from '../contexts/AuthContext';
import moment from 'moment';
import 'moment/locale/it';
import '../style.css';

function Post({username, location, image_url, description, created_at}) {
    const { serverUrl } = useAuth();

    function formatDate(date) {
        moment.locale('it');
        return moment(date).format('D MMMM YYYY');
    };

    const formattedDate = formatDate(created_at);

    return (
        <div className='post'>
            <a href={`/${username}`}>{username}</a>
            <p>{location}</p>
            <img src={`${serverUrl}${image_url}`} alt="Post Pic" />
            <p>{formattedDate}</p>
            <p>{description}</p>
        </div>
    )
};

export default Post;