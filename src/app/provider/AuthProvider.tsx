"use client"
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { constants } from "../constants";
import { useRouter } from "next/navigation";

const AppContext = createContext({
    user: {},
    setUser: (user: any) => {}
});

export const useAppContext = () => {
    const context = useContext(AppContext);

    return context;
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUserSession = async () => {
          await axios.get(constants.AUTH, {
            params: {
              type: 'getSession'
            }
          }).then(response => {
            if (!response.data.data) {
              router.push('/login');
            } else {
                console.log(response.data.data);
                setUser(response.data.data.user);
            }
          });
        };
        checkUserSession();
      }, [router]);

    return (
        <AppContext.Provider value={{ user, setUser }}>
            {children}
        </AppContext.Provider>
        
    );
}