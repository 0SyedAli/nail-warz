// utils/appointmentToEvents.js

export function groupAppointments(appointments = []) {
  const map = {};

  appointments.forEach((booking) => {
    const serviceDetail = booking?.servicesDetail?.[0];

    if (!serviceDetail?.scheduledAt) return;

    const scheduledDate = new Date(serviceDetail.scheduledAt);

    const key = scheduledDate.toISOString();

    if (!map[key]) {
      map[key] = {
        date: scheduledDate,
        time: scheduledDate,
        items: []
      };
    }

    map[key].items.push(booking);
  });


  return Object.values(map).map((group) => {

    const start = group.date;

    // return {
    //   id: start.toISOString(),

    //   title: `${group.items.length} Appointment${group.items.length > 1 ? "s" : ""
    //     }`,

    //   start,

    //   end: new Date(
    //     start.getTime() + 30 * 60 * 1000
    //   ),

    //   allDay: false,

    //   count: group.items.length,

    //   items: group.items,

    //   // ✅ send string instead of Date object
    //   time: start.toLocaleTimeString("en-US", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //   }),

    //   // optional: useful for filtering later
    //   date: start.toISOString().split("T")[0]
    // };
    return {
      id: start.toISOString(),

      title: `${group.items.length} Appointment${group.items.length > 1 ? "s" : ""
        }`,

      start,

      end: new Date(
        start.getTime() + 30 * 60 * 1000
      ),

      allDay: false,

      count: group.items.length,

      items: group.items,

      // ISO date
      date: start.toISOString()
    };
  });
}