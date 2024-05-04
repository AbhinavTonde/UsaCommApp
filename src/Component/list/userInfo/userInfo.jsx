import { auth } from '../../../lib/firebase';
import { useUserStore } from '../../../lib/userStore'
import './UserInfo.css'
const UserInfo = () => {

  const {currentUser} = useUserStore();

  return (
    <div className='userInfo'>
        <div className="user">
            <img src={currentUser.avatar || "avatar.png"} alt="" />
            <h2>{currentUser.username}</h2>
        </div>
        {/* <div className="icons">
            <img src="./more.png" alt="" />
            <img src="./video.png" alt="" />
            <img src="./edit.png" alt="" />
        </div> */}

        <button className='logout' onClick={() => auth.signOut()}>Logout</button>

    </div>
  )
}

export default UserInfo