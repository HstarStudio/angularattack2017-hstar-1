import { WdTranslate } from './WdTranslate';
import { WdAjax } from './WdAjax';
import { WdEventBus } from './WdEventBus';
import { WdAlert } from './WdAlert';

export {
  WdTranslate,
  WdAjax,
  WdEventBus,
  WdAlert
};

export const SHARED_SERVICES = [
  WdTranslate,
  WdAjax,
  WdEventBus,
  WdAlert
];
