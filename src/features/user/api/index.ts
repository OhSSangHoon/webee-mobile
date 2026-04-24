import { api } from '@/lib/api';

interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

export async function uploadProfileImage(imageUri: string): Promise<string> {
  const formData = new FormData();
  const filename = imageUri.split('/').pop() ?? 'profile.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', { uri: imageUri, name: filename, type } as any);

  const response = await api.put<ApiResponse<{ profileImageUrl: string }>>(
    '/api/v1/users/profile-image',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data.data.profileImageUrl;
}
