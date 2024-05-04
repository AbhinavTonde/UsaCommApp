import { useState } from 'react'
import './Login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from 'firebase/firestore'
import upload from '../../lib/Upload'
const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  })

  const [loading, setLoading] = useState(false)

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData(e.target)
    const { email, password } = Object.fromEntries(formData)

    try {

      await signInWithEmailAndPassword(auth, email, password);

    } catch (err) {
      console.log(err)
      toast.error(err.messagae)

    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData(e.target)
    const { userReg, emailReg, passwordReg } = Object.fromEntries(formData)
    console.log(userReg);

    try {
      const res = await createUserWithEmailAndPassword(auth, emailReg, passwordReg)

      const imgUrl = await upload(avatar.file)

      await setDoc(doc(db, "users", res.user.uid), {
        username: userReg,
        email: emailReg,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: []
      });

      toast.success("Account created! you can login now!");

    } catch (err) {
      console.log(err)
      toast.error(err.messagae)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome Back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" id="email" placeholder="Email" />
          <input type="password" name="password" id="pass" placeholder="Password" />
          <button disabled={loading}> {loading ? "Loading..." : "Log In"} </button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Register Here</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "avatar.png"} alt="" />
            <h4> Set Profile Picture</h4></label>
          <input type="file" id="file" style={{ 'display': 'none' }} onChange={handleAvatar} />
          <input type="text" name="userReg" placeholder='User Name' id="" />
          <input type="email" name="emailReg" id="emailReg" placeholder="Email" />
          <input type="password" name="passwordReg" id="passReg" placeholder="Password" />
          <button disabled={loading}>{loading ? "Loading..." : "Register"}</button>
        </form>
      </div>
    </div>
  )
}
export default Login