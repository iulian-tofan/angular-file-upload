export enum MaterialTooltipPosition {
  Above = 'above',
  Below = 'below',
  Left = 'left',
  Right = 'right',
  Before = 'before',
  After = 'after',
}

interface TooltipConfig {
  text: string;
  class: string;
  position: MaterialTooltipPosition;
  hideDelay: string;
}

interface ReplaceTexts {
  selectFiles?: string;
  maximumFilesCountWarning?: string;
  fileUploadError?: string;
  fileUploadInvalidExtentionError?: string;
}

export interface FileUploaderConfig {
  theme: string;
  multiple?: boolean;
  selectable?: boolean;
  fileDropDisabled?: boolean;
  multipleSelection?: boolean;
  accept?: string;
  maxSize: number;
  maxFileCount?: number;
  tooltip?: TooltipConfig;
  replaceTexts?: ReplaceTexts;
}
