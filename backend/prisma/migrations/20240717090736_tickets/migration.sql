BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[TicketBooking] (
    [id] NVARCHAR(1000) NOT NULL,
    [bookingId] NVARCHAR(1000) NOT NULL,
    [ticketId] NVARCHAR(1000) NOT NULL,
    [quantity] INT NOT NULL,
    CONSTRAINT [TicketBooking_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[TicketBooking] ADD CONSTRAINT [TicketBooking_bookingId_fkey] FOREIGN KEY ([bookingId]) REFERENCES [dbo].[Booking]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TicketBooking] ADD CONSTRAINT [TicketBooking_ticketId_fkey] FOREIGN KEY ([ticketId]) REFERENCES [dbo].[Ticket]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
