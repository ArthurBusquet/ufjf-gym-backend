/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `WorkoutPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WorkoutPlan_employeeId_key" ON "WorkoutPlan"("employeeId");
