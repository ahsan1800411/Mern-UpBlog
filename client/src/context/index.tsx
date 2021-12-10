import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

interface User {
  data: {
    id: string;
    email: string;
    customerStripeId: string;
  } | null;
  error: string | null;
  loading: boolean;
}

const UserContext = createContext<
  [User, React.Dispatch<React.SetStateAction<User>>]
>([{ data: null, error: null, loading: true }, () => {}]);

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>({
    data: null,
    error: null,
    loading: true,
  });

  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
  }

  const fetchUser = async () => {
    const { data } = await axios.get('http://localhost:8080/auth/me');
    if (data.data && data.data.user) {
      setUser({
        data: {
          id: data.data.user.id,
          email: data.data.user.email,
          customerStripeId: data.data.user.customerStripeId,
        },
        loading: false,
        error: null,
      });
    } else if (data.data && data.data.errors.length) {
      setUser({
        data: null,
        loading: false,
        error: data.errors[0].msg,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setUser({ loading: false, data: null, error: null });
    }
  }, []);
  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
