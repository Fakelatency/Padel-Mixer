// ==========================================
// i18n — Polish (default), English & German
// ==========================================

import { brand } from './brand';

export type Locale = 'pl' | 'en' | 'es' | 'ua';

export interface Translations {
    // General
    appName: string;
    newTournament: string;
    continueTournament: string;
    deleteTournament: string;
    noTournaments: string;
    savedTournaments: string;
    backToHome: string;
    language: string;

    // Tournament formats
    formatAmericano: string;
    formatMixedAmericano: string;
    formatTeamAmericano: string;
    formatMexicano: string;
    formatMixedMexicano: string;
    formatTeamMexicano: string;
    formatAmericanoDesc: string;
    formatMixedAmericanoDesc: string;
    formatTeamAmericanoDesc: string;
    formatMexicanoDesc: string;
    formatMixedMexicanoDesc: string;
    formatTeamMexicanoDesc: string;

    // Setup
    setupTitle: string;
    stepFormat: string;
    stepPlayers: string;
    stepSettings: string;
    stepReview: string;
    selectFormat: string;
    addPlayers: string;
    playerName: string;
    addPlayer: string;
    removePlayer: string;
    tournamentName: string;
    numberOfCourts: string;
    scoringSystem: string;
    pointsPerMatch: string;
    startTournament: string;
    next: string;
    back: string;
    review: string;
    players: string;
    courts: string;
    format: string;
    gender: string;
    male: string;
    female: string;
    teamName: string;
    addTeam: string;
    assignToTeam: string;
    teamMode: string;
    rotatingTeams: string;
    fixedTeams: string;

    // Active tournament
    matches: string;
    leaderboard: string;
    stats: string;
    round: string;
    currentRound: string;
    court: string;
    vs: string;
    score: string;
    enterScore: string;
    saveScore: string;
    nextRound: string;
    finishTournament: string;
    sittingOut: string;
    allMatchesCompleted: string;
    enterAllScores: string;
    roundOf: string;

    // Leaderboard
    position: string;
    player: string;
    points: string;
    played: string;
    won: string;
    lost: string;
    diff: string;
    pauses: string;

    // Results
    results: string;
    tournamentResults: string;
    champion: string;
    podium: string;
    finalStandings: string;
    matchHistory: string;
    expand: string;
    collapse: string;
    shareResults: string;
    linkCopied: string;
    shareDescription: string;
    pointsTotal: string;
    matchesTotal: string;

    // Sorting
    sortResults: string;
    sortByPoints: string;
    sortByWins: string;

    // Last match
    lastMatch: string;
    lastMatchConfirm: string;
    lastMatchWarning: string;
    previousRounds: string;

    // Repeat
    repeatTournament: string;
    repeatTournamentDesc: string;

    // Misc
    confirmDelete: string;
    cancel: string;
    confirm: string;
    close: string;
    error: string;
    success: string;
    warning: string;
    minPlayersRequired: string;
    evenPlayersRequired: string;
    roundModeLabel: string;
    roundModeFixed: string;
    roundModeUnlimited: string;
    byePoints: string;
    numberOfRounds: string;
    totalRounds: string;

    // Priority
    rankingPriority: string;
    rankingPriorityDesc: string;
    priorityWins: string;

    // Final Pairing Options
    finalPairingTitle: string;
    pairing1: string;
    pairing2: string;
    pairing3: string;
    priorityLabel: string;

    // Search & pagination
    searchTournaments: string;
    filterAll: string;
    filterActive: string;
    filterFinished: string;
    previousPage: string;
    nextPage: string;
    pageOf: string;

    // Auth
    login: string;
    loginSubtitle: string;
    loginError: string;
    loginLink: string;
    register: string;
    registerSubtitle: string;
    registerError: string;
    registerLink: string;
    email: string;
    password: string;
    logout: string;
    noAccount: string;
    hasAccount: string;

    // Profile
    myProfile: string;
    profile: string;
    memberSince: string;
    tournamentsPlayed: string;
    tournamentsWon: string;
    winRate: string;
    avgPointsPerMatch: string;
    recentTournaments: string;
    bestPartners: string;
    sharedWins: string;
    noStatsYet: string;
    noStatsDesc: string;
    placement: string;
    viewProfile: string;

    // Player adding modes
    addGuest: string;
    addMember: string;
    searchUsers: string;
    noUsersFound: string;

    // Public Leaderboard
    publicLeaderboard: string;
    leaderboardSubtitle: string;
    periodDaily: string;
    periodWeekly: string;
    periodMonthly: string;
    periodOverall: string;
    typeAll: string;
    typeOfficial: string;
    tournaments: string;
    noLeaderboardData: string;
    gallery: string;

    // Gallery
    uploadPhoto: string;
    uploadPhotoTitle: string;
    caption: string;
    noTournamentLink: string;
    uploading: string;
    noPhotos: string;
    loadingGallery: string;

    // Cookie Consent
    cookieConsentTitle: string;
    cookieConsentDesc: string;
    cookieAcceptAll: string;
    cookieDeclineOptional: string;
    cookieSettings: string;
    cookieSettingsTitle: string;
    cookieEssentialTitle: string;
    cookieEssentialDesc: string;
    cookieAnalyticsTitle: string;
    cookieAnalyticsDesc: string;
    cookieSavePreferences: string;
    cookiePreferences: string;
}

