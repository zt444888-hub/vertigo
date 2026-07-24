import SwiftUI

public struct LogAttackView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var store: BalanceLogStore
    
    @State private var timestamp: Date = Date()
    @State private var duration: DurationOption = .min15To60
    @State private var severity: Double = 3.0
    @State private var sensation: VertigoSensation = .roomSpinning
    @State private var headPosition: HeadPosition = .turningHead
    @State private var selectedSymptoms: Set<SymptomType> = [.tinnitus, .nausea]
    @State private var selectedTriggers: Set<TriggerCategory> = [.saltyMeal, .stress]
    @State private var notes: String = ""
    @State private var isRecordingVoice = false
    
    public var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Onset Date & Time")) {
                    DatePicker("Onset Time", selection: $timestamp, displayedComponents: [.date, .hourAndMinute])
                }
                
                Section(header: Text("Duration")) {
                    Picker("Duration", selection: $duration) {
                        ForEach(DurationOption.allCases) { opt in
                            Text(opt.rawValue).tag(opt)
                        }
                    }
                    .pickerStyle(.segmented)
                }
                
                Section(header: Text("Severity Level (\(Int(severity)) / 5)")) {
                    Slider(value: $severity, in: 1...5, step: 1) {
                        Text("Severity")
                    } minimumValueLabel: {
                        Text("1")
                    } maximumValueLabel: {
                        Text("5")
                    }
                    .tint(Color(red: 0.0, green: 0.38, blue: 0.52))
                }
                
                Section(header: Text("Dizziness Sensation")) {
                    Picker("Sensation", selection: $sensation) {
                        ForEach(VertigoSensation.allCases) { sens in
                            Text(sens.rawValue).tag(sens)
                        }
                    }
                }
                
                Section(header: Text("Head Movement Position")) {
                    Picker("Head Position", selection: $headPosition) {
                        ForEach(HeadPosition.allCases) { pos in
                            Text(pos.rawValue).tag(pos)
                        }
                    }
                }
                
                Section(header: Text("Associated Symptoms")) {
                    ForEach(SymptomType.allCases) { symptom in
                        Button(action: {
                            if selectedSymptoms.contains(symptom) {
                                selectedSymptoms.remove(symptom)
                            } else {
                                selectedSymptoms.insert(symptom)
                            }
                        }) {
                            HStack {
                                Image(systemName: symptom.systemIcon)
                                    .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                                Text(symptom.rawValue)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedSymptoms.contains(symptom) {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(Color(red: 0.0, green: 0.38, blue: 0.52))
                                }
                            }
                        }
                    }
                }
                
                Section(header: Text("Suspected Triggers")) {
                    ForEach(TriggerCategory.allCases) { trig in
                        Button(action: {
                            if selectedTriggers.contains(trig) {
                                selectedTriggers.remove(trig)
                            } else {
                                selectedTriggers.insert(trig)
                            }
                        }) {
                            HStack {
                                Text(trig.rawValue)
                                    .foregroundColor(.primary)
                                Spacer()
                                if selectedTriggers.contains(trig) {
                                    Image(systemName: "checkmark")
                                        .foregroundColor(Color(red: 0.05, green: 0.43, blue: 0.39))
                                }
                            }
                        }
                    }
                }
                
                Section(header: Text("Trigger Notes / Dictation")) {
                    Button(action: {
                        isRecordingVoice = true
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                            isRecordingVoice = false
                            notes += (notes.isEmpty ? "" : "\n") + "[VoiceNote: Felt sudden ear ringing and dizziness after lunch.]"
                        }
                    }) {
                        HStack {
                            Image(systemName: isRecordingVoice ? "waveform.circle.fill" : "mic.fill")
                                .foregroundColor(isRecordingVoice ? .red : Color(red: 0.0, green: 0.38, blue: 0.52))
                            Text(isRecordingVoice ? "Listening..." : "Record Voice Note")
                                .fontWeight(.semibold)
                        }
                    }
                    
                    TextEditor(text: $notes)
                        .frame(height: 100)
                }
            }
            .navigationTitle("Record Episode")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let newEp = AttackEpisode(
                            timestamp: timestamp,
                            duration: duration,
                            severity: Int(severity),
                            symptoms: Array(selectedSymptoms),
                            sensation: sensation,
                            headPosition: headPosition,
                            triggers: Array(selectedTriggers),
                            barometricPressure: 1009.0,
                            weatherCondition: "Low Pressure / Overcast",
                            notes: notes.isEmpty ? nil : notes
                        )
                        store.addEpisode(newEp)
                        dismiss()
                    }
                    .fontWeight(.bold)
                }
            }
        }
    }
}
