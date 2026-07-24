import SwiftUI

public struct GroundingView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var store: BalanceLogStore
    
    @State private var breathPhase: String = "Inhale"
    @State private var timerCount: Int = 4
    @State private var scale: CGFloat = 1.0
    
    let timer = Timer.publish(every: 1, on: .main, in: .common).autoconnect()
    
    public var body: some View {
        ZStack {
            Color(red: 0.03, green: 0.12, blue: 0.15)
                .ignoresSafeArea()
            
            VStack(spacing: 30) {
                // Header
                HStack {
                    HStack(spacing: 8) {
                        Image(systemName: "figure.mind.and.body")
                            .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                        Text("Active Vertigo Grounding")
                            .font(.headline)
                            .foregroundColor(.white)
                    }
                    Spacer()
                    Button(action: { dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.title2)
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .padding(.horizontal)
                .padding(.top)
                
                Spacer()
                
                // Visual Fixation Anchor
                VStack(spacing: 8) {
                    Text("VISUAL FIXATION HORIZON")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                    Text("Focus your eyes steadily on the dot below to reduce nystagmus.")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.8))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 30)
                }
                
                // Animated Breathing Circle
                ZStack {
                    Circle()
                        .stroke(Color(red: 0.61, green: 0.93, blue: 0.90).opacity(0.3), lineWidth: 4)
                        .frame(width: 220, height: 220)
                        .scaleEffect(scale)
                        .animation(.easeInOut(duration: 1.0), value: scale)
                    
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.0, green: 0.38, blue: 0.52), Color(red: 0.16, green: 0.48, blue: 0.63)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 160, height: 160)
                        .shadow(color: Color(red: 0.61, green: 0.93, blue: 0.90).opacity(0.4), radius: 15)
                    
                    VStack(spacing: 6) {
                        // Fixation Dot
                        Circle()
                            .fill(Color(red: 0.61, green: 0.93, blue: 0.90))
                            .frame(width: 14, height: 14)
                            .shadow(color: Color(red: 0.61, green: 0.93, blue: 0.90), radius: 8)
                        
                        Text(breathPhase)
                            .font(.headline)
                            .fontWeight(.bold)
                            .foregroundColor(.white)
                        
                        Text("\(timerCount)s")
                            .font(.title2)
                            .fontWeight(.extrabold)
                            .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                    }
                }
                .onReceive(timer) { _ in
                    if timerCount > 1 {
                        timerCount -= 1
                    } else {
                        timerCount = 4
                        if breathPhase == "Inhale" {
                            breathPhase = "Hold"
                            scale = 1.05
                        } else if breathPhase == "Hold" {
                            breathPhase = "Exhale"
                            scale = 0.9
                        } else {
                            breathPhase = "Inhale"
                            scale = 1.15
                        }
                    }
                }
                
                // Clinical Reassurance Box
                VStack(alignment: .leading, spacing: 8) {
                    HStack {
                        Image(systemName: "cross.case.fill")
                            .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                        Text("Vestibular Instructions")
                            .font(.subheadline)
                            .fontWeight(.bold)
                            .foregroundColor(Color(red: 0.61, green: 0.93, blue: 0.90))
                    }
                    Text("• Sit or lie flat with your head firmly supported.")
                    Text("• Avoid rapid head turning or looking down.")
                    Text("• Keep breathing steadily. The dizziness episode will subside.")
                }
                .font(.caption)
                .foregroundColor(.white.opacity(0.9))
                .padding()
                .background(Color.white.opacity(0.1))
                .cornerRadius(16)
                .padding(.horizontal)
                
                Spacer()
                
                // ICE Call Button
                if let phoneURL = URL(string: "tel:\(store.settings.emergencyContactPhone)"), UIApplication.shared.canOpenURL(phoneURL) {
                    Button(action: { UIApplication.shared.open(phoneURL) }) {
                        HStack {
                            Image(systemName: "phone.fill")
                            Text("Call Emergency Contact (\(store.settings.emergencyContactName))")
                        }
                        .font(.subheadline)
                        .fontWeight(.bold)
                        .foregroundColor(.white)
                        .padding()
                        .frame(maxWidth: .infinity)
                        .background(Color.red)
                        .cornerRadius(14)
                        .padding(.horizontal)
                    }
                }
            }
            .padding(.vertical)
        }
    }
}
