/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpar tabelas na ordem correta para evitar erros de chave estrangeira
  await prisma.physicalAssessment.deleteMany();
  await prisma.workoutPlan.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.student.deleteMany();
  await prisma.person.deleteMany();

  const password = await hash('123456', 8);

  // Criar pessoas individualmente para obter seus IDs
  const admin = await prisma.person.create({
    data: {
      name: 'Admin Master',
      email: 'admin@academia.com',
      cpf: '111.222.333-44',
      password,
    },
  });

  const recepcionistaAna = await prisma.person.create({
    data: {
      name: 'Recepcionista Ana',
      email: 'ana.recep@academia.com',
      cpf: '222.333.444-55',
      password,
    },
  });

  const recepcionistaCarlos = await prisma.person.create({
    data: {
      name: 'Recepcionista Carlos',
      email: 'carlos.recep@academia.com',
      cpf: '333.444.555-66',
      password,
    },
  });

  const professorJoao = await prisma.person.create({
    data: {
      name: 'Professor João',
      email: 'joao.prof@academia.com',
      cpf: '444.555.666-77',
      password,
    },
  });

  const professoraMaria = await prisma.person.create({
    data: {
      name: 'Professora Maria',
      email: 'maria.prof@academia.com',
      cpf: '555.666.777-88',
      password,
    },
  });

  const estagiarioPedro = await prisma.person.create({
    data: {
      name: 'Estagiário Pedro',
      email: 'pedro.estag@academia.com',
      cpf: '666.777.888-99',
      password,
    },
  });

  const alunoLucas = await prisma.person.create({
    data: {
      name: 'Aluno Lucas',
      email: 'lucas.aluno@email.com',
      cpf: '777.888.999-00',
      password,
    },
  });

  const alunaSofia = await prisma.person.create({
    data: {
      name: 'Aluna Sofia',
      email: 'sofia.aluna@email.com',
      cpf: '888.999.000-11',
      password,
    },
  });

  const alunoMiguel = await prisma.person.create({
    data: {
      name: 'Aluno Miguel',
      email: 'miguel.aluno@email.com',
      cpf: '999.000.111-22',
      password,
    },
  });

  const alunoFuncionario = await prisma.person.create({
    data: {
      name: 'Aluno Funcionário',
      email: 'func.aluno@academia.com',
      cpf: '123.456.789-00',
      password,
    },
  });

  // Criar especializações (Employee e Student)
  const adminEmployee = await prisma.employee.create({
    data: {
      role: 'ADMIN',
      tenure: 24,
      person: { connect: { id: admin.id } },
    },
  });

  const anaEmployee = await prisma.employee.create({
    data: {
      role: 'RECEPTIONIST',
      tenure: 12,
      person: { connect: { id: recepcionistaAna.id } },
    },
  });

  const carlosEmployee = await prisma.employee.create({
    data: {
      role: 'RECEPTIONIST',
      tenure: 6,
      person: { connect: { id: recepcionistaCarlos.id } },
    },
  });

  const joaoEmployee = await prisma.employee.create({
    data: {
      role: 'TEACHER',
      tenure: 18,
      person: { connect: { id: professorJoao.id } },
    },
  });

  const mariaEmployee = await prisma.employee.create({
    data: {
      role: 'TEACHER',
      tenure: 30,
      person: { connect: { id: professoraMaria.id } },
    },
  });

  const pedroEmployee = await prisma.employee.create({
    data: {
      role: 'TRAINEE',
      tenure: 3,
      person: { connect: { id: estagiarioPedro.id } },
    },
  });

  const funcEmployee = await prisma.employee.create({
    data: {
      role: 'TEACHER',
      tenure: 12,
      person: { connect: { id: alunoFuncionario.id } },
    },
  });

  // Criar alunos
  const lucasStudent = await prisma.student.create({
    data: {
      person: { connect: { id: alunoLucas.id } },
    },
  });

  const sofiaStudent = await prisma.student.create({
    data: {
      person: { connect: { id: alunaSofia.id } },
    },
  });

  const miguelStudent = await prisma.student.create({
    data: {
      person: { connect: { id: alunoMiguel.id } },
    },
  });

  const funcStudent = await prisma.student.create({
    data: {
      person: { connect: { id: alunoFuncionario.id } },
    },
  });

  // Obter IDs dos funcionários (para referenciar na PhysicalAssessment)
  const employees = await prisma.employee.findMany({
    select: { id: true, person: { select: { email: true } } },
  });

  const getEmployeeId = (email: string) => {
    return employees.find((e) => e.person.email === email)?.id || 0;
  };

  const students = await prisma.student.findMany({
    select: { id: true, person: { select: { email: true } } },
  });

  const getStudentId = (email: string) => {
    return students.find((e) => e.person.email === email)?.id || 0;
  };

  // Criar matrículas
  await prisma.membership.createMany({
    data: [
      // Matrícula ativa para Lucas
      {
        studentId: lucasStudent.id,
        startDate: new Date('2024-01-01'),
        status: 'ACTIVE',
        type: 'MONTHLY',
      },
      // Matrícula ativa para Sofia
      {
        studentId: sofiaStudent.id,
        startDate: new Date('2024-02-15'),
        status: 'ACTIVE',
        type: 'QUARTERLY',
      },
      // Matrícula cancelada para Miguel (antiga)
      {
        studentId: miguelStudent.id,
        startDate: new Date('2023-11-01'),
        endDate: new Date('2024-01-31'),
        status: 'CANCELLED',
        type: 'MONTHLY',
      },
      // Nova matrícula ativa para Miguel (substitui a anterior)
      {
        studentId: miguelStudent.id,
        startDate: new Date('2024-02-01'),
        status: 'ACTIVE',
        type: 'ANNUAL',
      },
      // Matrícula para aluno funcionário
      {
        studentId: funcStudent.id,
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
        studentId: lucasStudent.id,
        content: {
          nome: 'Treino ABC - Hipertrofia',
          objetivo: 'Ganho de Massa Muscular',
          validoAte: '30/09/2023',
          observacoes:
            'Focar na execução correta dos movimentos e controle da fase excêntrica.',
          grupos: [
            {
              nome: 'Peito e Tríceps',
              exercicios: [
                {
                  nome: 'Supino Reto',
                  series: '4',
                  repeticoes: '10-12',
                  carga: '40kg',
                  descanso: '90s',
                },
                {
                  nome: 'Supino Inclinado Halteres',
                  series: '3',
                  repeticoes: '12-15',
                  carga: '18kg',
                  descanso: '60s',
                },
              ],
            },
            {
              nome: 'Costas e Bíceps',
              exercicios: [
                {
                  nome: 'Barra Fixa',
                  series: '4',
                  repeticoes: '8-10',
                  carga: 'Peso Corporal',
                  descanso: '90s',
                },
              ],
            },
          ],
        },
        employeeId: getEmployeeId('joao.prof@academia.com'),
      },
      {
        studentId: sofiaStudent.id,
        content: {
          nome: 'Treino Feminino - Resistência',
          objetivo: 'Melhoria da Resistência Cardiovascular',
          validoAte: '30/10/2023',
          observacoes: 'Manter frequência cardíaca na zona alvo.',
          grupos: [
            {
              nome: 'Cardio',
              exercicios: [
                {
                  nome: 'Esteira',
                  series: '1',
                  repeticoes: '30 min',
                  carga: 'Velocidade 6 km/h',
                  descanso: '0s',
                },
              ],
            },
            {
              nome: 'Membros Inferiores',
              exercicios: [
                {
                  nome: 'Leg Press',
                  series: '3',
                  repeticoes: '15-20',
                  carga: '50kg',
                  descanso: '60s',
                },
                {
                  nome: 'Cadeira Extensora',
                  series: '3',
                  repeticoes: '15',
                  carga: '30kg',
                  descanso: '45s',
                },
              ],
            },
          ],
        },
        employeeId: getEmployeeId('maria.prof@academia.com'),
      },
    ],
  });

  // Criar avaliações físicas
  await prisma.physicalAssessment.createMany({
    data: [
      {
        studentId: getStudentId('lucas.aluno@email.com'),
        teacherId: getEmployeeId('joao.prof@academia.com'),
        height: 1.78,
        weight: 75.5,
        bodyFat: 18.2,
        observations: 'Boa evolução na massa muscular',
      },
      {
        studentId: getStudentId('sofia.aluna@email.com'),
        teacherId: getEmployeeId('maria.prof@academia.com'),
        height: 1.65,
        weight: 62.0,
        bodyFat: 22.5,
        observations: 'Foco na redução de gordura corporal',
      },
      {
        studentId: getStudentId('miguel.aluno@email.com'),
        teacherId: getEmployeeId('joao.prof@academia.com'),
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
