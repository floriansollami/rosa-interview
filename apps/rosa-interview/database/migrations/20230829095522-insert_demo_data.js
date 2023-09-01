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
          end: new Date("2000-01-01T19:00:00.000Z"), // + 1 hour in local time in Brussels
          start: new Date("2000-01-01T08:30:00.000Z") // + 1 hour in local time in Brussels
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
          // 2023-08-28T12:00:00 local time in Brussels
          endTime: new Date("2023-08-28T10:00:00.000+0000"),
          // 2023-08-28T09:30:00 local time in Brussels
          startTime: new Date("2023-08-28T07:30:00.000+0000")
        },
        {
          // 2023-08-28T20:00:00 local time in Brussels
          endTime: new Date("2023-08-28T18:00:00.000+0000"),
          // 2023-08-28T14:00:00 local time in Brussels
          startTime: new Date("2023-08-28T14:00:00.000+0000")
        },
        {
          // 2023-08-29T18:00:00 local time in Brussels
          endTime: new Date("2023-08-29T16:00:00.000+0000"),
          // 2023-08-29T11:00:00 local time in Brussels
          startTime: new Date("2023-08-29T09:00:00.000+0000")
        }
      ],
      createdAt: new Date("2023-08-28T20:32:20.996Z"),
      healthProfessionalId: "c84cc145-1781-4e33-943d-7674242b322c",
      scheduledEvents: [
        {
          // 2023-08-14T16:00:00 local time in Brussels
          endTime: new Date('2023-08-14T14:00:00.000Z'),
          // 2023-08-14T12:00:00 local time in Brussels
          startTime: new Date('2023-08-14T10:00:00.000Z'),
          status: "CONFIRMED"
        },

        {
          // 2023-08-15T11:00:00 local time in Brussels
          endTime: new Date('2023-08-15T09:00:00.000Z'),
          // 2023-08-15T09:00:00 local time in Brussels
          startTime: new Date('2023-08-15T07:00:00.000Z'),
          status: "CONFIRMED"
        },
        {
          // 2023-08-15T20:00:00 local time in Brussels
          endTime: new Date('2023-08-15T18:00:00.000Z'),
          // 2023-08-15T18:00:00 local time in Brussels
          startTime: new Date('2023-08-15T16:00:00.000Z'),
          status: "CONFIRMED"
        },
      ],

      // START DATE: 2023-08-14T00:00:00 local time in Brussels (2023-08-13T22:00:00.000Z UTC)
      // END DATE: 2023-08-28T00:00:00 local time in Brussels (2023-08-27T22:00:00.000Z UTC)

      // In many programming contexts, ranges are often defined as "inclusive of the start point
      // and exclusive of the end point." This is sometimes referred to as a "half-open" interval,
      // denoted as [start, end).

      // Meaning as a mathematical interval:
      // [2023-08-14T00:00:00, 2023-08-28T00:00:00[
      // means actually [2023-08-28T00:00:00, 2023-08-28T23:59:59.599999] = 14 day duration

      startDate: new Date("2023-08-13T22:00:00.000Z"),
      endDate: new Date("2023-08-27T22:00:00.000Z"),
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
