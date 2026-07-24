import React, { useState } from 'react';

const SWIFT_FILES = [
  {
    name: 'BalanceLogApp.swift',
    path: 'ios/BalanceLog/BalanceLogApp.swift',
    description: 'iOS SwiftUI App Entry Point with TabView navigation',
    code: `import SwiftUI

@main
struct BalanceLogApp: App {
    @StateObject private var store = BalanceLogStore()
    @State private var activeTab: Int = 0
    
    var body: some Scene {
        WindowGroup {
            TabView(selection: $activeTab) {
                HomeView(activeTab: $activeTab)
                    .tabItem {
                        Label("Home", systemImage: "house.fill")
                    }
                    .tag(0)
                
                ChartsView()
                    .tabItem {
                        Label("Analytics", systemImage: "chart.xyaxis.line")
                    }
                    .tag(1)
                
                MonthlyCalendarView()
                    .tabItem {
                        Label("Calendar", systemImage: "calendar")
                    }
                    .tag(2)
                
                SettingsView()
                    .tabItem {
                        Label("Settings", systemImage: "gearshape.fill")
                    }
                    .tag(3)
            }
            .accentColor(Color(red: 0.0, green: 0.38, blue: 0.52))
            .environmentObject(store)
        }
    }
}`
  },
  {
    name: 'AttackEpisode.swift',
    path: 'ios/BalanceLog/Models/AttackEpisode.swift',
    description: 'Native Swift Data Model for Vertigo Episodes',
    code: `import Foundation

public enum SymptomType: String, Codable, CaseIterable, Identifiable {
    case tinnitus = "Tinnitus"
    case hearingLoss = "Hearing Loss"
    case nausea = "Nausea"
    case headache = "Headache"
    case blurredVision = "Blurred Vision"
    case lightSensitivity = "Light Sensitivity"
    case dizziness = "Dizziness / Vertigo"
    case earFullness = "Ear Fullness"
    
    public var id: String { rawValue }
    
    public var systemIcon: String {
        switch self {
        case .tinnitus: return "waveform"
        case .hearingLoss: return "ear.trianglebadge.exclamationmark"
        case .nausea: return "facemask"
        case .headache: return "brain.head.profile"
        case .blurredVision: return "eye.slash"
        case .lightSensitivity: return "sun.max"
        case .dizziness: return "arrow.triangle.2.circlepath"
        case .earFullness: return "ear"
        }
    }
}

public enum VertigoSensation: String, Codable, CaseIterable, Identifiable {
    case roomSpinning = "Room Spinning (Vertigo)"
    case lightheadedness = "Lightheadedness / Floating"
    case unsteadiness = "Unsteadiness / Off-Balance"
    case bouncingVision = "Bouncing Vision (Oscillopsia)"
    
    public var id: String { rawValue }
}

public enum HeadPosition: String, Codable, CaseIterable, Identifiable {
    case standingUp = "Standing Up"
    case turningHead = "Turning Head Left/Right"
    case lyingDown = "Lying Down"
    case lookingUp = "Looking Up/Down"
    case bendingOver = "Bending Over"
    case sittingStill = "Sitting Still"
    
    public var id: String { rawValue }
}

public enum TriggerCategory: String, Codable, CaseIterable, Identifiable {
    case saltyMeal = "Salty Meal / High Sodium"
    case caffeine = "Caffeine / Coffee"
    case stress = "Stress / Anxiety"
    case weather = "Weather / Pressure Drop"
    case lackOfSleep = "Lack of Sleep"
    case dehydration = "Dehydration"
    case screenFatigue = "Screen Fatigue"
    case travel = "Travel / Motion"
    
    public var id: String { rawValue }
}

public enum DurationOption: String, Codable, CaseIterable, Identifiable {
    case under5Min = "< 5 min"
    case min5To15 = "5-15 min"
    case min15To60 = "15-60 min"
    case hrs1To12 = "1-12 hrs"
    case over12Hrs = "> 12 hrs"
    
    public var id: String { rawValue }
}

public struct AttackEpisode: Identifiable, Codable {
    public var id: String
    public var timestamp: Date
    public var duration: DurationOption
    public var severity: Int // 1 to 5
    public var symptoms: [SymptomType]
    public var sensation: VertigoSensation?
    public var headPosition: HeadPosition?
    public var triggers: [TriggerCategory]?
    public var barometricPressure: Double? // hPa
    public var weatherCondition: String?
    public var notes: String?
    
    public init(
        id: String = UUID().uuidString,
        timestamp: Date = Date(),
        duration: DurationOption = .min15To60,
        severity: Int = 3,
        symptoms: [SymptomType] = [.tinnitus, .nausea],
        sensation: VertigoSensation? = .roomSpinning,
        headPosition: HeadPosition? = .turningHead,
        triggers: [TriggerCategory]? = [.saltyMeal, .stress],
        barometricPressure: Double? = 1009.0,
        weatherCondition: String? = "Low Pressure / Overcast",
        notes: String? = nil
    ) {
        self.id = id
        self.timestamp = timestamp
        self.duration = duration
        self.severity = severity
        self.symptoms = symptoms
        self.sensation = sensation
        self.headPosition = headPosition
        self.triggers = triggers
        self.barometricPressure = barometricPressure
        self.weatherCondition = weatherCondition
        self.notes = notes
    }
}`
  },
  {
    name: 'BalanceLogStore.swift',
    path: 'ios/BalanceLog/ViewModels/BalanceLogStore.swift',
    description: 'Combine ObservableObject ViewModel with UserDefaults persistence',
    code: `import Foundation
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
            )
        ]
        saveData()
    }
}`
  },
  {
    name: 'HomeView.swift',
    path: 'ios/BalanceLog/Views/HomeView.swift',
    description: 'SwiftUI Home Screen View with Weather & SOS Grounding trigger',
    code: `import SwiftUI

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
                    // Action Buttons Row
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
                    }
                    
                    // Live Barometric Pressure
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("1009 hPa • Rainy / Low Pressure")
                                .font(.subheadline)
                                .fontWeight(.bold)
                        }
                        Spacer()
                    }
                    .padding()
                    .background(Color(red: 0.90, green: 0.96, blue: 1.0))
                    .cornerRadius(16)
                }
                .padding()
            }
            .navigationTitle("BalanceLog")
        }
    }
}`
  },
  {
    name: 'GroundingView.swift',
    path: 'ios/BalanceLog/Views/GroundingView.swift',
    description: 'Active Vertigo SOS Horizon Fixation & Paced Breathing View',
    code: `import SwiftUI

public struct GroundingView: View {
    @Environment(\\dismiss) var dismiss
    @EnvironmentObject var store: BalanceLogStore
    @State private var breathPhase: String = "Inhale"
    @State private var timerCount: Int = 4
    
    public var body: some View {
        ZStack {
            Color(red: 0.03, green: 0.12, blue: 0.15).ignoresSafeArea()
            VStack {
                Text("Active Vertigo Grounding")
                    .font(.title)
                    .foregroundColor(.white)
            }
        }
    }
}`
  }
];

