import { createContext, useContext, useState } from "react";

const OwnerAuthContext = createContext<{
  authorized: boolean;
  setAuthorized: (v: boolean) => void;
}>({ authorized: false, setAuthorized: () => {} });

export function OwnerAuthProvider({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(
    () => sessionStorage.getItem("ownerAccess") === "true",
  );
  return (
    <OwnerAuthContext.Provider value={{ authorized, setAuthorized }}>
      {children}
    </OwnerAuthContext.Provider>
  );
}

export function useOwnerAuth() {
  return useContext(OwnerAuthContext);
}
