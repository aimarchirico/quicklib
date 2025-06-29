import { Colors } from '@/globals/colors';
import { FontFamily } from '@/globals/fonts';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface BarcodeScannerProps {
  onBarCodeScanned: (data: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onBarCodeScanned, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(true);
  const [flashOn, setFlashOn] = useState(false);
  const colorScheme = useColorScheme();
  const styles = useMemo(() => makeStyles(colorScheme), [colorScheme]);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      if (!permission) return;
      
      if (!permission.granted) {
        const cameraPermission = await requestPermission();
        setHasPermission(cameraPermission.granted);
        
        if (!cameraPermission.granted) {
          Alert.alert(
            'Permission Required',
            'Camera permission is required to scan barcodes',
            [{ text: 'OK', onPress: onClose }]
          );
        }
      } else {
        setHasPermission(true);
      }
    })();
  }, [permission]);

  const handleBarCodeScanned = (scanningResult: { data: string, type: string }) => {
    if (scanning) {
      setScanning(false);
      const { data } = scanningResult;
      // Only handle ISBN format (numeric or X at the end)
      if (data.match(/^[0-9]+[0-9X]?$/)) {
        onBarCodeScanned(data);
      } else {
        Alert.alert(
          'Invalid Barcode',
          'Please scan a valid ISBN barcode',
          [{ text: 'Try Again', onPress: () => setScanning(true) }]
        );
      }
    }
  };

  const toggleFlash = () => {
    setFlashOn(!flashOn);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera</Text>
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['ean13'], // Most books use EAN-13 format for ISBN
        }}
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        enableTorch={flashOn}
      >
        <View style={styles.overlay} pointerEvents="box-none">
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.flashButton}
              onPress={toggleFlash}
            >
              <Ionicons
                name={flashOn ? "flash" : "flash-off"}
                size={24}
                color="white"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.scanArea} pointerEvents="box-none">
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>

          <View style={styles.instructions} pointerEvents="box-none">
            <Text style={styles.instructionText}>
              Align the barcode within the frame to scan
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const makeStyles = (colorScheme: 'light' | 'dark' | null) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50, 
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  flashButton: {
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: Colors.brand.green,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  instructions: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: Colors.brand.green,
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: FontFamily.bold
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BarcodeScanner;