const pl: Translations = {
    appName: brand.appTitle,
    newTournament: 'Nowy turniej',
    continueTournament: 'Kontynuuj',
    deleteTournament: 'Usuń turniej',
    noTournaments: 'Brak zapisanych turniejów. Utwórz swój pierwszy turniej!',
    savedTournaments: 'Zapisane turnieje',
    backToHome: 'Strona główna',
    language: 'Język',

    formatAmericano: 'AMERICANO',
    formatMixedAmericano: 'AMERICANO MIKST',
    formatTeamAmericano: 'AMERICANO DUET',
    formatMexicano: 'MEXICANO',
    formatMixedMexicano: 'MEXICANO MIKST',
    formatTeamMexicano: 'MEXICANO DUET',
    formatAmericanoDesc: 'Dynamiczna forma rozgrywki, w której system losowo dobiera partnerów i przeciwników.',
    formatMixedAmericanoDesc: 'Pary zawsze składają się z kobiety i mężczyzny. Punkty drużynowe.',
    formatTeamAmericanoDesc: 'Stałe drużyny 2-osobowe. Punkty liczone drużynowo.',
    formatMexicanoDesc: 'Dynamiczna forma rozgrywki, w której system dobiera partnerów i przeciwników na podstawie poziomu i ich ostatnich wyników.',
    formatMixedMexicanoDesc: 'MEXICANO w stałych parach. W każdej parze musi znaleźć się jedna kobieta i jeden mężczyzna.',
    formatTeamMexicanoDesc: 'To nic innego jak MEXICANO w stałych parach.',

    setupTitle: 'Konfiguracja turnieju',
    stepFormat: 'Format',
    stepPlayers: 'Gracze',
    stepSettings: 'Ustawienia',
    stepReview: 'Podsumowanie',
    selectFormat: 'Wybierz format turnieju',
    addPlayers: 'Dodaj graczy',
    playerName: 'Imię gracza',
    addPlayer: 'Dodaj gracza',
    removePlayer: 'Usuń',
    tournamentName: 'Nazwa turnieju',
    numberOfCourts: 'Liczba kortów',
    scoringSystem: 'System punktowy',
    pointsPerMatch: 'punktów na mecz',
    startTournament: 'Rozpocznij turniej',
    next: 'Dalej',
    back: 'Wstecz',
    review: 'Podsumowanie',
    players: 'Gracze',
    courts: 'Korty',
    format: 'Format',
    gender: 'Płeć',
    male: 'Mężczyzna',
    female: 'Kobieta',
    teamName: 'Nazwa drużyny',
    addTeam: 'Dodaj drużynę',
    assignToTeam: 'Przypisz do drużyny',
    teamMode: 'Tryb drużynowy',
    rotatingTeams: 'Zmienne pary',
    fixedTeams: 'Stałe pary',

    matches: 'Mecze',
    leaderboard: 'Tabela',
    stats: 'Statystyki',
    round: 'Runda',
    currentRound: 'Aktualna runda',
    court: 'Kort',
    vs: 'vs',
    score: 'Wynik',
    enterScore: 'Wprowadź wynik',
    saveScore: 'Zapisz wynik',
    nextRound: 'Zakończ rundę',
    finishTournament: 'Zakończ turniej',
    sittingOut: 'Pauzują',
    allMatchesCompleted: 'Wszystkie mecze zakończone',
    enterAllScores: 'Wprowadź wyniki wszystkich meczy aby kontynuować',
    roundOf: 'z',

    position: 'Poz.',
    player: 'Gracz',
    points: 'Punkty',
    played: 'Mecze',
    won: 'Wygrane',
    lost: 'Przegrane',
    diff: '+/-',
    pauses: 'Pauzy',

    results: 'Wyniki',
    tournamentResults: 'Wyniki turnieju',
    champion: 'Mistrz',
    podium: 'Podium',
    finalStandings: 'Klasyfikacja końcowa',
    matchHistory: 'Historia meczy',
    expand: 'Rozwiń',
    collapse: 'Zwiń',
    shareResults: 'Udostępnij wyniki',
    linkCopied: 'Link skopiowany!',
    shareDescription: 'Udostępnij link z wynikami turnieju',
    pointsTotal: 'Punkty łącznie',
    matchesTotal: 'Mecze łącznie',

    sortResults: 'Sortowanie',
    sortByPoints: 'Po punktach',
    sortByWins: 'Po wygranych',
    lastMatch: 'Ostatni mecz',
    lastMatchConfirm: 'Czy na pewno chcesz zagrać ostatni mecz?',
    lastMatchWarning: 'Po wprowadzeniu wyników turniej zostanie zakończony.',
    previousRounds: 'Poprzednie rundy',
    repeatTournament: 'Powtórz turniej',
    repeatTournamentDesc: 'Stwórz nowy turniej z tymi samymi ustawieniami',

    confirmDelete: 'Czy na pewno chcesz usunąć ten turniej?',
    cancel: 'Anuluj',
    confirm: 'Potwierdź',
    close: 'Zamknij',
    error: 'Błąd',
    success: 'Sukces',
    warning: 'Uwaga',
    minPlayersRequired: 'Wymagana minimalna liczba graczy:',
    evenPlayersRequired: 'Wymagana parzysta liczba graczy',
    roundModeLabel: 'Tryb rund',
    roundModeFixed: 'Określona liczba',
    roundModeUnlimited: 'Nielimitowane',
    byePoints: '+11 pkt za pauzę',
    numberOfRounds: 'Liczba rund',
    totalRounds: 'Liczba Rund',

    rankingPriority: 'Priorytet Rankingu',
    rankingPriorityDesc: 'Zdecyduj, co ważniejsze: zdobyte punkty czy liczba wygranych meczów.',
    priorityWins: 'Wygrane',

    finalPairingTitle: 'Końcowe parowanie',
    pairing1: '1 & 2 vs 3 & 4',
    pairing2: '1 & 3 vs 2 & 4',
    pairing3: '1 & 4 vs 2 & 3',
    priorityLabel: 'Priorytet',
    searchTournaments: 'Szukaj turnieju...',
    filterAll: 'Wszystkie',
    filterActive: 'Aktywne',
    filterFinished: 'Zakończone',
    previousPage: 'Poprzednia',
    nextPage: 'Następna',
    pageOf: 'z',

    login: 'Zaloguj się',
    loginSubtitle: 'Zaloguj się, aby zarządzać turniejami',
    loginError: 'Nieprawidłowy email lub hasło',
    loginLink: 'Zaloguj się',
    register: 'Zarejestruj się',
    registerSubtitle: 'Utwórz konto, aby zapisywać turnieje',
    registerError: 'Błąd rejestracji. Spróbuj ponownie.',
    registerLink: 'Zarejestruj się',
    email: 'Email',
    password: 'Hasło',
    logout: 'Wyloguj',
    noAccount: 'Nie masz konta?',
    hasAccount: 'Masz już konto?',

    myProfile: 'Mój profil',
    profile: 'Profil',
    memberSince: 'Członek od',
    tournamentsPlayed: 'Turnieje',
    tournamentsWon: 'Wygrane turnieje',
    winRate: '% wygranych',
    avgPointsPerMatch: 'Śr. pkt/mecz',
    recentTournaments: 'Ostatnie turnieje',
    bestPartners: 'Najlepsi partnerzy',
    sharedWins: 'wspólne wygrane',
    noStatsYet: 'Brak statystyk',
    noStatsDesc: 'Zagraj w turnieje, aby zobaczyć swoje statystyki.',
    placement: 'miejsce',
    viewProfile: 'Profil',

    addGuest: 'Dodaj gościa',
    addMember: 'Dodaj członka',
    searchUsers: 'Szukaj użytkownika...',
    noUsersFound: 'Nie znaleziono użytkowników',

    publicLeaderboard: 'Ranking graczy',
    leaderboardSubtitle: 'Statystyki graczy ze wszystkich turniejów',
    periodDaily: 'Dziś',
    periodWeekly: 'Tydzień',
    periodMonthly: 'Miesiąc',
    periodOverall: 'Ogólny',
    typeAll: 'Wszystkie turnieje',
    typeOfficial: 'Oficjalne',
    tournaments: 'Turnieje',
    noLeaderboardData: 'Brak danych do wyświetlenia',
    gallery: 'Galeria',

    uploadPhoto: 'Dodaj zdjęcie',
    uploadPhotoTitle: 'Prześlij zdjęcie',
    caption: 'Podpis (opcjonalnie)',
    noTournamentLink: 'Bez powiązania z turniejem',
    uploading: 'Przesyłanie...',
    noPhotos: 'Brak zdjęć w galerii',
    loadingGallery: 'Ładowanie galerii...',

    cookieConsentTitle: 'Prywatność i pliki cookie',
    cookieConsentDesc: 'Używamy plików cookie oraz technologii analitycznych (Google Analytics), aby analizować ruch w aplikacji i usprawniać jej działanie. Możesz zaakceptować wszystkie pliki cookie lub dostosować swoje preferencje.',
    cookieAcceptAll: 'Zaakceptuj wszystkie',
    cookieDeclineOptional: 'Tylko niezbędne',
    cookieSettings: 'Dostosuj',
    cookieSettingsTitle: 'Ustawienia prywatności i plików cookie',
    cookieEssentialTitle: 'Niezbędne pliki cookie',
    cookieEssentialDesc: 'Wymagane do prawidłowego działania aplikacji, autoryzacji sesji oraz zapamiętywania preferencji językowych.',
    cookieAnalyticsTitle: 'Analityczne pliki cookie (Google Analytics)',
    cookieAnalyticsDesc: 'Pomagają nam zrozumieć, jak użytkownicy korzystają z aplikacji, generując anonimowe statystyki odwiedzin.',
    cookieSavePreferences: 'Zapisz preferencje',
    cookiePreferences: 'Ustawienia cookies',
};