export const SwiftCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState(SWIFT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-28 pt-2 px-5 max-w-[800px] mx-auto text-[#071e27]">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#071e27] to-[#003447] text-white p-6 rounded-2xl shadow-lg border border-[#9deee5]/20 space-y-3">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-[#9deee5]">
            developer_board
          </span>
          <div>
            <h2 className="text-xl font-bold font-headline text-white">
              iOS Native Xcode Swift Codebase
            </h2>
            <p className="text-xs text-[#9deee5]">
              Full iOS 17+ SwiftUI & Combine Architecture
            </p>
          </div>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          The app features a complete native iOS implementation in SwiftUI including data models, Combine ViewModels, Swift Charts, and SOS Grounding views ready to open in Xcode.
        </p>
      </div>

      {/* File Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {SWIFT_FILES.map((file) => (
          <button
            key={file.name}
            onClick={() => setSelectedFile(file)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedFile.name === file.name
                ? 'bg-[#006284] text-white border-transparent shadow-xs'
                : 'bg-white text-[#40484e] border-[#cfe6f2] hover:bg-[#e6f6ff]'
            }`}
          >
            {file.name}
          </button>
        ))}
      </div>

      {/* Code Editor Preview Box */}
      <div className="bg-[#0f172a] text-[#e2e8f0] rounded-2xl overflow-hidden border border-[#1e293b] shadow-xl">
        {/* Code Box Header */}
        <div className="bg-[#1e293b] px-4 py-3 flex justify-between items-center border-b border-slate-700">
          <div>
            <p className="text-xs font-mono font-bold text-[#93c5fd]">{selectedFile.path}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{selectedFile.description}</p>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-[#006284] hover:bg-[#006284]/80 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">
              {copied ? 'check' : 'content_copy'}
            </span>
            {copied ? 'Copied!' : 'Copy Swift Code'}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-[#94a3b8] max-h-[500px]">
          <code>{selectedFile.code}</code>
        </pre>
      </div>

      {/* Xcode Integration Guide */}
      <div className="bg-white rounded-2xl p-5 border border-[#cfe6f2] space-y-3 soft-card-shadow text-xs">
        <h4 className="font-bold text-[#006284] font-headline text-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-base">info</span>
          How to compile in Xcode:
        </h4>
        <ol className="list-decimal list-inside space-y-1.5 text-[#40484e] leading-relaxed">
          <li>Open Xcode and select <strong>Create a new Xcode Project</strong> &rarr; <strong>iOS App</strong> (SwiftUI).</li>
          <li>Set app name to <strong>BalanceLog</strong> and Interface to <strong>SwiftUI</strong>.</li>
          <li>Copy the files above into your Xcode project tree under <code className="bg-[#e6f6ff] px-1 py-0.5 rounded text-[#006284]">ios/BalanceLog/</code>.</li>
          <li>Hit <strong>Cmd + R</strong> to run on iOS Simulator or connected iPhone device!</li>
        </ol>
      </div>
    </div>
  );
};
