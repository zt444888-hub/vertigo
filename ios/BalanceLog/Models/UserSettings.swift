import Foundation

public struct UserSettings: Codable {
    public var medicationReminders: Bool
    public var reminderTime: Date
    public var medicationName: String
    public var iCloudSync: Bool
    public var aiInsightsEnabled: Bool
    public var emergencyContactName: String
    public var emergencyContactPhone: String
    public var doctorName: String
    
    public init(
        medicationReminders: Bool = true,
        reminderTime: Date = Calendar.current.date(bySettingHour: 8, minute: 0, second: 0, of: Date()) ?? Date(),
        medicationName: String = "Betahistine 16mg",
        iCloudSync: Bool = true,
        aiInsightsEnabled: Bool = true,
        emergencyContactName: String = "Dr. Sarah Jenkins (ENT Clinic)",
        emergencyContactPhone: "+1 (555) 234-5678",
        doctorName: String = "Dr. Sarah Jenkins"
    ) {
        self.medicationReminders = medicationReminders
        self.reminderTime = reminderTime
        self.medicationName = medicationName
        self.iCloudSync = iCloudSync
        self.aiInsightsEnabled = aiInsightsEnabled
        self.emergencyContactName = emergencyContactName
        self.emergencyContactPhone = emergencyContactPhone
        self.doctorName = doctorName
    }
}
