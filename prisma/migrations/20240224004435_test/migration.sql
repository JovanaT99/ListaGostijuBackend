-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('Wedding', 'Birthday', 'Christening', 'Graduation', 'Promotion', 'Anniversary', 'Celebration');

-- CreateEnum
CREATE TYPE "TableType" AS ENUM ('ROUND', 'SQUARE');

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "creationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "EventType" NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTable" (
    "id" SERIAL NOT NULL,
    "tableNumber" INTEGER NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "tableType" "TableType" NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventGuest" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isAttending" BOOLEAN NOT NULL,
    "eventId" INTEGER NOT NULL,

    CONSTRAINT "EventGuest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTableGuest" (
    "id" SERIAL NOT NULL,
    "eventTableId" INTEGER NOT NULL,
    "eventGuestId" INTEGER NOT NULL,
    "seatNumber" INTEGER NOT NULL,

    CONSTRAINT "EventTableGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventTable_tableNumber_key" ON "EventTable"("tableNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EventTableGuest_eventGuestId_key" ON "EventTableGuest"("eventGuestId");

-- CreateIndex
CREATE UNIQUE INDEX "EventTableGuest_eventTableId_seatNumber_key" ON "EventTableGuest"("eventTableId", "seatNumber");

-- CreateIndex
CREATE UNIQUE INDEX "EventTableGuest_eventTableId_eventGuestId_key" ON "EventTableGuest"("eventTableId", "eventGuestId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTable" ADD CONSTRAINT "EventTable_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventGuest" ADD CONSTRAINT "EventGuest_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTableGuest" ADD CONSTRAINT "EventTableGuest_eventTableId_fkey" FOREIGN KEY ("eventTableId") REFERENCES "EventTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTableGuest" ADD CONSTRAINT "EventTableGuest_eventGuestId_fkey" FOREIGN KEY ("eventGuestId") REFERENCES "EventGuest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
