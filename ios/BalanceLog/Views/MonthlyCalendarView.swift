import SwiftUI

public struct MonthlyCalendarView: View {
    @EnvironmentObject var store: BalanceLogStore
    @State private var selectedDate: Date = Date()
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // Month Picker & Grid
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Monthly Calendar Log")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        DatePicker("Select Date", selection: $selectedDate, displayedComponents: [.date])
                            .datePickerStyle(.graphical)
                            .tint(Color(red: 0.0, green: 0.38, blue: 0.52))
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    
                    // Episodes for Selected Month / All Episodes
                    VStack(alignment: .leading, spacing: 12) {
                        Text("All Episode Logs (\(store.episodes.count))")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        ForEach(store.episodes) { ep in
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text(ep.timestamp.formatted(date: .numeric, time: .shortened))
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                    Spacer()
                                    Text("Severity \(ep.severity)")
                                        .font(.caption2)
                                        .fontWeight(.bold)
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(ep.severity >= 4 ? Color.red.opacity(0.15) : Color(red: 0.0, green: 0.38, blue: 0.52).opacity(0.15))
                                        .foregroundColor(ep.severity >= 4 ? .red : Color(red: 0.0, green: 0.38, blue: 0.52))
                                        .cornerRadius(6)
                                }
                                Text("Duration: \(ep.duration.rawValue)")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                Text("Symptoms: \(ep.symptoms.map(\.rawValue).joined(separator: ", "))")
                                    .font(.caption)
                                    .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                                if let notes = ep.notes {
                                    Text("Notes: \(notes)")
                                        .font(.caption)
                                        .italic()
                                        .foregroundColor(.secondary)
                                }
                            }
                            .padding()
                            .background(Color(UIColor.secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Calendar View")
        }
    }
}
