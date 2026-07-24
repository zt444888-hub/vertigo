import SwiftUI

public struct HomeView: View {
    @EnvironmentObject var store: BalanceLogStore
    @Binding var activeTab: Int
    @State private var showingLogModal = false
    @State private var showingGroundingModal = false
    @State private var showingDoctorReportModal = false
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // MARK: - Action Buttons Row
                    HStack(spacing: 12) {
                        Button(action: { showingLogModal = true }) {
                            HStack(spacing: 12) {
                                Image(systemName: "waveform.path.ecg")
                                    .font(.title2)
                                    .padding(10)
                                    .background(Color.white.opacity(0.15))
                                    .clipShape(Circle())
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Log Attack")
                                        .font(.headline)
                                        .fontWeight(.bold)
                                    Text("Tap to record episode")
                                        .font(.caption)
                                        .opacity(0.8)
                                }
                                Spacer()
                            }
                            .padding()
                            .background(Color(red: 0.0, green: 0.38, blue: 0.52))
                            .foregroundColor(.white)
                            .cornerRadius(16)
                        }
                        
                        Button(action: { showingGroundingModal = true }) {
                            VStack(spacing: 6) {
                                Image(systemName: "circle.hexagongrid.circle.fill")
                                    .font(.title2)
                                    .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                                Text("Vertigo SOS")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                    .foregroundColor(.white)
                            }
                            .padding()
                            .frame(width: 100, height: 74)
                            .background(Color(red: 0.03, green: 0.12, blue: 0.15))
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(red: 0.61, green: 0.93, blue: 0.90).opacity(0.3), lineWidth: 1)
                            )
                        }
                    }
                    
                    // MARK: - Live Weather & Pressure Context Widget
                    HStack {
                        HStack(spacing: 12) {
                            Image(systemName: "barometer")
                                .font(.title3)
                                .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                                .padding(8)
                                .background(Color(red: 0.0, green: 0.38, blue: 0.52).opacity(0.1))
                                .cornerRadius(10)
                            
                            VStack(alignment: .leading, spacing: 2) {
                                HStack(spacing: 6) {
                                    Text("LIVE PRESSURE CONTEXT")
                                        .font(.system(size: 10, weight: .bold))
                                        .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                                    Text("Pressure Drop Alert")
                                        .font(.system(size: 9, weight: .bold))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color.red.opacity(0.15))
                                        .foregroundColor(.red)
                                        .cornerRadius(6)
                                }
                                Text("1009 hPa • Rainy / Low Pressure")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                                    .foregroundColor(.primary)
                            }
                        }
                        Spacer()
                        Button(action: { showingDoctorReportModal = true }) {
                            HStack(spacing: 4) {
                                Image(systemName: "doc.text")
                                Text("Report")
                            }
                            .font(.caption)
                            .fontWeight(.bold)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Color.white)
                            .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                            .cornerRadius(8)
                        }
                    }
                    .padding()
                    .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                    .cornerRadius(16)
                    
                    // MARK: - Daily Medication Tracker
                    HStack {
                        HStack(spacing: 12) {
                            Image(systemName: store.medicationDoseTakenToday ? "checkmark.circle.fill" : "pills")
                                .font(.title3)
                                .foregroundColor(store.medicationDoseTakenToday ? Color(red: 0.05, green: 0.43, blue: 0.39) : Color(red: 0.0, green: 0.38, blue: 0.52))
                                .padding(8)
                                .background(store.medicationDoseTakenToday ? Color(red: 0.61, green: 0.93, blue: 0.90) : Color(red: 0.90, green: 0.96, blue: 1.0))
                                .cornerRadius(10)
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("DAILY MEDICATION")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.secondary)
                                Text("\(store.settings.medicationName) (08:00 AM)")
                                    .font(.subheadline)
                                    .fontWeight(.bold)
                            }
                        }
                        Spacer()
                        Button(action: { store.medicationDoseTakenToday.toggle() }) {
                            Text(store.medicationDoseTakenToday ? "Dose Taken" : "Mark Taken")
                                .font(.caption)
                                .fontWeight(.bold)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(store.medicationDoseTakenToday ? Color(red: 0.05, green: 0.43, blue: 0.39) : Color(red: 0.90, green: 0.96, blue: 1.0))
                                .foregroundColor(store.medicationDoseTakenToday ? .white : Color(red: 0.0, green: 0.38, blue: 0.52))
                                .cornerRadius(10)
                        }
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    
                    // MARK: - Weekly Overview Summary Card
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Weekly Overview")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        HStack(spacing: 12) {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("ATTACKS THIS WEEK")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.secondary)
                                Text("\(store.episodes.count)")
                                    .font(.title)
                                    .fontWeight(.extrabold)
                                    .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                            .cornerRadius(12)
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text("AVG SEVERITY")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(.secondary)
                                Text("3.0 / 5")
                                    .font(.title)
                                    .fontWeight(.extrabold)
                                    .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()
                            .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                            .cornerRadius(12)
                        }
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    
                    // MARK: - Recent Episodes List
                    VStack(alignment: .leading, spacing: 12) {
                        HStack {
                            Text("Recent Attack Logs")
                                .font(.headline)
                                .fontWeight(.bold)
                            Spacer()
                            Button("View All") { activeTab = 2 }
                                .font(.caption)
                                .fontWeight(.bold)
                                .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                        }
                        
                        ForEach(store.episodes.prefix(3)) { ep in
                            HStack(spacing: 12) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text(ep.timestamp.formatted(date: .abbreviated, time: .shortened))
                                        .font(.subheadline)
                                        .fontWeight(.bold)
                                    Text(ep.symptoms.map(\.rawValue).joined(separator: ", "))
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                Spacer()
                                Text("Level \(ep.severity)")
                                    .font(.caption2)
                                    .fontWeight(.bold)
                                    .padding(.horizontal, 8)
                                    .padding(.vertical, 4)
                                    .background(ep.severity >= 4 ? Color.red.opacity(0.15) : Color(red: 0.0, green: 0.38, blue: 0.52).opacity(0.15))
                                    .foregroundColor(ep.severity >= 4 ? .red : Color(red: 0.0, green: 0.38, blue: 0.52))
                                    .cornerRadius(6)
                            }
                            .padding()
                            .background(Color(UIColor.secondarySystemGroupedBackground))
                            .cornerRadius(12)
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("BalanceLog")
            .sheet(isPresented: $showingLogModal) {
                LogAttackView()
            }
            .sheet(isPresented: $showingGroundingModal) {
                GroundingView()
            }
            .sheet(isPresented: $showingDoctorReportModal) {
                DoctorReportView()
            }
        }
    }
}
