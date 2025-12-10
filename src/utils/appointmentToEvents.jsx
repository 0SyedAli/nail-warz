// utils/groupAppointments.js
import { parse } from "date-fns";

export function groupAppointments(appointments) {
  const map = {};

  appointments.forEach((a) => {
    const key = `${a.date}-${a.time}`;
    if (!map[key]) {
      map[key] = {
        date: a.date,
        time: a.time,
        items: []
      };
    }
    map[key].items.push(a);
  });

  return Object.values(map).map((group) => {
    const first = group.items[0];

    const start = parse(
      `${first.date} ${first.time}`,
      "dd-MM-yyyy hh:mm a",
      new Date()
    );

    // const end = new Date(start.getTime() + 60 * 60 * 1000);
    const end = new Date(start.getTime() + 30 * 60 * 1000); // 30 minutes
    return {
      id: `${first.date}-${first.time}`,
      title: "New Appointment",
      start,
      end,
      allDay: false, // important for single block
      count: group.items.length,
      items: group.items,
      time: first.time
    };
  });
}
