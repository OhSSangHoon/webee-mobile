import { useMutation } from '@tanstack/react-query';
import { uploadProfileImage, withdrawUser } from '../api';

export function useUploadProfileImage() {
  return useMutation({
    mutationFn: (imageUri: string) => uploadProfileImage(imageUri),
  });
}

export function useWithdrawUser() {
  return useMutation({
    mutationFn: () => withdrawUser(),
  });
}
