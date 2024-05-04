import { useEffect, useRef, useState } from 'react'
import './Chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useChatStore } from '../../lib/chatStore'
import { db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/Upload'

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpenEmojiPanel] = useState(false)
  const [text, setTextMsg] = useState("")
  const [img, setImg] = useState({ file: null, url: "" })
  const endRef = useRef(null)

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
  const { currentUser } = useUserStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  })

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", chatId),
      (res) => {
        setChat(res.data())
      })

    return () => {
      unSub()
    }
  }, [chatId])

  const handleEmoji = (e) => {
    console.log(e);
    setTextMsg(prev => prev + e.emoji)
  }

  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {

      if (img.file) {
        imgUrl = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        })
      })

      const userIds = [currentUser.id, user.id]

      userIds.forEach(async (id) => {

        const userChatsRef = doc(db, "userchats", id)
        const userChatsSnapshot = await getDoc(userChatsRef)

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data()

          const chatIndex = userChatsData.chats.findIndex(c => c.chatId == chatId)

          userChatsData.chats[chatIndex].lastMessage = text
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,

          })

        }
      })

    } catch (error) {
      console.log(error);
    } finally {

      setImg({
        file: null,
        url: ""
      })

      setTextMsg("")
    }
  }

  return (
    <div className='chat'>

      <div className="top">
        <div className="user">
          <img src={user?.avatar || "avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            {/* <p>Lorem ipsum dolor sit amet. </p> */}
          </div>
        </div>
        {/* <div className="icons">
          <img src="phone.png" alt="" />
          <img src="video.png" alt="" />
          <img src="info.png" alt="" />
        </div> */}
      </div>

      <div className="center">

        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createAt}>
            <div className="texts">
              {message.img && <img src={message.img} alt="" />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {img.url && (<div className="message own">
          <div className="texts">
            <img src={img.url} alt="" />
          </div>
        </div>)}
        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        {/* <div className="icons">
          <label htmlFor="file">
            <img src="img.png" alt="" />
          </label>
          <input type="file" name="" id="file" style={{ display: "none" }} onChange={handleImage} />
          <img src="camera.png" alt="" />
          <img src="mic.png" alt="" />
        </div> */}
        <input
          type="text"
          placeholder='Type a message'
          value={text}
          onChange={e => { setTextMsg(e.target.value) }}/>
        <div className="emoji">
          <img src="emoji.png" alt="" onClick={() => setOpenEmojiPanel(!open)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className='sendButton' 
        onClick={handleSend}>Send</button>
      </div>

    </div>
  )
}

export default Chat