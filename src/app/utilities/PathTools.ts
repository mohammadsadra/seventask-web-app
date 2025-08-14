import { environment } from 'src/environments/environment';

export const DomainName = environment.production
  ? 'https://api.seventask.com'
  : 'https://localhost:44303';

// : 'https://test-api.seventask.com';
