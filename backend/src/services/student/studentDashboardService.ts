/**
 * Student Dashboard Service — aggregates all student activity
 */
import { db } from "../wrappers/databaseWrapper";

class StudentDashboardService {
  async getMyBookings(userId: string, page: number = 1, limit: number = 20) {
    // Aggregate bookings from multiple sources
    const [consultations, accounting, drivingLicense] = await Promise.all([
      db.findMany("Consultation", { userId }, { page, limit }),
      db.findMany("AccountingBooking", { userId }, { page, limit }),
      db.findMany("DrivingLicenseBooking", { userId }, { page, limit }),
    ]);

    return {
      consultations: consultations.data,
      accounting: accounting.data,
      drivingLicense: drivingLicense.data,
    };
  }

  async getMyRequests(userId: string, page: number = 1, limit: number = 20) {
    const [airportPickups, accommodationEnquiries, carRequests, jobApplications, loanApplications, eventRegistrations, certificationRequests] =
      await Promise.all([
        db.findMany("AirportPickup", { userId }, { page, limit }),
        db.findMany("AccommodationEnquiry", { userId }, { page, limit }),
        db.findMany("CarRentRequest", { userId }, { page, limit }),
        db.findMany("JobApplication", { userId }, { page, limit }),
        db.findMany("LoanApplication", { userId }, { page, limit }),
        db.findMany("EventRegistration", { userId }, { page, limit }),
        db.findMany("CertificationRequest", { userId }, { page, limit }),
      ]);

    return {
      airportPickups: airportPickups.data,
      accommodationEnquiries: accommodationEnquiries.data,
      carRequests: carRequests.data,
      jobApplications: jobApplications.data,
      loanApplications: loanApplications.data,
      eventRegistrations: eventRegistrations.data,
      certificationRequests: certificationRequests.data,
    };
  }
}

export const studentDashboardService = new StudentDashboardService();
