export interface DeviceRegisterDto {
  userId: string;
  deviceId: string;
  deviceName: string;
}

export interface LimitChangeDto {
  userId: string;
  newLimit: number;
}

export interface BruteForceDto {
  userId: string;
  attempts: number;
}
