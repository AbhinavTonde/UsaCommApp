import { useEffect, useState } from 'react';
import Chat from './Component/chat/Chat.jsx'
// import Detail from './Component/detail/detail.jsx'
import List from './Component/list/list.jsx'
import Login from './Component/login/Login.jsx';
import Notification from './Component/notification/notification.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase.js';
import { useUserStore } from './lib/userStore.js';
import { useChatStore } from './lib/chatStore.js';

const App = () => {

  const {currentUser,isLoading,fetchUserInfo} = useUserStore()
  const {chatId} = useChatStore()

  useEffect(()=>{
    const unSub = onAuthStateChanged(auth, (user)=>{
      fetchUserInfo(user?.uid)
    });

    return ()=>{
      unSub();
    }

  },[fetchUserInfo])

  if(isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {/* {chatId && <Detail />} */}
        </>
      ) : (
        <Login/>
      )}
      <Notification/>
    </div>
  )
}

export default App