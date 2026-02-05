-- CreateTable
CREATE TABLE "Invites" (
    "id" TEXT NOT NULL,
    "studentEmail" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "inviterId" TEXT NOT NULL,

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);
