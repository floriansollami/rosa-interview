module.exports = {
  async up(db) {
    // Insert a health professional
    const healthProfessional = {
      _id: "c84cc145-1781-4e33-943d-7674242b322c",
      createdAt: new Date("2023-08-29T08:40:35.588Z"),
      firstName: "John",
      lastName: "Smith",
      schedule: {
        weekDays: [1, 2],
        timeRange: {
          end: new Date("2000-01-01T19:00:00.000Z"),
          start: new Date("2000-01-01T08:30:00.000Z")
        },
        slotDuration: "PT15M"
      },
      timezone: "Europe/Brussels",
      updatedAt: new Date("2023-08-29T08:40:35.588Z")
    };

    await db.collection('health_professionals').insertOne(healthProfessional);

    // Insert a health professional schedule
    const healthProfessionalSchedule = {
      _id: "42d41ce6-79ad-47b3-9f45-df6211de56fd",
      availabilities: [
        {
          endTime: new Date("2023-08-28T12:00:00.000Z"),
          startTime: new Date("2023-08-28T09:30:00.000Z")
        },
        {
          endTime: new Date("2023-08-28T20:00:00.000Z"),
          startTime: new Date("2023-08-28T16:00:00.000Z")
        },
        {
          endTime: new Date("2023-08-29T18:00:00.000Z"),
          startTime: new Date("2023-08-29T11:00:00.000Z")
        }
      ],
      createdAt: new Date("2023-08-28T20:32:20.996Z"),
      endDate: new Date("2023-08-29T00:00:00.000Z"),
      healthProfessionalId: "c84cc145-1781-4e33-943d-7674242b322c",
      scheduledEvents: [
        {
          endTime: new Date("2023-08-28T12:00:00.000Z"),
          // patientId: undefined,
          startTime: new Date("2023-08-28T16:00:00.000Z"),
          status: "CONFIRMED"
        },
        {
          endTime: new Date("2023-08-29T09:00:00.000Z"),
          // patientId: undefined,
          startTime: new Date("2023-08-29T11:00:00.000Z"),
          status: "CONFIRMED"
        },
        {
          endTime: new Date("2023-08-29T18:00:00.000Z"),
          // patientId: undefined,
          startTime: new Date("2023-08-29T20:00:00.000Z"),
          status: "CONFIRMED"
        }
      ],
      startDate: new Date("2023-08-28T00:00:00.000Z"),
      timezone: "Europe/Brussels",
      updatedAt: new Date("2023-08-28T20:32:20.996Z")
    };

    await db.collection('health_professional_schedules').insertOne(healthProfessionalSchedule);
  },

  async down(db) {
    // Remove the inserted health professional and schedule
    await db.collection('health_professionals').deleteOne({ _id: "c84cc145-1781-4e33-943d-7674242b322c" });
    await db.collection('health_professional_schedules').deleteOne({ _id: "42d41ce6-79ad-47b3-9f45-df6211de56fd" });
  },
};
