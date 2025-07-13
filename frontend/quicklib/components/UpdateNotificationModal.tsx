import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import Constants from 'expo-constants';
import ConfirmationModal from './ConfirmationModal';

interface UpdateInfo {
  hasUpdate: boolean;
  latestVersion?: string;
  currentVersion?: string;
  releaseUrl?: string;
  updated?: string;
}

interface UpdateNotificationModalProps {
}

const UpdateNotificationModal: React.FC<UpdateNotificationModalProps> = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo>({ hasUpdate: false });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get current version from Expo config
  const currentVersion = Constants.expoConfig?.version;

  const checkForUpdates = async () => {
    try {
      const response = await fetch(Constants.expoConfig?.extra?.releaseUrl);
      const text = await response.text();
      
      // Parse XML using regex (simple approach for RSS feed)
      const entryMatch = text.match(/<entry[^>]*>(.*?)<\/entry>/s);
      
      if (entryMatch) {
        const entryContent = entryMatch[1];
        
        // Extract title
        const titleMatch = entryContent.match(/<title[^>]*>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1].trim() : null;
        
        // Extract link href
        const linkMatch = entryContent.match(/<link[^>]*href="([^"]*)"[^>]*>/);
        const link = linkMatch ? linkMatch[1] : null;
        
        // Extract updated date
        const updatedMatch = entryContent.match(/<updated[^>]*>(.*?)<\/updated>/);
        const updated = updatedMatch ? updatedMatch[1] : null;
        
        // Extract version number from title
        const latestVersion = title;
        
        if (latestVersion && latestVersion !== currentVersion) {
          setUpdateInfo({
            hasUpdate: true,
            latestVersion,
            currentVersion,
            releaseUrl: link || '',
            updated: updated || undefined
          });
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  const handleOpenRelease = async () => {
    if (updateInfo.releaseUrl) {
      setLoading(true);
      try {
        await Linking.openURL(updateInfo.releaseUrl);
      } catch (error) {
        console.error('Failed to open release URL:', error);
      } finally {
        setLoading(false);
        setShowModal(false);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // Check for updates when component mounts
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 2000); // Delay 2 seconds to avoid blocking app startup

    return () => clearTimeout(timer);
  }, [currentVersion]);

  if (!updateInfo.hasUpdate) return null;

  return (
    <ConfirmationModal
      visible={showModal}
      onClose={handleClose}
      onConfirm={handleOpenRelease}
      title="🚀 Update Available!"
      message={`Version ${updateInfo.latestVersion} is available. \n\nWould you like to view the release notes to dowload update?`}
      confirmText="View Release"
      showCancelButton={true}
      loading={loading}
    />
  );
};

export default UpdateNotificationModal;
