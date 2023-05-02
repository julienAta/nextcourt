import { api } from "src/utils/api";
import { useState, useEffect } from "react";
// Display Profile page
export default function Admin() {
  // Type interfaces
  type Session = {
    id: string;
    date: string;
    slots: string[];
    username: string;
  };

  // Data with sessions that user programmed
  const [userSession, setUserSession] = useState<Session[]>([]);
  // State that store what session is clicked to delete
  const [sessionToDelete, setSessionToDelete] = useState<Session>({
    id: "",
    date: "",
    slots: [],
    username: "",
  });
  // Trigger to update day sessions
  const [trigger, setTrigger] = useState<boolean>(false);
  // Username
  const [username, setUsername] = useState<string>("");

  // Mutation to delete order
  const mutationDeleteOrder = api.order.deleteOrder.useMutation();
  // Mutation to update day
  const mutationUpdateDay = api.day.updateDay.useMutation();

  // Fetch orders from user
  api.order.getAllOrders.useQuery(undefined, {
    onSuccess: (data) => {
      setUserSession(data);
    },
  } as {
    onSuccess: (data: []) => void;
  });

  // Fetch slots from day to update and on success update day sessions in db and delete order
  api.day.getSlots.useQuery({ dateFormat: sessionToDelete.date }, {
    enabled: trigger,
    onSuccess: (data: { slot: string; available: boolean }[]) => {
      // Update slots available for the day
      sessionToDelete.slots.forEach((element) => {
        data.forEach((slotToUpdate) => {
          if (slotToUpdate.slot === element) {
            slotToUpdate.available = true;
          }
        });
        const dataUpdated = {
          dateFormat: sessionToDelete.date,
          slots: data,
        };
        mutationUpdateDay.mutate(dataUpdated);
      });

      // Delete order
      if (sessionToDelete) {
        const orderId = sessionToDelete.id;

        if (orderId) {
          mutationDeleteOrder.mutate({ orderId });
          const newListOrder = userSession.filter(
            (item) => item.id !== orderId
          );

          setUserSession(newListOrder);
        }
      }
      setTrigger(false);
    },
    queryKey: [trigger],
  } as {
    onSuccess: (data: []) => void;
  });
  // Handle Cancel button
  const handleDeleteSession = (session: Session, i: number) => {
    if (session) {
      setSessionToDelete(session);
      setTrigger(true);
    }
  };

  // Display user sessions
  return (
    <>
      <div>
        <p>Admin</p>
        <div>
          {userSession.map((session: Session, i: number) => {
            return (
              <li key={i}>
                {session.date} {session.slots} {session.username}
                <button
                  onClick={() => void handleDeleteSession(session, i)}
                  className="btn"
                >
                  Cancel
                </button>
              </li>
            );
          })}
        </div>
      </div>
    </>
  );
}