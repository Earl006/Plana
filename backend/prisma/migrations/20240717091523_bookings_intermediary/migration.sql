/*
  Warnings:

  - You are about to drop the column `ticketId` on the `Booking` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Booking] DROP CONSTRAINT [Booking_ticketId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Booking] DROP COLUMN [ticketId];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
