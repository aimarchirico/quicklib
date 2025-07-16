import config from '@/google-services.json';

const webConfig = {
  apiKey: config.client[0].api_key[0].current_key,
  authDomain: config.project_info.project_id + '.firebaseapp.com',
  projectId: config.project_info.project_id,
  storageBucket: config.project_info.storage_bucket,
  appId: config.client[0].client_info.mobilesdk_app_id,
};

export default webConfig;