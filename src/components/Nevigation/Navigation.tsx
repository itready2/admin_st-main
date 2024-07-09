import { AppstoreOutlined, HomeOutlined } from '@ant-design/icons';
import { BiNews } from "react-icons/bi";
import { AiOutlineProduct } from "react-icons/ai";
import { FaUserDoctor } from "react-icons/fa6";
import { RiContactsBook3Line, RiLogoutBoxLine } from "react-icons/ri";
import { PiFlagBannerBold } from "react-icons/pi";


import Styles from './Navigation.module.scss'
import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import logo from '../../assets/logo.jpg'
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MdOutlineImage } from 'react-icons/md';
import { HiMiniComputerDesktop } from 'react-icons/hi2';

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
  {
    key: '/',
    label: 'Home',
    icon: <HomeOutlined />,
  },
  {
    key: 'menu',
    label: 'Menu',
    icon: <AppstoreOutlined />,
    children: [
      { key: '/promotion', label: 'Promotion', icon: <AiOutlineProduct /> },
      { key: '/health-info', label: 'Health info', icon: <BiNews /> },
      { key: '/news', label: 'News', icon: <BiNews /> },
      { key: '/banner', label: 'Banner', icon: <PiFlagBannerBold /> },
      { key: '/doctor', label: 'Doctor', icon: <FaUserDoctor /> },
    ],
  },
  {
    key: 'page',
    label: 'Page Editor',
    icon: <HiMiniComputerDesktop />,
    children: [
      { key: '/page/check-up', label: 'Check-up Center' },
      { key: '/page/emergency', label: 'Emergency' },
      { key: '/page/pediatric', label: 'Pediatric 24H' },
      { key: '/page/women-health', label: `Women's Health Center` },
      { key: '/page/surgery', label: 'General Surgery Clinic' },
      { key: '/page/hemodialysis', label: 'Hemodialysis Center' },
      { key: '/page/brain-center', label: 'Brain and Nervous System Disorders Center' },
      { key: '/page/dental', label: 'Dental Clinic' },
      { key: '/page/ent', label: 'ENT Clinic' },
      { key: '/page/geriatric', label: 'Geriatric Clinic' },
      { key: '/page/aesthetic-surgery', label: 'Aesthetic Surgery Center' },
      { key: '/page/orthopedic', label: 'Orthopedic and Joint Surgery Clinic' },
      { key: '/page/therapy', label: 'Physical Therapy Clinic' },
      { key: '/page/dermatology', label: 'Dermatology Clinic' },
      { key: '/page/st_carlos_recc', label: 'St.Carlos RECC' },
      { key: '/page/St_CarlosMedicalSpa', label: 'St. Carlos Medical Spa' },
    ],
  },
  {
    key: '/contact',
    label: 'Contact',
    icon: <RiContactsBook3Line />,
  },
  {
    key: '/gallery',
    label: 'Gallery',
    icon: <MdOutlineImage />,
  },
  {
    key: 'logout',
    label: 'Logout',
    icon: <RiLogoutBoxLine />,
  },
];

const Navigation: React.FC = () => {

  const { logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation().pathname;

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    if (e.key === 'logout') {
      logout();
    } else {
      navigate(e.key);
    }
  };

  return (
    <nav className={Styles.container}>
      <img src={logo} alt="logo" />
      <Menu
        className={Styles.menu}
        onClick={onClick}
        defaultSelectedKeys={[location]}
        mode="inline"
        items={items}
      />
    </nav>

  );
};

export default Navigation;