import SwiftUI

public struct SettingsView: View {
    @EnvironmentObject var store: BalanceLogStore
    
    public var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Emergency & Physician Info")) {
                    TextField("Primary Physician Name", text: Binding(
                        get: { store.settings.doctorName },
                        set: { var s = store.settings; s.doctorName = $0; store.updateSettings(s) }
                    ))
                    
                    TextField("ICE Contact Name", text: Binding(
                        get: { store.settings.emergencyContactName },
                        set: { var s = store.settings; s.emergencyContactName = $0; store.updateSettings(s) }
                    ))
                    
                    TextField("ICE Contact Phone", text: Binding(
                        get: { store.settings.emergencyContactPhone },
                        set: { var s = store.settings; s.emergencyContactPhone = $0; store.updateSettings(s) }
                    ))
                    .keyboardType(.phonePad)
                }
                
                Section(header: Text("Medication & Reminders")) {
                    Toggle("Medication Reminders", isOn: Binding(
                        get: { store.settings.medicationReminders },
                        set: { var s = store.settings; s.medicationReminders = $0; store.updateSettings(s) }
                    ))
                    
                    DatePicker("Reminder Time", selection: Binding(
                        get: { store.settings.reminderTime },
                        set: { var s = store.settings; s.reminderTime = $0; store.updateSettings(s) }
                    ), displayedComponents: [.hourAndMinute])
                    
                    TextField("Medication Name", text: Binding(
                        get: { store.settings.medicationName },
                        set: { var s = store.settings; s.medicationName = $0; store.updateSettings(s) }
                    ))
                }
                
                Section(header: Text("Cloud Sync & Health Features")) {
                    Toggle("iCloud Sync", isOn: Binding(
                        get: { store.settings.iCloudSync },
                        set: { var s = store.settings; s.iCloudSync = $0; store.updateSettings(s) }
                    ))
                    
                    Toggle("AI Clinical Insights Engine", isOn: Binding(
                        get: { store.settings.aiInsightsEnabled },
                        set: { var s = store.settings; s.aiInsightsEnabled = $0; store.updateSettings(s) }
                    ))
                }
                
                Section(header: Text("App Info")) {
                    HStack {
                        Text("App Version")
                        Spacer()
                        Text("1.2.0 (Native Swift)")
                            .foregroundColor(.secondary)
                    }
                    HStack {
                        Text("Platform")
                        Spacer()
                        Text("iOS 17+ (SwiftUI)")
                            .foregroundColor(.secondary)
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
}
