import { api, orFallback, type ServiceStatus } from './api';

/** Stan usług płatnych (wyłączniki w panelu); gdy API nie odpowiada – zakładamy, że działają */
export const getServiceStatus = () =>
  orFallback(api.serviceStatus(), { emails: true, maps: true, ratings: true } satisfies ServiceStatus);
