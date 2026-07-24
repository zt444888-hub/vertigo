import SwiftUI
import Charts

public struct ChartsView: View {
    @EnvironmentObject var store: BalanceLogStore
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 20) {
                    // MARK: - Severity Trend Chart
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Attack Severity Trend")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        Chart {
                            ForEach(store.episodes.reversed()) { ep in
                                LineMark(
                                    x: .value("Date", ep.timestamp, unit: .day),
                                    y: .value("Severity", ep.severity)
                                )
                                .foregroundStyle(Color(red: 0.0, green: 0.38, blue: 0.52))
                                .interpolationMethod(.catmullRom)
                                
                                PointMark(
                                    x: .value("Date", ep.timestamp, unit: .day),
                                    y: .value("Severity", ep.severity)
                                )
                                .foregroundStyle(ep.severity >= 4 ? Color.red : Color(red: 0.0, green: 0.38, blue: 0.52))
                            }
                        }
                        .frame(height: 200)
                        .chartYScale(domain: 0...5)
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    
                    // MARK: - Symptom Frequency Chart
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Symptom Distribution")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        let symptomCounts: [(symptom: String, count: Int)] = [
                            ("Tinnitus", 5),
                            ("Nausea", 4),
                            ("Hearing Loss", 2),
                            ("Blurred Vision", 2),
                            ("Headache", 1)
                        ]
                        
                        Chart {
                            ForEach(symptomCounts, id: \.symptom) { item in
                                BarMark(
                                    x: .value("Count", item.count),
                                    y: .value("Symptom", item.symptom)
                                )
                                .foregroundStyle(Color(red: 0.16, green: 0.48, blue: 0.63))
                            }
                        }
                        .frame(height: 180)
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                    
                    // MARK: - Trigger Analysis
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Top Trigger Correlations")
                            .font(.headline)
                            .fontWeight(.bold)
                        
                        VStack(spacing: 8) {
                            TriggerRow(name: "Salty Meal / High Sodium", count: 4, color: .red)
                            TriggerRow(name: "Weather / Pressure Drop", count: 3, color: Color(red: 0.0, green: 0.38, blue: 0.52))
                            TriggerRow(name: "Caffeine / Coffee", count: 3, color: Color(red: 0.16, green: 0.48, blue: 0.63))
                            TriggerRow(name: "Stress / Anxiety", count: 2, color: Color(red: 0.05, green: 0.43, blue: 0.39))
                        }
                    }
                    .padding()
                    .background(Color(UIColor.secondarySystemGroupedBackground))
                    .cornerRadius(16)
                }
                .padding()
            }
            .navigationTitle("Analytics & Trends")
        }
    }
}

struct TriggerRow: View {
    let name: String
    let count: Int
    let color: Color
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(.subheadline)
                    .fontWeight(.bold)
                Text("Correlated in \(count) episodes")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            Spacer()
            Circle()
                .fill(color)
                .frame(width: 12, height: 12)
        }
        .padding(10)
        .background(Color(UIColor.tertiarySystemGroupedBackground))
        .cornerRadius(10)
    }
}
