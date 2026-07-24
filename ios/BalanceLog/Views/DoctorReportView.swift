import SwiftUI

public struct DoctorReportView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var store: BalanceLogStore
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    // Header Banner
                    VStack(alignment: .leading, spacing: 6) {
                        Text("BalanceLog — Physician Summary")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                        
                        Text("Prepared for consultation with \(store.settings.doctorName)")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        
                        Text("Report Generated: \(Date().formatted(date: .numeric, time: .omitted))")
                            .font(.caption2)
                            .foregroundColor(.secondary)
                    }
                    .padding(.bottom, 8)
                    Divider()
                    
                    // Summary Cards
                    HStack(spacing: 12) {
                        VStack(spacing: 4) {
                            Text("TOTAL LOGS")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.secondary)
                            Text("\(store.episodes.count)")
                                .font(.title2)
                                .fontWeight(.extrabold)
                                .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                        .cornerRadius(12)
                        
                        VStack(spacing: 4) {
                            Text("AVG SEVERITY")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.secondary)
                            Text("3.2 / 5")
                                .font(.title2)
                                .fontWeight(.extrabold)
                                .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                        .cornerRadius(12)
                    }
                    
                    // Detailed Log Records
                    Text("Episode History")
                        .font(.headline)
                        .fontWeight(.bold)
                    
                    ForEach(store.episodes) { ep in
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text(ep.timestamp.formatted(date: .numeric, time: .shortened))
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                Spacer()
                                Text("Level \(ep.severity)")
                                    .font(.caption2)
                                    .fontWeight(.bold)
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(ep.severity >= 4 ? Color.red.opacity(0.15) : Color(red: 0.0, green: 0.38, blue: 0.52).opacity(0.15))
                                    .foregroundColor(ep.severity >= 4 ? .red : Color(red: 0.0, green: 0.38, blue: 0.52))
                                    .cornerRadius(4)
                            }
                            
                            Text("Symptoms: \(ep.symptoms.map(\.rawValue).joined(separator: ", "))")
                                .font(.caption)
                                .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                            
                            if let triggers = ep.triggers, !triggers.isEmpty {
                                Text("Triggers: \(triggers.map(\.rawValue).joined(separator: ", "))")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                            
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
                .padding()
            }
            .navigationTitle("Clinical Report")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
