export interface ConfirmButtonProps {
  text: string;
  kind: 'confirm' | 'confirm-sub' | 'cancel' | 'cancel-sub' | 'normal';
  border?: boolean;
  loading?: string;
  active?: boolean;
}