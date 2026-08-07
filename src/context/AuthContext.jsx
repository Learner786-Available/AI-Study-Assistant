import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [token, setToken] = useState(

        localStorage.getItem("token") || ""

    );

    useEffect(() => {

        const storedUser = localStorage.getItem("user");

        if (storedUser) {

            setUser(JSON.parse(storedUser));

        }

    }, []);

    useEffect(() => {

    const fetchProfile = async () => {

        if (!token) return;

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (data.success) {

                setUser(data.user);

                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

            }

        }

        catch (err) {

            console.error(err);

        }

    };

    fetchProfile();

}, [token]);

    const login = (userData, jwtToken) => {

        setUser(userData);

        setToken(jwtToken);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        localStorage.setItem(
            "token",
            jwtToken
        );

    };

    const logout = () => {

        setUser(null);

        setToken("");

        localStorage.removeItem("user");

        localStorage.removeItem("token");

    };

    const updateUser = (newUser) => {

    setUser(newUser);

    localStorage.setItem(
        "user",
        JSON.stringify(newUser)
    );

};

    return (

        <AuthContext.Provider

            value={{

                user,

                setUser,

                token,

                login,

                logout,

                updateUser

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}