const en: Translations = {
    appName: brand.appTitle,
    newTournament: 'New Tournament',
    continueTournament: 'Continue',
    deleteTournament: 'Delete Tournament',
    noTournaments: 'No saved tournaments. Create your first tournament!',
    savedTournaments: 'Saved Tournaments',
    backToHome: 'Home',
    language: 'Language',

    formatAmericano: 'AMERICANO',
    formatMixedAmericano: 'Mixed Americano',
    formatTeamAmericano: 'Team Americano',
    formatMexicano: 'MEXICANO',
    formatMixedMexicano: 'MEXICANO MIXED',
    formatTeamMexicano: 'MEXICANO DUET',
    formatAmericanoDesc: 'Dynamic game format where the system randomly selects partners and opponents.',
    formatMixedAmericanoDesc: 'Pairs are always male + female. Individual scoring.',
    formatTeamAmericanoDesc: 'Fixed 2-player teams. Team scoring.',
    formatMexicanoDesc: 'Dynamic game format where the system selects partners and opponents based on level and recent results.',
    formatMixedMexicanoDesc: 'MEXICANO in fixed pairs. Each pair must consist of one female and one male.',
    formatTeamMexicanoDesc: 'Simply MEXICANO in fixed pairs.',

    setupTitle: 'Tournament Setup',
    stepFormat: 'Format',
    stepPlayers: 'Players',
    stepSettings: 'Settings',
    stepReview: 'Review',
    selectFormat: 'Select tournament format',
    addPlayers: 'Add Players',
    playerName: 'Player name',
    addPlayer: 'Add Player',
    removePlayer: 'Remove',
    tournamentName: 'Tournament name',
    numberOfCourts: 'Number of courts',
    scoringSystem: 'Scoring system',
    pointsPerMatch: 'points per match',
    startTournament: 'Start Tournament',
    next: 'Next',
    back: 'Back',
    review: 'Review',
    players: 'Players',
    courts: 'Courts',
    format: 'Format',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    teamName: 'Team name',
    addTeam: 'Add team',
    assignToTeam: 'Assign to team',
    teamMode: 'Team mode',
    rotatingTeams: 'Rotating pairs',
    fixedTeams: 'Fixed pairs',

    matches: 'Matches',
    leaderboard: 'Leaderboard',
    stats: 'Stats',
    round: 'Round',
    currentRound: 'Current Round',
    court: 'Court',
    vs: 'vs',
    score: 'Score',
    enterScore: 'Enter score',
    saveScore: 'Save score',
    nextRound: 'Next Round',
    finishTournament: 'Finish Tournament',
    sittingOut: 'Sitting Out',
    allMatchesCompleted: 'All matches completed',
    enterAllScores: 'Enter all match scores to continue',
    roundOf: 'of',

    position: 'Pos.',
    player: 'Player',
    points: 'Points',
    played: 'Played',
    won: 'Won',
    lost: 'Lost',
    diff: '+/-',
    pauses: 'Pauses',

    results: 'Results',
    tournamentResults: 'Tournament Results',
    champion: 'Champion',
    podium: 'Podium',
    finalStandings: 'Final Standings',
    matchHistory: 'Match History',
    expand: 'Expand',
    collapse: 'Collapse',
    shareResults: 'Share Results',
    linkCopied: 'Link copied!',
    shareDescription: 'Share a link with tournament results',
    pointsTotal: 'Total Points',
    matchesTotal: 'Total Matches',

    sortResults: 'Sort by',
    sortByPoints: 'By Points',
    sortByWins: 'By Wins',
    lastMatch: 'Last Match',
    lastMatchConfirm: 'Are you sure you want to play the last match?',
    lastMatchWarning: 'The tournament will end after entering the scores.',
    previousRounds: 'Previous Rounds',
    repeatTournament: 'Repeat Tournament',
    repeatTournamentDesc: 'Create a new tournament with the same settings',

    confirmDelete: 'Are you sure you want to delete this tournament?',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    minPlayersRequired: 'Minimum players required:',
    evenPlayersRequired: 'Even number of players required',
    roundModeLabel: 'Round mode',
    roundModeFixed: 'Fixed rounds',
    roundModeUnlimited: 'Unlimited',
    byePoints: '+11 pts bye',
    numberOfRounds: 'Number of rounds',
    totalRounds: 'Total Rounds',

    rankingPriority: 'Ranking Priority',
    rankingPriorityDesc: 'Decide what matters more: total points scored or matches won.',
    priorityWins: 'Wins',

    finalPairingTitle: 'Final Pairing',
    pairing1: '1 & 2 vs 3 & 4',
    pairing2: '1 & 3 vs 2 & 4',
    pairing3: '1 & 4 vs 2 & 3',
    priorityLabel: 'Priority',
    searchTournaments: 'Search tournaments...',
    filterAll: 'All',
    filterActive: 'Active',
    filterFinished: 'Finished',
    previousPage: 'Previous',
    nextPage: 'Next',
    pageOf: 'of',

    login: 'Sign In',
    loginSubtitle: 'Sign in to manage your tournaments',
    loginError: 'Invalid email or password',
    loginLink: 'Sign in',
    register: 'Sign Up',
    registerSubtitle: 'Create an account to save your tournaments',
    registerError: 'Registration failed. Please try again.',
    registerLink: 'Sign up',
    email: 'Email',
    password: 'Password',
    logout: 'Logout',
    noAccount: 'Don\'t have an account?',
    hasAccount: 'Already have an account?',

    myProfile: 'My Profile',
    profile: 'Profile',
    memberSince: 'Member since',
    tournamentsPlayed: 'Tournaments',
    tournamentsWon: 'Tournaments won',
    winRate: 'Win rate',
    avgPointsPerMatch: 'Avg pts/match',
    recentTournaments: 'Recent Tournaments',
    bestPartners: 'Best Partners',
    sharedWins: 'shared wins',
    noStatsYet: 'No stats yet',
    noStatsDesc: 'Play some tournaments to see your stats.',
    placement: 'place',
    viewProfile: 'Profile',

    addGuest: 'Add Guest',
    addMember: 'Add Member',
    searchUsers: 'Search users...',
    noUsersFound: 'No users found',

    publicLeaderboard: 'Player Rankings',
    leaderboardSubtitle: 'Player statistics across all tournaments',
    periodDaily: 'Today',
    periodWeekly: 'Week',
    periodMonthly: 'Month',
    periodOverall: 'Overall',
    typeAll: 'All Tournaments',
    typeOfficial: 'Official',
    tournaments: 'Tournaments',
    noLeaderboardData: 'No data to display',
    gallery: 'Gallery',

    uploadPhoto: 'Upload photo',
    uploadPhotoTitle: 'Upload Photo',
    caption: 'Caption (optional)',
    noTournamentLink: 'No tournament link',
    uploading: 'Uploading...',
    noPhotos: 'No photos in gallery',
    loadingGallery: 'Loading gallery...',

    cookieConsentTitle: 'Privacy & Cookies',
    cookieConsentDesc: 'We use cookies and analytical tools (Google Analytics) to analyze traffic and improve user experience. You can accept all cookies or customize your preferences.',
    cookieAcceptAll: 'Accept All',
    cookieDeclineOptional: 'Essential Only',
    cookieSettings: 'Customize',
    cookieSettingsTitle: 'Privacy & Cookie Settings',
    cookieEssentialTitle: 'Essential Cookies',
    cookieEssentialDesc: 'Required for core application functionality, session authorization, and remembering language preferences.',
    cookieAnalyticsTitle: 'Analytics Cookies (Google Analytics)',
    cookieAnalyticsDesc: 'Help us understand how visitors interact with the website by providing anonymous usage statistics.',
    cookieSavePreferences: 'Save Preferences',
    cookiePreferences: 'Cookie Preferences',
};

