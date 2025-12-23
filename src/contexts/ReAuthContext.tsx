import React, { createContext, useContext, useState } from "react";
import { ReAuthModal } from "../components/admin/ReAuthModal";

interface ReAuthContextType {
  requestReAuth: (action: string) => Promise<string | null>;
  isReAuthModalOpen: boolean;
}

const ReAuthContext = createContext<ReAuthContextType | undefined>(undefined);

export const ReAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReAuthModalOpen, setIsReAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");
  const [resolvePromise, setResolvePromise] = useState<((token: string | null) => void) | null>(null);

  const requestReAuth = (action: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setPendingAction(action);
      setIsReAuthModalOpen(true);
      setResolvePromise(() => resolve);
    });
  };

  const handleReAuthSuccess = (token: string) => {
    setIsReAuthModalOpen(false);
    if (resolvePromise) {
      resolvePromise(token);
    }
    setPendingAction("");
    setResolvePromise(null);
  };

  const handleReAuthCancel = () => {
    setIsReAuthModalOpen(false);
    if (resolvePromise) {
      resolvePromise(null);
    }
    setPendingAction("");
    setResolvePromise(null);
  };

  return (
    <ReAuthContext.Provider value={{ requestReAuth, isReAuthModalOpen }}>
      {children}
      {isReAuthModalOpen && (
        <ReAuthModal
          action={pendingAction}
          onSuccess={handleReAuthSuccess}
          onCancel={handleReAuthCancel}
        />
      )}
    </ReAuthContext.Provider>
  );
};

export const useReAuth = () => {
  const context = useContext(ReAuthContext);
  if (!context) {
    throw new Error("useReAuth must be used within ReAuthProvider");
  }
  return context;
};