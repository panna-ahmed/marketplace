import { Menu } from 'antd';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import {
  AppstoreOutlined,
  LoginOutlined,
  UserAddOutlined,
  LogoutOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { Context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const { Item, SubMenu } = Menu;

const TopNav = () => {
  const [current, setCurrent] = useState('');

  const { state, dispatch } = useContext(Context);
  const { user } = state;
  const router = useRouter();

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('/api/logout');
    toast(data.message);
    router.push('/');
  };

  return (
    <Menu mode="horizontal" selectedKeys={[current]}>
      <Item
        key="/"
        icon={<AppstoreOutlined />}
        onClick={(e) => setCurrent(e.key)}
      >
        <Link href="/">
          <a>App</a>
        </Link>
      </Item>
      {user == null && (
        <>
          <Item
            key="/login"
            icon={<LoginOutlined />}
            onClick={(e) => setCurrent(e.key)}
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </Item>
          <Item
            key="/register"
            icon={<UserAddOutlined />}
            onClick={(e) => setCurrent(e.key)}
          >
            <Link href="/register">
              <a>Register</a>
            </Link>
          </Item>
        </>
      )}
      {user !== null && (
        <SubMenu
          icon={<CoffeeOutlined />}
          title={user.name}
          className="float-right"
        >
          <Item key="logout" onClick={logout} icon={<LogoutOutlined />}>
            Logout
          </Item>
        </SubMenu>
      )}
    </Menu>
  );
};

export default TopNav;