const es: Translations = {
    appName: brand.appTitle,
    newTournament: 'Nuevo torneo',
    continueTournament: 'Continuar',
    deleteTournament: 'Eliminar torneo',
    noTournaments: 'No hay torneos guardados. ¡Crea tu primer torneo!',
    savedTournaments: 'Torneos guardados',
    backToHome: 'Inicio',
    language: 'Idioma',

    formatAmericano: 'AMERICANO',
    formatMixedAmericano: 'AMERICANO MIXTO',
    formatTeamAmericano: 'AMERICANO DUET',
    formatMexicano: 'MEXICANO',
    formatMixedMexicano: 'MEXICANO MIXTO',
    formatTeamMexicano: 'MEXICANO DUET',
    formatAmericanoDesc: 'Formato de juego dinámico en el que el sistema selecciona parejas y rivales al azar.',
    formatMixedAmericanoDesc: 'Las parejas siempre están formadas por hombre y mujer. Clasificación individual.',
    formatTeamAmericanoDesc: 'Equipos fijos de 2 personas. Puntuación por equipos.',
    formatMexicanoDesc: 'Formato de juego dinámico en el que el sistema selecciona parejas y rivales según el nivel y resultados recientes.',
    formatMixedMexicanoDesc: 'MEXICANO en parejas fijas. Cada pareja debe estar compuesta por una mujer y un hombre.',
    formatTeamMexicanoDesc: 'Simplemente MEXICANO en parejas fijas.',

    setupTitle: 'Configuración del torneo',
    stepFormat: 'Formato',
    stepPlayers: 'Jugadores',
    stepSettings: 'Ajustes',
    stepReview: 'Resumen',
    selectFormat: 'Seleccionar formato del torneo',
    addPlayers: 'Añadir jugadores',
    playerName: 'Nombre del jugador',
    addPlayer: 'Añadir jugador',
    removePlayer: 'Eliminar',
    tournamentName: 'Nombre del torneo',
    numberOfCourts: 'Número de pistas',
    scoringSystem: 'Sistema de puntuación',
    pointsPerMatch: 'Puntos por partido',
    startTournament: 'Empezar torneo',
    next: 'Siguiente',
    back: 'Atrás',
    review: 'Resumen',
    players: 'Jugadores',
    courts: 'Pistas',
    format: 'Formato',
    gender: 'Género',
    male: 'Masculino',
    female: 'Femenino',
    teamName: 'Nombre del equipo',
    addTeam: 'Añadir equipo',
    assignToTeam: 'Asignar al equipo',
    teamMode: 'Modo de equipo',
    rotatingTeams: 'Parejas rotativas',
    fixedTeams: 'Parejas fijas',

    matches: 'Partidos',
    leaderboard: 'Clasificación',
    stats: 'Estadísticas',
    round: 'Ronda',
    currentRound: 'Ronda actual',
    court: 'Pista',
    vs: 'vs',
    score: 'Resultado',
    enterScore: 'Añadir resultado',
    saveScore: 'Guardar resultado',
    nextRound: 'Siguiente ronda',
    finishTournament: 'Finalizar torneo',
    sittingOut: 'Descanso',
    allMatchesCompleted: 'Todos los partidos finalizados',
    enterAllScores: 'Introduce todos los resultados para continuar',
    roundOf: 'de',

    position: 'Pos.',
    player: 'Jugador',
    points: 'Puntos',
    played: 'Jugados',
    won: 'Ganados',
    lost: 'Perdidos',
    diff: '+/-',
    pauses: 'Descansos',

    results: 'Resultados',
    tournamentResults: 'Resultados del torneo',
    champion: 'Campeón',
    podium: 'Podio',
    finalStandings: 'Clasificación final',
    matchHistory: 'Historial de partidos',
    expand: 'Expandir',
    collapse: 'Ocultar',
    shareResults: 'Compartir resultados',
    linkCopied: '¡Enlace copiado!',
    shareDescription: 'Comparte un enlace con los resultados del torneo',
    pointsTotal: 'Puntos totales',
    matchesTotal: 'Partidos totales',

    sortResults: 'Ordenar resultados',
    sortByPoints: 'Por puntos',
    sortByWins: 'Por victorias',
    lastMatch: 'Último partido',
    lastMatchConfirm: '¿Estás seguro de que quieres jugar el último partido?',
    lastMatchWarning: 'El torneo finalizará tras introducir los resultados.',
    previousRounds: 'Rondas anteriores',
    repeatTournament: 'Repetir torneo',
    repeatTournamentDesc: 'Crea un torneo nuevo con los mismos ajustes',

    confirmDelete: '¿Estás seguro de que deseas eliminar este torneo?',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    error: 'Error',
    success: 'Éxito',
    warning: 'Aviso',
    minPlayersRequired: 'Número mínimo de jugadores requerido:',
    evenPlayersRequired: 'Número par de jugadores requerido',
    roundModeLabel: 'Modo de rondas',
    roundModeFixed: 'Rondas fijas',
    roundModeUnlimited: 'Ilimitado',
    byePoints: '+11 pts descanso',
    numberOfRounds: 'Número de rondas',
    totalRounds: 'Rondas totales',

    rankingPriority: 'Prioridad en clasificación',
    rankingPriorityDesc: 'Decide qué es más importante: puntos conseguidos o partidos ganados.',
    priorityWins: 'Victorias',

    finalPairingTitle: 'Emparejamiento final',
    pairing1: '1 & 2 vs 3 & 4',
    pairing2: '1 & 3 vs 2 & 4',
    pairing3: '1 & 4 vs 2 & 3',
    priorityLabel: 'Prioridad',
    searchTournaments: 'Buscar torneos...',
    filterAll: 'Todos',
    filterActive: 'Activos',
    filterFinished: 'Finalizados',
    previousPage: 'Anterior',
    nextPage: 'Siguiente',
    pageOf: 'de',

    login: 'Iniciar sesión',
    loginSubtitle: 'Inicia sesión para gestionar torneos',
    loginError: 'Correo o contraseña no válidos',
    loginLink: 'Iniciar sesión',
    register: 'Registrarse',
    registerSubtitle: 'Crea una cuenta para guardar tus torneos',
    registerError: 'Error al registrarse. Inténtalo de nuevo.',
    registerLink: 'Registrarse',
    email: 'Correo',
    password: 'Contraseña',
    logout: 'Cerrar sesión',
    noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?',

    myProfile: 'Mi perfil',
    profile: 'Perfil',
    memberSince: 'Miembro desde',
    tournamentsPlayed: 'Torneos jugados',
    tournamentsWon: 'Torneos ganados',
    winRate: 'Porcentaje de victoria',
    avgPointsPerMatch: 'Ø Pts/Partido',
    recentTournaments: 'Torneos recientes',
    bestPartners: 'Mejores parejas',
    sharedWins: 'victorias conjuntas',
    noStatsYet: 'Sin estadísticas',
    noStatsDesc: 'Juega algunos torneos para ver tus estadísticas.',
    placement: 'Posición',
    viewProfile: 'Ver perfil',

    addGuest: 'Añadir invitado',
    addMember: 'Añadir miembro',
    searchUsers: 'Buscar usuarios...',
    noUsersFound: 'No se encontraron usuarios',

    publicLeaderboard: 'Clasificación pública',
    leaderboardSubtitle: 'Estadísticas de jugadores en todos los torneos',
    periodDaily: 'Hoy',
    periodWeekly: 'Semana',
    periodMonthly: 'Mes',
    periodOverall: 'Global',
    typeAll: 'Todos los torneos',
    typeOfficial: 'Oficial',
    tournaments: 'Torneos',
    noLeaderboardData: 'No hay datos disponibles',
    gallery: 'Galería',

    uploadPhoto: 'Subir foto',
    uploadPhotoTitle: 'Subir foto',
    caption: 'Descripción (opcional)',
    noTournamentLink: 'Sin torneo enlazado',
    uploading: 'Subiendo...',
    noPhotos: 'No hay fotos en la galería',
    loadingGallery: 'Cargando galería...',

    cookieConsentTitle: 'Privacidad y Cookies',
    cookieConsentDesc: 'Utilizamos cookies y herramientas analíticas (Google Analytics) para analizar el tráfico y mejorar la experiencia. Puedes aceptar todas las cookies o personalizar tus preferencias.',
    cookieAcceptAll: 'Aceptar todas',
    cookieDeclineOptional: 'Solo esenciales',
    cookieSettings: 'Configurar',
    cookieSettingsTitle: 'Configuración de Privacidad y Cookies',
    cookieEssentialTitle: 'Cookies Esenciales',
    cookieEssentialDesc: 'Necesarias para el funcionamiento básico, la sesión del usuario y las preferencias de idioma.',
    cookieAnalyticsTitle: 'Cookies Analíticas (Google Analytics)',
    cookieAnalyticsDesc: 'Nos ayudan a comprender cómo interactúan los usuarios con la aplicación mediante estadísticas anónimas.',
    cookieSavePreferences: 'Guardar preferencias',
    cookiePreferences: 'Ajustes de cookies',
};

