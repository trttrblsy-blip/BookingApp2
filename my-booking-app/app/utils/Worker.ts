import { worker_role } from '../../generated/prisma/enums';
export interface Worker {
  personId: number;
  role:  worker_role;
  nickName: string;     
  password: string;       
}

