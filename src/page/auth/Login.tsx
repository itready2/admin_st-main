import Styles from './Login.module.scss'
import SvgImg from '../../assets/undraw_file_sync_ot38.svg'
import minilogo from '/minilogo.png'
import { useState } from 'react';
import { MdOutlineMail, MdOutlineLock } from "react-icons/md";
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

interface LoginFormState {
  email: string;
  password: string;
}

const Login = () => {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormState>({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData.email, formData.password).then(() => Swal.fire({
      icon: "success",
      title: "Success",
      text: "Login Success",
    }).then(() => { navigate('/') }))
      .catch(() => Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      }))
  };

  return (
    <main className={Styles.backgroud}>
      <div className={Styles.container}>
        <img src={minilogo} alt="minilogo" className={Styles.logo} />
        <span className={Styles.head}>Sign In to <b>St.Carlos Next</b></span>
        <form onSubmit={handleSubmit} className={Styles.FromLayout}>
          <div className={Styles.InputFrom}>
            <label htmlFor="email"><MdOutlineMail /></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder='Email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={Styles.InputFrom}>
            <label htmlFor="password"><MdOutlineLock /></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder='password'
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className={Styles.submit}>Login</button>
        </form>
      </div>
      <div className={Styles.container}>
        <img src={SvgImg} alt="" className={Styles.image} />
      </div>
    </main>
  )
}

export default Login
