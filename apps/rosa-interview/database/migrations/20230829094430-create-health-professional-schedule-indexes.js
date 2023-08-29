module.exports = {
  async up(db) {
    const collection = db.collection('health_professional_schedules');

    // Create index for healthProfessionalId
    await collection.createIndex({ healthProfessionalId: 1 });

    // Create index for startDate
    await collection.createIndex({ startDate: 1 });

    // Create index for endDate
    await collection.createIndex({ endDate: 1 });

    // Create index for availabilities.startTime
    await collection.createIndex({ 'availabilities.startTime': 1 });

    // Create index for availabilities.endTime
    await collection.createIndex({ 'availabilities.endTime': 1 });
  },

  async down(db) {
    const collection = db.collection('health_professional_schedules');

    // Drop index for healthProfessionalId
    await collection.dropIndex('healthProfessionalId_1');

    // Drop index for startDate
    await collection.dropIndex('startDate_1');

    // Drop index for endDate
    await collection.dropIndex('endDate_1');

    // Drop index for availabilities.startTime
    await collection.dropIndex('availabilities.startTime_1');

    // Drop index for availabilities.endTime
    await collection.dropIndex('availabilities.endTime_1');
  },
};