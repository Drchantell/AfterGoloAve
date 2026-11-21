import SwiftUI

@main
struct AfterGlowAveApp: App {
    var body: some Scene {
        WindowGroup {
            AvenueHome()
                .tint(Color(red: 0.98, green: 0.26, blue: 0.69))
        }
    }
}

private enum Palette {
    static let background = Color(red: 0.09, green: 0.04, blue: 0.15)
    static let panel = Color(red: 0.17, green: 0.09, blue: 0.24)
    static let pink = Color(red: 0.98, green: 0.26, blue: 0.69)
    static let aqua = Color(red: 0.40, green: 0.94, blue: 0.88)
}

private struct City: Identifiable, Hashable {
    let country: String
    let region: String
    let name: String
    var id: String { "\(country)|\(region)|\(name)" }
}

private let cities: [City] = [
    City(country: "Canada", region: "Ontario", name: "Toronto"),
    City(country: "Canada", region: "Quebec", name: "Montreal"),
    City(country: "France", region: "Île-de-France", name: "Paris"),
    City(country: "Germany", region: "Berlin", name: "Berlin"),
    City(country: "Jamaica", region: "Kingston", name: "Kingston"),
    City(country: "Japan", region: "Tokyo", name: "Tokyo"),
    City(country: "Nigeria", region: "Lagos", name: "Lagos"),
    City(country: "South Korea", region: "Seoul", name: "Seoul"),
    City(country: "United Kingdom", region: "England", name: "London"),
    City(country: "United States", region: "California", name: "Los Angeles"),
    City(country: "United States", region: "Florida", name: "Miami"),
    City(country: "United States", region: "Georgia", name: "Atlanta"),
    City(country: "United States", region: "Illinois", name: "Chicago"),
    City(country: "United States", region: "Nevada", name: "Las Vegas"),
    City(country: "United States", region: "New York", name: "Brooklyn"),
    City(country: "United States", region: "New York", name: "New York City"),
    City(country: "United States", region: "North Carolina", name: "Charlotte"),
    City(country: "United States", region: "Texas", name: "Houston")
].sorted {
    if $0.country != $1.country { return $0.country < $1.country }
    if $0.region != $1.region { return $0.region < $1.region }
    return $0.name < $1.name
}

struct AvenueHome: View {
    @AppStorage("aga.confirmedAdult") private var confirmedAdult = false
    @State private var ageConfirmed = false

    var body: some View {
        Group {
            if confirmedAdult {
                TabView {
                    ExploreView()
                        .tabItem { Label("Explore", systemImage: "globe.americas.fill") }
                    GamesView()
                        .tabItem { Label("Arcade", systemImage: "gamecontroller.fill") }
                    FavoritesView()
                        .tabItem { Label("Favorites", systemImage: "heart.fill") }
                    AboutView()
                        .tabItem { Label("About", systemImage: "info.circle") }
                }
            } else {
                VStack(spacing: 22) {
                    Image(systemName: "sparkles.tv")
                        .font(.system(size: 64))
                        .foregroundStyle(Palette.aqua)
                    Text("AfterGlowAve")
                        .font(.largeTitle.bold())
                    Text("Meet me on the Avenue")
                        .font(.title3)
                    Text("A social discovery and game-night preview for adults 18 and older.")
                        .multilineTextAlignment(.center)
                    Toggle("I confirm I am at least 18 years old", isOn: $ageConfirmed)
                        .padding()
                        .background(Palette.panel, in: RoundedRectangle(cornerRadius: 16))
                    Button("Enter the Avenue") { confirmedAdult = true }
                        .buttonStyle(GlowButtonStyle())
                        .disabled(!ageConfirmed)
                    Text("Age confirmation is self-attested in this preview and is not identity verification.")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(24)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .preferredColorScheme(.dark)
        .background(Palette.background)
    }
}

private struct GlowButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(.headline)
            .padding(.horizontal, 20)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity)
            .foregroundStyle(Palette.background)
            .background(Palette.pink, in: RoundedRectangle(cornerRadius: 14))
            .opacity(configuration.isPressed ? 0.75 : 1)
    }
}

private struct ExploreView: View {
    @State private var search = ""
    @State private var country = "All countries"
    @AppStorage("aga.favoriteCityIDs") private var storedFavorites = ""

    private var favorites: Set<String> { Set(storedFavorites.split(separator: "\n").map(String.init)) }
    private var countries: [String] { ["All countries"] + Array(Set(cities.map(\.country))).sorted() }
    private var matches: [City] {
        cities.filter { city in
            (country == "All countries" || city.country == country) &&
            (search.isEmpty || [city.name, city.region, city.country].contains {
                $0.localizedCaseInsensitiveContains(search)
            })
        }
    }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Text("Explore the Avenue")
                        .font(.title.bold())
                    Text("Sample global destinations. Live video lounges and location-based matching are not active.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    Picker("Country", selection: $country) {
                        ForEach(countries, id: \.self) { Text($0).tag($0) }
                    }
                }
                Section("\(matches.count) destinations") {
                    ForEach(matches) { city in
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text(city.name).font(.headline)
                                Text("\(city.region) · \(city.country)")
                                    .font(.subheadline)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Button {
                                var updated = favorites
                                if updated.contains(city.id) { updated.remove(city.id) }
                                else { updated.insert(city.id) }
                                storedFavorites = updated.sorted().joined(separator: "\n")
                            } label: {
                                Image(systemName: favorites.contains(city.id) ? "heart.fill" : "heart")
                                    .foregroundStyle(Palette.pink)
                                    .frame(minWidth: 44, minHeight: 44)
                            }
                            .buttonStyle(.plain)
                            .accessibilityLabel(favorites.contains(city.id) ? "Remove \(city.name) from favorites" : "Save \(city.name) to favorites")
                        }
                    }
                }
            }
            .searchable(text: $search, prompt: "Search cities, states or countries")
            .scrollContentBackground(.hidden)
            .background(Palette.background)
            .navigationTitle("Cities")
        }
    }
}