const ua: Translations = {
    appName: brand.appTitle,
    newTournament: 'Новий турнір',
    continueTournament: 'Продовжити',
    deleteTournament: 'Видалити турнір',
    noTournaments: 'Немає збережених турнірів. Створіть свій перший турнір!',
    savedTournaments: 'Збережені турніри',
    backToHome: 'Головна',
    language: 'Мова',

    formatAmericano: 'АМЕРИКАНО',
    formatMixedAmericano: 'Змішане Американо',
    formatTeamAmericano: 'Командне Американо',
    formatMexicano: 'МЕКСИКАНО',
    formatMixedMexicano: 'МЕКСИКАНО МІКСТ',
    formatTeamMexicano: 'МЕКСИКАНО ДУЕТ',
    formatAmericanoDesc: 'Динамічний формат гри, де система випадково вибирає партнерів та суперників.',
    formatMixedAmericanoDesc: 'Пари завжди складаються з чоловіка та жінки. Індивідуальний залік.',
    formatTeamAmericanoDesc: 'Постійні команди з 2 гравців. Командний залік.',
    formatMexicanoDesc: 'Динамічний формат гри, де система вибирає партнерів та суперників на основі їхнього рівня та останніх результатів.',
    formatMixedMexicanoDesc: 'МЕКСИКАНО у постійних парах. Кожна пара має складатися з однієї жінки та одного чоловіка.',
    formatTeamMexicanoDesc: 'Просто МЕКСИКАНО у постійних парах.',

    setupTitle: 'Налаштування турніру',
    stepFormat: 'Формат',
    stepPlayers: 'Гравці',
    stepSettings: 'Налаштування',
    stepReview: 'Огляд',
    selectFormat: 'Виберіть формат турніру',
    addPlayers: 'Додати гравців',
    playerName: 'Ім\'я гравця',
    addPlayer: 'Додати гравця',
    removePlayer: 'Видалити',
    tournamentName: 'Назва турніру',
    numberOfCourts: 'Кількість кортів',
    scoringSystem: 'Система очок',
    pointsPerMatch: 'очок за матч',
    startTournament: 'Почати турнір',
    next: 'Далі',
    back: 'Назад',
    review: 'Огляд',
    players: 'Гравці',
    courts: 'Корти',
    format: 'Формат',
    gender: 'Стать',
    male: 'Чоловік',
    female: 'Жінка',
    teamName: 'Назва команди',
    addTeam: 'Додати команду',
    assignToTeam: 'Призначити в команду',
    teamMode: 'Командний режим',
    rotatingTeams: 'Змінні пари',
    fixedTeams: 'Постійні пари',

    matches: 'Матчі',
    leaderboard: 'Таблиця',
    stats: 'Статистика',
    round: 'Раунд',
    currentRound: 'Поточний раунд',
    court: 'Корт',
    vs: 'проти',
    score: 'Рахунок',
    enterScore: 'Введіть рахунок',
    saveScore: 'Зберегти рахунок',
    nextRound: 'Наступний раунд',
    finishTournament: 'Завершити турнір',
    sittingOut: 'Відпочивають',
    allMatchesCompleted: 'Всі матчі завершено',
    enterAllScores: 'Введіть рахунки всіх матчів, щоб продовжити',
    roundOf: 'з',

    position: 'Поз.',
    player: 'Гравець',
    points: 'Очки',
    played: 'Зіграно',
    won: 'Виграно',
    lost: 'Програно',
    diff: '+/-',
    pauses: 'Паузи',

    results: 'Результати',
    tournamentResults: 'Результати турніру',
    champion: 'Чемпіон',
    podium: 'Подіум',
    finalStandings: 'Підсумкова таблиця',
    matchHistory: 'Історія матчів',
    expand: 'Розгорнути',
    collapse: 'Згорнути',
    shareResults: 'Поділитися результатами',
    linkCopied: 'Посилання скопійовано!',
    shareDescription: 'Поділіться посиланням з результатами турніру',
    pointsTotal: 'Всього очок',
    matchesTotal: 'Всього матчів',

    sortResults: 'Сортування',
    sortByPoints: 'За очками',
    sortByWins: 'За перемогами',
    lastMatch: 'Останній матч',
    lastMatchConfirm: 'Ви впевнені, що хочете зіграти останній матч?',
    lastMatchWarning: 'Турнір завершиться після введення результатів.',
    previousRounds: 'Попередні раунди',
    repeatTournament: 'Повторити турнір',
    repeatTournamentDesc: 'Створити новий турнір з тими ж налаштуваннями',

    confirmDelete: 'Ви впевнені, що хочете видалити цей турнір?',
    cancel: 'Скасувати',
    confirm: 'Підтвердити',
    close: 'Закрити',
    error: 'Помилка',
    success: 'Успіх',
    warning: 'Увага',
    minPlayersRequired: 'Мінімальна кількість гравців:',
    evenPlayersRequired: 'Потрібна парна кількість гравців',
    roundModeLabel: 'Режим раундів',
    roundModeFixed: 'Фіксована кількість',
    roundModeUnlimited: 'Безліміт',
    byePoints: '+11 очок за пропуск',
    numberOfRounds: 'Кількість раундів',
    totalRounds: 'Кількість раундів',

    rankingPriority: 'Пріоритет рейтингу',
    rankingPriorityDesc: 'Що важливіше: набрані бали чи виграні матчі.',
    priorityWins: 'Перемоги',

    finalPairingTitle: 'Фінальні Пари',
    pairing1: '1 & 2 vs 3 & 4',
    pairing2: '1 & 3 vs 2 & 4',
    pairing3: '1 & 4 vs 2 & 3',
    priorityLabel: 'Пріоритет',

    searchTournaments: 'Пошук турніру...',
    filterAll: 'Всі',
    filterActive: 'Активні',
    filterFinished: 'Завершені',
    previousPage: 'Попередня',
    nextPage: 'Наступна',
    pageOf: 'з',

    // Auth
    login: 'Вхід',
    loginSubtitle: 'Увійдіть, щоб керувати турнірами',
    loginError: 'Невірний email або пароль',
    loginLink: 'Увійти',
    register: 'Реєстрація',
    registerSubtitle: 'Створіть акаунт, щоб зберігати турніри',
    registerError: 'Помилка реєстрації. Спробуйте ще раз.',
    registerLink: 'Зареєструватися',
    email: 'Email',
    password: 'Пароль',
    logout: 'Вийти',
    noAccount: 'Немає акаунту?',
    hasAccount: 'Вже є акаунт?',

    myProfile: 'Мій профіль',
    profile: 'Профіль',
    memberSince: 'Учасник з',
    tournamentsPlayed: 'Турніри',
    tournamentsWon: 'Виграні турніри',
    winRate: '% перемог',
    avgPointsPerMatch: 'Сер. очків/матч',
    recentTournaments: 'Остання турніри',
    bestPartners: 'Найкращі партнери',
    sharedWins: 'спільні перемоги',
    noStatsYet: 'Ще немає статистики',
    noStatsDesc: 'Зіграйте в турніри, щоб побачити свою статистику.',
    placement: 'місце',
    viewProfile: 'Профіль',

    addGuest: 'Додати гостя',
    addMember: 'Додати учасника',
    searchUsers: 'Пошук користувача...',
    noUsersFound: 'Користувачів не знайдено',

    publicLeaderboard: 'Рейтинг гравців',
    leaderboardSubtitle: 'Статистика гравців з усіх турнірів',
    periodDaily: 'Сьогодні',
    periodWeekly: 'Тиждень',
    periodMonthly: 'Місяць',
    periodOverall: 'Загалом',
    typeAll: 'Усі турніри',
    typeOfficial: 'Офіційні',
    tournaments: 'Турніри',
    noLeaderboardData: 'Немає даних для відображення',
    gallery: 'Галерея',

    uploadPhoto: 'Додати фото',
    uploadPhotoTitle: 'Завантажити фото',
    caption: 'Підпис (необов\'язково)',
    noTournamentLink: 'Без прив\'язки до турніру',
    uploading: 'Завантаження...',
    noPhotos: 'Немає фотографій у галереї',
    loadingGallery: 'Завантаження галереї...',

    cookieConsentTitle: 'Конфіденційність та Cookie',
    cookieConsentDesc: 'Ми використовуємо файли cookie та аналітику (Google Analytics) для аналізу трафіку та покращення роботи сайту. Ви можете прийняти всі файли cookie або налаштувати свої переваги.',
    cookieAcceptAll: 'Прийняти всі',
    cookieDeclineOptional: 'Тільки необхідні',
    cookieSettings: 'Налаштувати',
    cookieSettingsTitle: 'Налаштування конфіденційності та Cookie',
    cookieEssentialTitle: 'Необхідні файли cookie',
    cookieEssentialDesc: 'Необхідні для базової роботи програми, збереження сесії та мовних налаштувань.',
    cookieAnalyticsTitle: 'Аналітичні cookie (Google Analytics)',
    cookieAnalyticsDesc: 'Допомагають нам зрозуміти, як користувачі взаємодіють із додатком за допомогою анонімної статистики.',
    cookieSavePreferences: 'Зберегти налаштування',
    cookiePreferences: 'Налаштування cookie',
};

export const translations: Record<Locale, Translations> = { pl, en, es, ua };

export function getTranslations(locale: Locale): Translations {
    return translations[locale];
}
