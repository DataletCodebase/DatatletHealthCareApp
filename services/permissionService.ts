import { Camera } from 'expo-camera';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { Linking, Platform } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'blocked';

export interface AppPermissionsState {
  location: PermissionStatus;
  camera: PermissionStatus;
  storage: PermissionStatus;
}

class PermissionService {
  private hasAskedThisSession = false;

  /**
   * Checks the current status of all required permissions.
   */
  async getPermissionsState(): Promise<AppPermissionsState> {
    const location = await Location.getForegroundPermissionsAsync();
    const camera = await Camera.getCameraPermissionsAsync();
    const media = await MediaLibrary.getPermissionsAsync();

    return {
      location: this.mapStatus(location),
      camera: this.mapStatus(camera),
      storage: this.mapStatus(media),
    };
  }

  private mapStatus(permission: any): PermissionStatus {
    if (permission.status === 'granted') return 'granted';
    if (permission.status === 'denied') {
      return permission.canAskAgain ? 'denied' : 'blocked';
    }
    return 'undetermined';
  }

  /**
   * Requests missing permissions one by one.
   * Only triggers once per app session for the proactive Home Page check.
   */
  async requestMissingSequentially(force: boolean = false): Promise<void> {
    if (this.hasAskedThisSession && !force) {
      console.log('[PermissionService] Already asked this session, skipping proactive check.');
      return;
    }

    if (!force) {
      this.hasAskedThisSession = true;
    }

    console.log('[PermissionService] Starting sequential permission request...');

    // 1. Location
    const loc = await Location.getForegroundPermissionsAsync();
    if (loc.status !== 'granted' && loc.canAskAgain) {
      console.log('[PermissionService] Requesting Location...');
      await Location.requestForegroundPermissionsAsync();
    }

    // 2. Camera
    const cam = await Camera.getCameraPermissionsAsync();
    if (cam.status !== 'granted' && cam.canAskAgain) {
      console.log('[PermissionService] Requesting Camera...');
      await Camera.requestCameraPermissionsAsync();
    }

    // 3. Storage (Media Library)
    const media = await MediaLibrary.getPermissionsAsync();
    if (media.status !== 'granted' && media.canAskAgain) {
      console.log('[PermissionService] Requesting Media Library...');
      await MediaLibrary.requestPermissionsAsync();
    }
  }

  /**
   * Requests a specific permission on-demand.
   * If blocked, encourages user to open settings.
   */
  async requestOnDemand(type: 'location' | 'camera' | 'storage'): Promise<PermissionStatus> {
    let result;
    switch (type) {
      case 'location':
        result = await Location.requestForegroundPermissionsAsync();
        break;
      case 'camera':
        result = await Camera.requestCameraPermissionsAsync();
        break;
      case 'storage':
        result = await MediaLibrary.requestPermissionsAsync();
        break;
    }

    const status = this.mapStatus(result);
    if (status === 'blocked') {
      this.openSettings();
    }
    return status;
  }

  /**
   * Opens the app settings screen.
   */
  openSettings() {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      IntentLauncher.startActivityAsync(IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS, {
        data: 'package:com.anonymous.DataletHealthcareApp', // Use the package name from app.json
      });
    }
  }

  resetSessionCheck() {
    this.hasAskedThisSession = false;
  }
}

export const permissionService = new PermissionService();
