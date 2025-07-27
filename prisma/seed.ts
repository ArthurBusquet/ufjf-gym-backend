import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar o banco de dados (cuidado em produção!)
  await prisma.physicalAssessment.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.student.deleteMany();
  await prisma.person.deleteMany();

  // Criar pessoas (usuários)
  const password = await hash('123456', 8);

  const people = await prisma.person.createMany({
    data: [
      // Admin
      {
        name: 'Admin Master',
        email: 'admin@academia.com',
        cpf: '111.222.333-44',
        password,
      },

      // Recepcionistas
      {
        name: 'Recepcionista Ana',
        email: 'ana.recep@academia.com',
        cpf: '222.333.444-55',
        password,
      },
      {
        name: 'Recepcionista Carlos',
        email: 'carlos.recep@academia.com',
        cpf: '333.444.555-66',
        password,
      },

      // Professores
      {
        name: 'Professor João',
        email: 'joao.prof@academia.com',
        cpf: '444.555.666-77',
        password,
      },
      {
        name: 'Professora Maria',
        email: 'maria.prof@academia.com',
        cpf: '555.666.777-88',
        password,
      },

      // Estagiários
      {
        name: 'Estagiário Pedro',
        email: 'pedro.estag@academia.com',
        cpf: '666.777.888-99',
        password,
      },

      // Alunos
      {
        name: 'Aluno Lucas',
        email: 'lucas.aluno@email.com',
        cpf: '777.888.999-00',
        password,
      },
      {
        name: 'Aluna Sofia',
        email: 'sofia.aluna@email.com',
        cpf: '888.999.000-11',
        password,
      },
      {
        name: 'Aluno Miguel',
        email: 'miguel.aluno@email.com',
        cpf: '999.000.111-22',
        password,
      },
      {
        name: 'Aluno Funcionário',
        email: 'func.aluno@academia.com',
        cpf: '123.456.789-00',
        password,
      },
    ],
  });

  // Obter IDs das pessoas criadas
  const persons = await prisma.person.findMany({
    select: { id: true, email: true },
  });

  const getPersonId = (email: string) => {
    return persons.find((p) => p.email === email)?.id || 0;
  };

  // Criar especializações (Employee e Student)
  await prisma.employee.createMany({
    data: [
      // Admin
      {
        personId: getPersonId('admin@academia.com'),
        role: 'ADMIN',
        tenure: 24,
      },

      // Recepcionistas
      {
        personId: getPersonId('ana.recep@academia.com'),
        role: 'RECEPTIONIST',
        tenure: 12,
      },
      {
        personId: getPersonId('carlos.recep@academia.com'),
        role: 'RECEPTIONIST',
        tenure: 6,
      },

      // Professores
      {
        personId: getPersonId('joao.prof@academia.com'),
        role: 'TEACHER',
        tenure: 18,
      },
      {
        personId: getPersonId('maria.prof@academia.com'),
        role: 'TEACHER',
        tenure: 30,
      },

      // Estagiário
      {
        personId: getPersonId('pedro.estag@academia.com'),
        role: 'TRAINEE',
        tenure: 3,
      },

      // Funcionário que também é aluno
      {
        personId: getPersonId('func.aluno@academia.com'),
        role: 'TEACHER',
        tenure: 12,
      },
    ],
  });

  await prisma.student.createMany({
    data: [
      // Alunos regulares
      { personId: getPersonId('lucas.aluno@email.com') },
      { personId: getPersonId('sofia.aluna@email.com') },
      { personId: getPersonId('miguel.aluno@email.com') },

      // Funcionário que também é aluno
      { personId: getPersonId('func.aluno@academia.com') },
    ],
  });

  // Obter IDs dos alunos
  const students = await prisma.student.findMany({
    select: { id: true, person: { select: { email: true } } },
  });

  const getStudentId = (email: string) => {
    return students.find((s) => s.person.email === email)?.id || 0;
  };

  // Criar matrículas
  await prisma.membership.createMany({
    data: [
      // Matrícula ativa para Lucas
      {
        studentId: getStudentId('lucas.aluno@email.com'),
        startDate: new Date('2024-01-01'),
        status: 'ACTIVE',
        type: 'MONTHLY',
      },

      // Matrícula ativa para Sofia
      {
        studentId: getStudentId('sofia.aluna@email.com'),
        startDate: new Date('2024-02-15'),
        status: 'ACTIVE',
        type: 'QUARTERLY',
      },

      // Matrícula cancelada para Miguel (antiga)
      {
        studentId: getStudentId('miguel.aluno@email.com'),
        startDate: new Date('2023-11-01'),
        endDate: new Date('2024-01-31'),
        status: 'CANCELLED',
        type: 'MONTHLY',
      },

      // Nova matrícula ativa para Miguel (substitui a anterior)
      {
        studentId: getStudentId('miguel.aluno@email.com'),
        startDate: new Date('2024-02-01'),
        status: 'ACTIVE',
        type: 'ANNUAL',
      },

      // Matrícula para aluno funcionário
      {
        studentId: getStudentId('func.aluno@academia.com'),
        startDate: new Date('2024-01-10'),
        status: 'ACTIVE',
        type: 'SEMESTERLY',
      },
    ],
  });

  // Criar fichas de treino
  await prisma.workoutPlan.createMany({
    data: [
      {
        studentId: getStudentId('lucas.aluno@email.com'),
        content: {
          upperBody: [
            { exercise: 'Supino reto', sets: 4, reps: '8-10' },
            { exercise: 'Remada curvada', sets: 3, reps: '10-12' },
          ],
          lowerBody: [
            { exercise: 'Agachamento livre', sets: 4, reps: '8-10' },
            { exercise: 'Leg press', sets: 3, reps: '12-15' },
          ],
        },
        employeeId: getPersonId('joao.prof@academia.com'),
      },
      {
        studentId: getStudentId('sofia.aluna@email.com'),
        content: {
          cardio: [
            { exercise: 'Esteira', duration: '30 min', intensity: 'Moderada' },
          ],
          strength: [
            { exercise: 'Leg press', sets: 3, reps: '12-15' },
            { exercise: 'Cadeira extensora', sets: 3, reps: '15' },
          ],
        },
        employeeId: getPersonId('maria.prof@academia.com'),
      },
    ],
  });

  // Criar avaliações físicas
  await prisma.physicalAssessment.createMany({
    data: [
      {
        studentId: getStudentId('lucas.aluno@email.com'),
        teacherId: getPersonId('joao.prof@academia.com'),
        height: 1.78,
        weight: 75.5,
        bodyFat: 18.2,
        observations: 'Boa evolução na massa muscular',
      },
      {
        studentId: getStudentId('sofia.aluna@email.com'),
        teacherId: getPersonId('maria.prof@academia.com'),
        height: 1.65,
        weight: 62.0,
        bodyFat: 22.5,
        observations: 'Foco na redução de gordura corporal',
      },
      {
        studentId: getStudentId('miguel.aluno@email.com'),
        teacherId: getPersonId('joao.prof@academia.com'),
        height: 1.82,
        weight: 85.0,
        bodyFat: 25.8,
        observations: 'Necessita melhorar alimentação',
      },
    ],
  });

  console.log('Seed realizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
