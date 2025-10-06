import React, { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext();

export function AuthProvider({children}) {
  const [user, setUser] = useState(null);

  useEffect(()=> {
    fetch(process.env.REACT_APP_API_URL + '/api/auth/me', {
      credentials: 'include'
    }).then(r => r.ok ? r.json() : null)
      .then(data => setUser(data))
      .catch(()=> setUser(null));
  }, []);

  return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>
}
