const updateExpiredAppointments = async (req, res, next) => {
    try {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      await db.query(`
        UPDATE appointments
        SET status = 'Expired'
        WHERE appointment_date < $1 AND status != 'Expired'
      `, [today]);
  
      next();
    } catch (error) {
      console.error("Error updating expired appointments:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

  
export default updateExpiredAppointments
 
  