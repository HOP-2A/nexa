-- CreateEnum
CREATE TYPE "Status" AS ENUM ('STUDENT', 'PRESIDENT');

-- CreateEnum
CREATE TYPE "Ratings" AS ENUM ('FIVE', 'FOUR', 'THREE', 'TWO', 'ONE');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('NEW', 'PASSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MentorshipStatus" AS ENUM ('ACTIVE', 'PAUSED', 'PENDING');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "Status" NOT NULL,
    "profilePic" TEXT,
    "class" TEXT NOT NULL,
    "phone" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "presidentId" TEXT,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "rating" "Ratings" NOT NULL,
    "bio" TEXT,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "profilePic" TEXT,
    "experienceYears" TEXT,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubEvent" (
    "eventId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startingAt" TIMESTAMP(3) NOT NULL,
    "endingAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT,
    "onlineLink" TEXT,
    "capacity" INTEGER,
    "status" "EventStatus" NOT NULL,
    "participants" TEXT[],

    CONSTRAINT "ClubEvent_pkey" PRIMARY KEY ("eventId")
);

-- CreateTable
CREATE TABLE "MentorStudent" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "MentorshipStatus" NOT NULL,

    CONSTRAINT "MentorStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClubForm" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "age" INTEGER,
    "class" TEXT,
    "personalStatement" TEXT,
    "experience" TEXT,
    "skills" TEXT,
    "whyThisClub" TEXT,

    CONSTRAINT "ClubForm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClubMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClubMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_clerkId_key" ON "Student"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_email_key" ON "Mentor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_clerkId_key" ON "Mentor"("clerkId");

-- CreateIndex
CREATE INDEX "_ClubMembers_B_index" ON "_ClubMembers"("B");

-- AddForeignKey
ALTER TABLE "Club" ADD CONSTRAINT "Club_presidentId_fkey" FOREIGN KEY ("presidentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubEvent" ADD CONSTRAINT "ClubEvent_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorStudent" ADD CONSTRAINT "MentorStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorStudent" ADD CONSTRAINT "MentorStudent_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubForm" ADD CONSTRAINT "ClubForm_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubForm" ADD CONSTRAINT "ClubForm_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubMembers" ADD CONSTRAINT "_ClubMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClubMembers" ADD CONSTRAINT "_ClubMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
