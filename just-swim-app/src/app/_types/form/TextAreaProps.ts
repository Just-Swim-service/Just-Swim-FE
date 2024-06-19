import { ChangeEvent } from "react";

export interface TextAreaProps {
  name: string;
  height?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}