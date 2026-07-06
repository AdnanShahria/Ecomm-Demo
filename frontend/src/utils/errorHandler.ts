import toast from 'react-hot-toast';
import { useUIStore } from '../store/uiStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleApiError = (err: any, fallbackMsg: string) => {
  // Check for demo mode error (403 Forbidden or 401 Unauthorized with specific message)
  const isDemoError = 
    err?.isDemoMode || 
    err?.response?.status === 403 ||
    err?.response?.status === 401 ||
    (err?.response?.data?.message && (
      err?.response?.data?.message.includes("Demo Mode") ||
      err?.response?.data?.message.includes("API key")
    ));

  if (isDemoError) {
    // Show the full-screen demo mode modal
    useUIStore.getState().setShowDemoModeModal(true);
    return;
  }
  
  // For other errors, show a toast notification
  toast.error(fallbackMsg);
  console.error(fallbackMsg, err);
};
