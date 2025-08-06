/*
  Warnings:

  - Made the column `employeeId` on table `WorkoutPlan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "WorkoutPlan" DROP CONSTRAINT "WorkoutPlan_employeeId_fkey";

-- AlterTable
ALTER TABLE "WorkoutPlan" ALTER COLUMN "employeeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "WorkoutPlan" ADD CONSTRAINT "WorkoutPlan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
