export {};
declare global {
  namespace Express {
    interface Request {
      user: {
        id: number;
        name: string;
        email: string;
        roles: string[];
        avatar?: string;
        cpf: string;
        tenure?: number;
        iat: number;
        exp: number;
        employeeId?: string;
        studentId?: string;
      };
    }
  }
}
