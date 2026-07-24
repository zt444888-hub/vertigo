import Foundation
import Combine
import SwiftUI

@MainActor
public class BalanceLogStore: ObservableObject {
    @Published public var episodes: [AttackEpisode] = []
    @Published public var settings: UserSettings = UserSettings()
    @Published public var medicationDoseTakenToday: Bool = false
    
    private let saveKey = "BalanceLog_Episodes_v1"
    private let settingsKey = "BalanceLog_Settings_v1"
    
    public init() {
        loadData()
        if episodes.isEmpty {
            seedSampleData()
        }
    }
    
    public func addEpisode(_ episode: AttackEpisode) {
        episodes.insert(episode, at: 0)
        saveData()
    }
    
    public func updateEpisode(_ episode: AttackEpisode) {
        if let index = episodes.firstIndex(where: { $0.id == episode.id }) {
            episodes[index] = episode
            saveData()
        }
    }
    
    public func deleteEpisode(id: String) {
        episodes.removeAll(where: { $0.id == id })
        saveData()
    }
    
    public func updateSettings(_ newSettings: UserSettings) {
        self.settings = newSettings
        saveSettings()
    }
    
    // MARK: - Persistence
    private func saveData() {
        if let encoded = try? JSONEncoder().encode(episodes) {
            UserDefaults.standard.set(encoded, forKey: saveKey)
        }
    }
    
    private func saveSettings() {
        if let encoded = try? JSONEncoder().encode(settings) {
            UserDefaults.standard.set(encoded, forKey: settingsKey)
        }
    }
    
    private func loadData() {
        if let data = UserDefaults.standard.data(forKey: saveKey),
           let decoded = try? JSONDecoder().decode([AttackEpisode].self, from: data) {
            self.episodes = decoded
        }
        if let data = UserDefaults.standard.data(forKey: settingsKey),
           let decoded = try? JSONDecoder().decode(UserSettings.self, from: data) {
            self.settings = decoded
        }
    }
    
    private func seedSampleData() {
        let calendar = Calendar.current
        let now = Date()
        
        self.episodes = [
            AttackEpisode(
                timestamp: calendar.date(byAdding: .day, value: -1, to: now)!,
                duration: .min15To60,
                severity: 5,
                symptoms: [.tinnitus, .nausea, .blurredVision],
                sensation: .roomSpinning,
                headPosition: .turningHead,
                triggers: [.caffeine, .stress],
                barometricPressure: 1008.0,
                weatherCondition: "Rainy / Low Pressure",
                notes: "Sudden onset after drinking extra espresso and stressful morning meeting."
            ),
            AttackEpisode(
                timestamp: calendar.date(byAdding: .day, value: -3, to: now)!,
                duration: .min15To60,
                severity: 3,
                symptoms: [.tinnitus, .hearingLoss],
                sensation: .unsteadiness,
                headPosition: .standingUp,
                triggers: [.saltyMeal],
                barometricPressure: 1013.0,
                weatherCondition: "Clear / Stable",
                notes: "Salty lunch meal (ramen) followed by mild room spinning while walking outside."
            ),
            AttackEpisode(
                timestamp: calendar.date(byAdding: .day, value: -6, to: now)!,
                duration: .under5Min,
                severity: 1,
                symptoms: [.tinnitus, .lightSensitivity],
                sensation: .lightheadedness,
                headPosition: .standingUp,
                triggers: [.dehydration],
                barometricPressure: 1016.0,
                weatherCondition: "Sunny",
                notes: "Short momentary imbalance when waking up and standing up quickly."
            )
        ]
        saveData()
    }
}
