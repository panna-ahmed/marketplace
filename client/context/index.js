import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const initialState = {
  user: null,
};

const Context = createContext();

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOGIN', payload: window.localStorage.getItem('user') });
  }, []);

  const router = useRouter();

  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      let res = err.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/logout')
            .then((data) => {
              console.log('401 error > logout');
              dispatch({ type: 'LOGOUT' });
              window.localStorage.removeItem('user');
              router;
            })
            .catch((err) => {
              console.log('Axios interceptor err', err);
              reject(err);
            });
        });
      }

      return Promise.reject(err);
    }
  );

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export { Context, Provider };
