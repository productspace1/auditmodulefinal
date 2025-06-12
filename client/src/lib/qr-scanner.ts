// Mock QR scanner implementation
// In a real app, you would use a library like @zxing/library or html5-qrcode

export async function scanQRCode(canvas: HTMLCanvasElement): Promise<string | null> {
  // Simulate QR code scanning delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock QR scan results - in real implementation, this would decode the actual QR code
  const mockSerialNumbers = ['BAT-2024-001', 'CHG-2024-002', 'SOC-2024-003'];
  const randomSerial = mockSerialNumbers[Math.floor(Math.random() * mockSerialNumbers.length)];
  
  // Simulate 80% success rate
  return Math.random() > 0.2 ? randomSerial : null;
}

export function isQRScanningSupported(): boolean {
  return 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
}
