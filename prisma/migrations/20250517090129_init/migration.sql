-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dueDate" DATETIME NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "Task_userId_idx" ON "Task"("userId");
