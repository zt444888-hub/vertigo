import Foundation

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
}
