/*
  Warnings:

  - You are about to drop the column `subject` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Student` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "Ratings" ADD VALUE 'NONE';

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "subject";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "status";

-- DropEnum
DROP TYPE "Status";
