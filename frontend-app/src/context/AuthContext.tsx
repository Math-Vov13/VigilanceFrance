"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { tokenService } from "@/services/tokenService";
import { UserLogin, UserRegistration, User } from "@/types/user";

const API_URL = process.env.NEXT_PUBLIC_API_AUTH_URL || "http://localhost:8000/api";


type AuthContextType = {
    profile: User;
    loading: boolean;
    getProfile: () => Promise<number>;
    loginUser: (form: UserLogin) => Promise<number>;
    registerUser: (form: UserRegistration) => Promise<number>;
    logout: () => Promise<number>;
    refreshCredentials: () => Promise<number>;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("useAuth must be used within a AuthProvider");
    }

    return authContext;
}


export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [profile, setProfile] = useState<User>({
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        profileImage: undefined,
    });

    // useLayoutEffect(() => {
    //     if (token) {
    //         localStorage.setItem("authToken", token)
    //     } else {
    //         setToken(localStorage.getItem("authToken"))
    //         setProfile(null)
    //     }

    //     const authInterceptor = api.interceptors.request.use((config) => {
    //         console.log("Nouvelle requête !")
    //         config.headers.Authorization = !config._retry && token ? `Bearer ${token}` : config.headers.Authorization;
    //         return config;
    //     })

    //     return () => {
    //         api.interceptors.request.eject(authInterceptor);
    //     }
    // }, [token]);

    // useEffect(() => {
    //     const fetchMe = async () => {
    //         try {
    //             const { name, value } = await api.get("/users/profile");

    //             // setToken(response.data.token);
    //             console.log(name, value)
    //             setProfile({
    //                 ...profile,
    //                 [name]: value
    //             })
    //             console.log("New Profile:", profile)
    //         } catch {
    //             setToken(null);
    //             setProfile(null);
    //             setNewConnection(null);
    //         }
    //     }

    //     console.log("New Token set !", token)
    //     if (token) {
    //         fetchMe();
    //     }
    // }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            // Check if the user is already authenticated
            const token = tokenService.getRefreshToken();
            if (!token) {
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }

            const status = await getProfile();
            if (status === 200) {
                setLoading(false);
                setIsAuthenticated(true);
            } else {
                setLoading(false);
                console.log("Failed to fetch profile");
            }
        };

        initializeAuth();
    }, []);

    const getProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/account/profile`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in the request
            });

            console.log("Registration response:", response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            setProfile({
                id: data._id,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                profileImage: undefined,
            })
            return response.status;

        } catch (error) {
            console.log("Failed to fetch profile:", error);

            setIsAuthenticated(false);
            setProfile({
                id: "",
                email: "",
                firstName: "",
                lastName: "",
                profileImage: undefined,
            });
            tokenService.clearRefreshToken(); // Remove the token

            return 400;
        }
    }

    async function loginUser(form: UserLogin) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
                credentials: 'include', // Include cookies in the request
            });

            console.log("Login response:", response.status, response.statusText);

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            tokenService.setRefreshToken(data._rft); // Store the token
            setIsAuthenticated(true);
            setProfile({
                id: data.user,
                email: data.email,
                firstName: "",
                lastName: "",
                profileImage: undefined,
            })
            return response.status;

        } catch (error) {
            console.log("Login failed:", error);
            return 400;
            
        }
    }

    async function registerUser(form: UserRegistration) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form),
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            const data = await response.json();
            tokenService.setRefreshToken(data._rft); // Store the token
            setIsAuthenticated(true);
            setProfile({
                id: data.user,
                email: data.email,
                firstName: "",
                lastName: "",
                profileImage: undefined,
            })
            return response.status;

        } catch (error) {
            console.log("Registration failed:", error);
            return 400;

        }
    }

    async function logout() {
        try {
            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenService.getRefreshToken()}`,
                },
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error("Logout failed");
            }
            return response.status;

        } catch(error) {
            console.log("Logout failed:", error);
            return 400;

        } finally {
            setIsAuthenticated(false);
            tokenService.clearRefreshToken(); // Remove the token
            setProfile({
                id: "",
                email: "",
                firstName: "",
                lastName: "",
                profileImage: undefined,
            });
        }
    }

    async function refreshCredentials() {
        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenService.getRefreshToken()}`,
                },
                credentials: 'include', // Include cookies in the request
            });

            if (!response.ok) {
                throw new Error("Refresh failed");
            }

            setIsAuthenticated(false);
            setProfile({
                id: "",
                email: "",
                firstName: "",
                lastName: "",
                profileImage: undefined,
            });
            return response.status;
        } catch(error) {
            console.log("Refresh failed:", error);
            return 400;
        }
    }

    return (
        <AuthContext.Provider value={{ profile, loading, getProfile, loginUser, registerUser, logout, refreshCredentials, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}