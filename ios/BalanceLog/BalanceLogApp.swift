import SwiftUI

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
}