private struct FavoritesView: View {
    @AppStorage("aga.favoriteCityIDs") private var storedFavorites = ""
    private var favorites: [City] {
        let selected = Set(storedFavorites.split(separator: "\n").map(String.init))
        return cities.filter { selected.contains($0.id) }
    }
    var body: some View {
        NavigationStack {
            List {
                if favorites.isEmpty {
                    ContentUnavailableView("No Saved Cities", systemImage: "heart", description: Text("Open Explore and tap a heart to save a city."))
                } else {
                    ForEach(favorites) { city in
                        VStack(alignment: .leading) {
                            Text(city.name).font(.headline)
                            Text("\(city.region) · \(city.country)").foregroundStyle(.secondary)
                        }
                    }
                    .onDelete { indices in
                        var selected = Set(storedFavorites.split(separator: "\n").map(String.init))
                        for index in indices { selected.remove(favorites[index].id) }
                        storedFavorites = selected.sorted().joined(separator: "\n")
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(Palette.background)
            .navigationTitle("Saved Cities")
        }
    }
}

private struct GamesView: View {
    @State private var board = Array(repeating: "", count: 9)
    @State private var turn = "X"
    @State private var dieA = 1
    @State private var dieB = 1
    @State private var hasRolled = false

    private let winningLines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    private var winner: String? {
        for line in winningLines {
            let mark = board[line[0]]
            if !mark.isEmpty && line.allSatisfy({ board[$0] == mark }) { return mark }
        }
        return nil
    }
    private var finished: Bool { winner != nil || board.allSatisfy { !$0.isEmpty } }
    private var status: String {
        if let winner { return "\(winner) wins!" }
        if finished { return "It's a draw!" }
        return "\(turn)'s turn"
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 22) {
                    Text("Two-player games on one device. Online multiplayer is coming later.")
                        .foregroundStyle(.secondary)
                    VStack(spacing: 12) {
                        Text("Tic-Tac-Toe").font(.title2.bold())
                        Text(status).font(.headline).foregroundStyle(Palette.aqua)
                        ForEach(0..<3, id: \.self) { row in
                            HStack(spacing: 10) {
                                ForEach(0..<3, id: \.self) { col in
                                    let i = row * 3 + col
                                    Button {
                                        guard !finished && board[i].isEmpty else { return }
                                        board[i] = turn
                                        if !finished { turn = turn == "X" ? "O" : "X" }
                                    } label: {
                                        Text(board[i].isEmpty ? " " : board[i])
                                            .font(.system(size: 36, weight: .heavy))
                                            .frame(maxWidth: .infinity)
                                            .frame(height: 84)
                                            .background(Palette.panel, in: RoundedRectangle(cornerRadius: 12))
                                    }
                                    .disabled(finished || !board[i].isEmpty)
                                    .accessibilityLabel("Row \(row + 1), column \(col + 1), \(board[i].isEmpty ? "empty" : board[i])")
                                }
                            }
                        }
                        Button("New Game") {
                            board = Array(repeating: "", count: 9)
                            turn = "X"
                        }
                        .buttonStyle(GlowButtonStyle())
                    }
                    .padding()
                    .background(Palette.background, in: RoundedRectangle(cornerRadius: 18))
                    VStack(spacing: 16) {
                        Text("Roll the Dice").font(.title2.bold())
                        Text("\(dieFace(dieA)) \(dieFace(dieB))")
                            .font(.system(size: 62))
                            .accessibilityLabel("Dice show \(dieA) and \(dieB)")
                        Text(hasRolled ? "You rolled \(dieA + dieB)" : "Ready to roll!")
                            .foregroundStyle(Palette.aqua)
                        Button("Roll Dice") {
                            dieA = Int.random(in: 1...6)
                            dieB = Int.random(in: 1...6)
                            hasRolled = true
                        }
                        .buttonStyle(GlowButtonStyle())
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Palette.background, in: RoundedRectangle(cornerRadius: 18))
                }
                .padding()
            }
            .background(Palette.panel)
            .navigationTitle("Arcade")
        }
    }
    private func dieFace(_ number: Int) -> String {
        ["⚀","⚁","⚂","⚃","⚄","⚅"][max(1,min(number,6))-1]
    }
}

private struct AboutView: View {
    @AppStorage("aga.confirmedAdult") private var confirmedAdult = false
    var body: some View {
        NavigationStack {
            Form {
                Section("AfterGlowAve") {
                    Text("Meet me on the Avenue")
                        .font(.headline)
                    Text("Virtual nightlife, games and global city discovery, designed for adults.")
                    Text("Created by DM and FD")
                }
                Section("Membership") {
                    Text("This iOS preview is free. No paid memberships or in-app purchases are offered.")
                    Text("Live video calls and online matchmaking are not included in this build.")
                }
                Section("Privacy and Safety") {
                    Text("Saved cities and the age-confirmation flag are stored locally on this device.")
                    Text("This preview does not collect account credentials or upload personal profiles.")
                    Button("Reset age confirmation") { confirmedAdult = false }
                }
            }
            .navigationTitle("About AGA")
        }
    }
}
