-- CreateEnum
CREATE TYPE "EmployeeRole" AS ENUM ('ADMIN', 'RECEPTIONIST', 'TEACHER', 'TRAINEE');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'CANCELLED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "MembershipType" AS ENUM ('MONTHLY', 'QUARTERLY', 'SEMESTERLY', 'ANNUAL');

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "cpf" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "tenure" INTEGER,
    "role" "EmployeeRole" NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" SERIAL NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "status" "MembershipStatus" NOT NULL,
    "type" "MembershipType" NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutPlan" (
    "id" SERIAL NOT NULL,
    "content" JSONB,
    "studentId" INTEGER NOT NULL,
    "employeeId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalAssessment" (
    "id" SERIAL NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "bodyFat" DOUBLE PRECISION,
    "observations" TEXT,
    "studentId" INTEGER NOT NULL,
    "teacherId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhysicalAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_cpf_key" ON "Person"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_personId_key" ON "Employee"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_personId_key" ON "Student"("personId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutPlan_studentId_key" ON "WorkoutPlan"("studentId");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalAssessment" ADD CONSTRAINT "PhysicalAssessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalAssessment" ADD CONSTRAINT "PhysicalAssessment_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
