"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

type ReservationStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "BOOKED"
  | string;

type Student = {
  firstname: string;
  lastname: string;
  email: string;
};

type Reservation = {
  id: string;
  availableDate: string | Date;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  student: Student;
};

type AuthUser = { id: string } | null;

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();

  const [reservations, setReservation] = useState<Reservation[]>([]);

  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };

  const mentorId = useMemo(() => user?.id ?? null, [user]);

  const fetchMentorData = useCallback(async () => {
    if (!mentorId) return;

    const res = await fetch("/api/mentorAvailability/mentorAllReservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorId }),
    });

    if (!res.ok) {
      setReservation([]);
      return;
    }

    const response: Reservation[] = await res.json();
    setReservation(Array.isArray(response) ? response : []);
  }, [mentorId]);

  const handleConfirm = useCallback(
    async (id: Reservation["id"]) => {
      await fetch("/api/mentorAvailability/mentorReservationConfirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: "BOOKED",
        }),
      });

      await fetchMentorData();
    },
    [fetchMentorData],
  );

  const handleReject = useCallback(
    async (id: Reservation["id"]) => {
      await fetch("/api/mentorAvailability/mentorReservationRejection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELED",
          id,
        }),
      });

      await fetchMentorData();
    },
    [fetchMentorData],
  );

  useEffect(() => {
    fetchMentorData();
  }, [fetchMentorData]);

  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_20%_20%,#e0e7ff,transparent_40%),radial-gradient(circle_at_80%_0%,#d8b4fe,transparent_35%),#f8fafc]">
      <MentorSideBar
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/account")}
      />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Reservation Requests
        </h1>

        {reservations.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No reservations yet.
          </div>
        )}

        <div className="grid gap-6">
          {reservations.map((reservation) => {
            const formattedDate = new Date(
              reservation.availableDate,
            ).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const initial =
              reservation.student?.firstname?.[0]?.toUpperCase() ?? "?";

            return (
              <div
                key={reservation.id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {formattedDate}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {reservation.startTime} — {reservation.endTime}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      reservation.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : reservation.status === "CONFIRMED" ||
                            reservation.status === "BOOKED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {reservation.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                    {initial}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {reservation.student.firstname}{" "}
                      {reservation.student.lastname}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reservation.student.email}
                    </p>
                  </div>
                </div>

                {reservation.status === "PENDING" && (
                  <div className="flex gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded-xl font-medium transition text-white"
                          type="button"
                        >
                          Confirm
                        </button>
                      </DialogTrigger>

                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Confirm Reservation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to confirm this session with{" "}
                            <span className="font-semibold">
                              {reservation.student.firstname}
                            </span>{" "}
                            on {formattedDate} at {reservation.startTime}?
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-4">
                          <button
                            onClick={() => handleConfirm(reservation.id)}
                            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl text-white"
                            type="button"
                          >
                            Yes, Confirm
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-xl font-medium transition text-white"
                          type="button"
                        >
                          Reject
                        </button>
                      </DialogTrigger>

                      <DialogContent className="rounded-2xl">
                        <DialogHeader>
                          <DialogTitle>Reject Reservation</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to reject this reservation?
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>

                        <DialogFooter className="mt-4">
                          <button
                            onClick={() => handleReject(reservation.id)}
                            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-white"
                            type="button"
                          >
                            Yes, Reject
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Page;
