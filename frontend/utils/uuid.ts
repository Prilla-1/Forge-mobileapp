import { View, Text } from 'react-native'
import React from 'react'

import * as Crypto from 'expo-crypto';

export async function generateUUID(): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40; // Version 4
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80; // Variant 10

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  const hex = Array.from(randomBytes).map(toHex).join('');

  return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20, 32)}`;
}
