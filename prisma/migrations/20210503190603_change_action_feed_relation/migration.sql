/*
  Warnings:

  - A unique constraint covering the columns `[actionsId]` on the table `FeedItems` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FeedItems_actionsId_unique" ON "FeedItems"("actionsId");
