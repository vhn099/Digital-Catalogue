import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseCookies } from 'nookies';


 const WithAuth = (Component:NextPage) => {

  const AuthenticatedComponent = () => {
      const router = useRouter();
      
      const cookies = parseCookies();
      const userCookies = !cookies.digital_user_cookies ? false : JSON.parse(cookies.digital_user_cookies)
      
      const [ isAuth, setIsAuth ] = useState(false)
      
      useEffect(() => {

          const getUser = async () => {
              if (!userCookies) {
                router.push('/login');
              } else {
                setIsAuth(true)
              }
          };
          getUser();
      }, [userCookies, router]);

      return !!isAuth ? <Component /> : null; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};

export default WithAuth;