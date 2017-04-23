import { UtilService } from './util.service';
import { TemplateService } from './template.service';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard';

export {
  UtilService,
  TemplateService,
  AuthService,
  AuthGuard
};

export const ALL_SERVICES: Array<any> = [
  UtilService,
  TemplateService,
  AuthService,
  AuthGuard
];
