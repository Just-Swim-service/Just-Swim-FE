'use server';

import { Fetch } from '@utils';

export async function getQRCode(lectureId: number) {
  try {
    const result = await Fetch<{
      success: boolean;
      message: string;
      data: {
        qrCode: string; // Base64 Data URL
      };
    }>({
      url: `${process.env.NEXT_PUBLIC_API_URL}/lecture/${lectureId}/qr-code`,
      header: {
        json: true,
        credential: true,
      },
    });

    if (result.success) {
      return result.data.qrCode;
    } else {
      throw new Error(result.message || 'QR 코드를 불러올 수 없습니다.');
    }
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    throw error;
  }
}

