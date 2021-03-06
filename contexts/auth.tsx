import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/auth";
import * as auth from "../services/auth";
import fb from "../services/firebase";

interface AuthContextData {
  signed: boolean;
  user: any | null | undefined;
  loading: boolean;
  signIn(cpf: string, senha: string): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export default AuthContext;

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null | undefined>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      setLoading(true);
      const storagedUser: string | null = await AsyncStorage.getItem("@mais-parceria:user");
      const storagedToken: string | null = await AsyncStorage.getItem("@mais-parceria:token");
      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
        setUser(JSON.parse(storagedUser));
        setLoading(false);
      }
    }
    loadStorageData();
  }, []);

  async function signIn(cpf: string, senha: string) {
    const response = await auth.signIn(cpf, senha);
    await fb.auth().signInWithCustomToken(response?.token);
    api.defaults.headers["Authorization"] = `Bearer ${response?.token}`;
    await AsyncStorage.setItem("@mais-parceria:user", JSON.stringify(response?.user));
    await AsyncStorage.setItem("@mais-parceria:token", String(response?.token));
    setUser(response?.user);
  }

  async function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
    await fb.auth().signOut();
    console.log(`Deslogou`);
  }
  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
