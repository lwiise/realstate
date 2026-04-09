"use client";

import { createContext, useContext, useMemo, useState } from "react";

interface AdminUploadContextValue {
  pendingUploads: number;
  startUpload: () => void;
  finishUpload: () => void;
}

const AdminUploadContext = createContext<AdminUploadContextValue>({
  pendingUploads: 0,
  startUpload: () => {},
  finishUpload: () => {},
});

export function AdminUploadProvider({ children }: { children: React.ReactNode }) {
  const [pendingUploads, setPendingUploads] = useState(0);

  const value = useMemo<AdminUploadContextValue>(
    () => ({
      pendingUploads,
      startUpload: () => setPendingUploads((current) => current + 1),
      finishUpload: () =>
        setPendingUploads((current) => (current > 0 ? current - 1 : 0)),
    }),
    [pendingUploads]
  );

  return <AdminUploadContext.Provider value={value}>{children}</AdminUploadContext.Provider>;
}

export function useAdminUploads() {
  return useContext(AdminUploadContext);
}
