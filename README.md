# Padel Mixer

A client-side web application for organizing and managing padel tournaments. Supports multiple tournament formats, live score tracking, leaderboards, fixed round limits, custom ranking strategies, and shareable results -- all without a backend server.

---

## Table of Contents

- [Features](#features)
- [Tournament Formats](#tournament-formats)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)

---

## Features

- **Multiple tournament formats** -- Americano, Mixed Americano, Team Americano, Mexicano, and Team Mexicano.
- **Configurable scoring** -- choose between 16, 21, 24, or 32 point scoring systems.
- **Flexible Round Limits** -- Set a fixed number of rounds or play unlimited rounds.
- **Custom Ranking Strategy** -- Choose to rank players primarily by **Points** or by **Wins**.
- **Multi-court support** -- run matches on multiple courts in parallel.
- **Live score entry** -- enter scores in real time during matches using a specialized court-card interface.
- **Automatic scheduling** -- matches and pairings are generated automatically based on the selected format.
- **Dynamic standings** -- leaderboard updates instantly after each completed match.
- **Shareable results** -- generate a URL to share final tournament results with anyone; no account or login required.
- **Offline-first** -- all data is stored in the browser via localStorage. No server, no database.
- **Quadrilingual** -- supports Polish (default), English, German, and Ukrainian, switchable at any time.

---

## Tournament Formats

| Format           | Description                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------- |
| Americano        | Classic round-robin. Every player partners with and plays against every other player.         |
| Mixed Americano  | Same as Americano but each team always has one male and one female player.                    |
| Team Americano   | Fixed teams play round-robin against all other teams.                                         |
| Mexicano         | Dynamic pairing based on current standings. First round is random, then ranked.               |
| Team Mexicano    | Fixed teams with dynamic matchups based on team standings.                                    |

---

## Tech Stack

| Layer             | Technology                  |
| ----------------- | --------------------------- |
| Framework         | Next.js 16                  |
| Language          | TypeScript 5                |
| UI Library        | React 19                    |
| Styling           | Tailwind CSS 4              |
| State Management  | React Context + useReducer  |
| Persistence       | Browser localStorage        |
| Linting           | ESLint 9                    |

---

## Prerequisites

- **Node.js** -- version 18 or later.
- **npm** -- comes bundled with Node.js.

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Padel-Mixer
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open the app** in your browser at `http://localhost:3000`.

---

## Available Scripts

| Command          | Description                                    |
| ---------------- | ---------------------------------------------- |
| `npm run dev`    | Start the development server with hot reload.  |
| `npm run build`  | Create an optimized production build.          |
| `npm run start`  | Serve the production build locally.            |
| `npm run lint`   | Run ESLint to check for code issues.           |

---

## How to Use

### Creating a Tournament

1. Open the app and click **New Tournament** on the home page.
2. **Choose a format** -- select one of the five tournament formats.
3. **Add players** -- enter player names one by one. For Mixed Americano, assign a gender (male/female) to each player. For Team formats, create teams and assign players to them.
4. **Configure settings**:
    - **Tournament Name**: Give your event a name.
    - **Courts**: Select the number of courts available.
    - **Scoring System**: Choose 16, 21, 24, or 32 points per match.
    - **Round Mode**: Choose between **Unlimited** (play until you stop) or **Fixed** (set a specific number of rounds).
    - **Ranking Priority**: Choose whether to rank players by **Total Points** or **Matches Won** first.
5. **Review and start** -- verify the setup on the summary screen and start the tournament.

### Running Matches

- The app displays the current round with all matches and court assignments.
- Players who are sitting out the current round (if there are more players than court slots) are shown separately.
- Enter the score for each match. The total of both scores must equal the chosen scoring system value (e.g., if the system is 24, valid scores are 14-10, 12-12, etc.).
- Once all matches in a round are scored, proceed to the next round.

### Viewing Standings

- The leaderboard is visible during the tournament and updates automatically.
- Sorting logic depends on the chosen **Ranking Priority**:
    - **By Points**: Total Points -> Point Difference -> Matches Won.
    - **By Wins**: Matches Won -> Total Points -> Point Difference.
- For team formats, team standings are shown alongside individual stats.

### Finishing a Tournament

- After the final round, finish the tournament to lock in results and see the final leaderboard.

### Sharing Results

- After a tournament is finished, use the **Share** button to generate a URL.
- Anyone who opens the link will see the full results -- standings, round-by-round scores, and match details -- without needing the app installed or any account.

### Switching Language

- Use the language toggle in the header to switch between Polish (PL), English (EN), German (DE), and Ukrainian (UA) at any time. The preference is saved in the browser.

### Managing Tournaments

- Saved tournaments are listed on the home page, sorted by last update.
- Active tournaments can be continued from where you left off.
- Tournaments can be deleted from the home page list.

---

## Project Structure

```
src/
  app/
    page.tsx                  -- Home page (tournament list)
    layout.tsx                -- Root layout with metadata and providers
    globals.css               -- Global styles and design tokens
    results/
      page.tsx                -- Shared results viewer (accessed via URL)
    tournament/
      new/
        page.tsx              -- Tournament creation wizard (4 steps)
      [id]/
        page.tsx              -- Active tournament view (matches, scores, standings)
        results/
          page.tsx            -- Tournament results page
  components/
    Header.tsx                -- App header with logo and language toggle
  context/
    AppContext.tsx             -- Global state (React Context + useReducer)
  lib/
    types.ts                  -- TypeScript type definitions
    scheduler.ts              -- Match scheduling and pairing algorithms
    scoring.ts                -- Scoring engine and standings calculation
    share.ts                  -- URL-based result sharing (encode/decode)
    storage.ts                -- localStorage persistence layer
    i18n.ts                   -- Translations (PL, EN, DE, UA)
```

---
---

# Padel Mixer (PL)

Aplikacja webowa do organizacji i prowadzenia turniejów padel. Obsługuje wiele formatów turniejowych, śledzenie wyników na żywo, konfigurowalne limity rund, strategie rankingu i udostępnianie rezultatów -- wszystko bez serwera backendowego.

---

## Spis treści

- [Funkcje](#funkcje)
- [Formaty turniejowe](#formaty-turniejowe)
- [Stos technologiczny](#stos-technologiczny)
- [Wymagania wstępne](#wymagania-wstepne)
- [Uruchomienie projektu](#uruchomienie-projektu)
- [Dostępne skrypty](#dostepne-skrypty)
- [Jak używać](#jak-uzywac)
- [Struktura projektu](#struktura-projektu-1)

---

## Funkcje

- **Wiele formatów turniejowych** -- Americano, Mixed Americano, Team Americano, Mexicano i Team Mexicano.
- **Konfigurowalny system punktacji** -- do wyboru: 16, 21, 24 lub 32 punkty na mecz.
- **Elastyczny limit rund** -- Wybór między stałą liczbą rund a grą nielimitowaną.
- **Własna strategia rankingu** -- Możliwość sortowania tabeli priorytetowo wg **Punktów** lub **Zwycięstw**.
- **Obsługa wielu kortów** -- mecze rozgrywane równolegle na kilku kortach.
- **Wprowadzanie wyników na żywo** -- wpisywanie wyników w trakcie trwania meczy za pomocą intuicyjnego interfejsu kortu.
- **Automatyczne planowanie meczy** -- pary i mecze generowane automatycznie na podstawie wybranego formatu.
- **Dynamiczna tabela wyników** -- klasyfikacja aktualizuje się natychmiast po każdym zakończeniu meczu.
- **Udostępnianie wyników** -- generowanie linku URL do udostępnienia wyników turnieju dowolnej osobie; bez konta i logowania.
- **Tryb offline** -- wszystkie dane przechowywane w przeglądarce (localStorage). Bez serwera, bez bazy danych.
- **Czterojęzyczność** -- obsługa języka polskiego (domyślny), angielskiego, niemieckiego i ukraińskiego, przełączanie w dowolnym momencie.

---

## Formaty turniejowe

| Format           | Opis                                                                                                 |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Americano        | Klasyczny round-robin. Każdy gracz gra w parze z każdym innym i przeciwko każdemu innemu.           |
| Mixed Americano  | Jak Americano, ale każda para składa się z jednego mężczyzny i jednej kobiety.                      |
| Team Americano   | Stałe drużyny grają każda z każdą w systemie round-robin.                                            |
| Mexicano         | Dynamiczne parowanie na podstawie aktualnej klasyfikacji. Pierwsza runda losowa, kolejne rankingowe. |
| Team Mexicano    | Stałe drużyny z dynamicznym doborem przeciwników na podstawie klasyfikacji drużynowej.               |

---

## Stos technologiczny

| Warstwa               | Technologia                 |
| --------------------- | --------------------------- |
| Framework             | Next.js 16                  |
| Język programowania   | TypeScript 5                |
| Biblioteka UI         | React 19                    |
| Stylowanie            | Tailwind CSS 4              |
| Zarządzanie stanem    | React Context + useReducer  |
| Przechowywanie danych | localStorage przeglądarki   |
| Linting               | ESLint 9                    |

---

## Wymagania wstępne

- **Node.js** -- wersja 18 lub nowsza.
- **npm** -- instalowany razem z Node.js.

---

## Uruchomienie projektu

1. **Sklonuj repozytorium**

   ```bash
   git clone <adres-repozytorium>
   cd Padel-Mixer
   ```

2. **Zainstaluj zależności**

   ```bash
   npm install
   ```

3. **Uruchom serwer deweloperski**

   ```bash
   npm run dev
   ```

4. **Otwórz aplikację** w przeglądarce pod adresem `http://localhost:3000`.

---

## Dostępne skrypty

| Polecenie        | Opis                                                    |
| ---------------- | ------------------------------------------------------- |
| `npm run dev`    | Uruchamia serwer deweloperski z automatycznym odświeżaniem. |
| `npm run build`  | Tworzy zoptymalizowaną wersję produkcyjną.              |
| `npm run start`  | Serwuje wersję produkcyjną lokalnie.                    |
| `npm run lint`   | Uruchamia ESLint w celu sprawdzenia kodu.               |

---

## Jak używać

### Tworzenie turnieju

1. Otwórz aplikację i kliknij **Nowy turniej** na stronie głównej.
2. **Wybierz format** -- wybierz jeden z pięciu formatów turniejowych.
3. **Dodaj graczy** -- wpisuj imiona graczy po kolei. W przypadku Mixed Americano przypisz płeć (mężczyzna/kobieta) każdemu graczowi. W formatach drużynowych utwórz drużyny i przypisz do nich graczy.
4. **Skonfiguruj ustawienia**:
    - **Nazwa turnieju**: Podaj nazwę wydarzenia.
    - **Liczba kortów**: Wybierz liczbę dostępnych kortów.
    - **System punktacji**: 16, 21, 24 lub 32 punkty na mecz.
    - **Tryb rund**: Wybierz **Nielimitowane** (gra do oporu) lub **Określona liczba** (ustal sztywny limit rund).
    - **Priorytet Rankingu**: Wybierz, czy w tabeli ważniejsze są **Punkty** czy liczba **Zwycięstw**.
5. **Przejrzyj i rozpocznij** -- sprawdź podsumowanie konfiguracji i rozpocznij turniej.

### Prowadzenie meczy

- Aplikacja wyświetla bieżącą rundę ze wszystkimi meczami i przypisanymi kortami.
- Gracze pauzujący w danej rundzie (jeżeli jest więcej graczy niż miejsc na kortach) są wyświetlani osobno.
- Wprowadź wynik każdego meczu. Suma obu wyników musi być równa wartości systemu punktacji (np. przy systemie 24 poprawne wyniki to 14-10, 12-12 itp.).
- Po zakończeniu wszystkich meczy w rundzie przejdź do następnej rundy.

### Przeglądanie klasyfikacji

- Tabela wyników jest widoczna w trakcie turnieju i aktualizuje się automatycznie.
- Logika sortowania zależy od wybranego **Priorytetu Rankingu**:
    - **Wg Punktów**: Suma Punktów -> Różnica Punktów -> Wygrane Mecze.
    - **Wg Wygranych**: Wygrane Mecze -> Suma Punktów -> Różnica Punktów.
- W formatach drużynowych klasyfikacja drużynowa wyświetlana jest obok statystyk indywidualnych.

### Zakończenie turnieju

- Po ostatniej rundzie zakończ turniej, aby zablokować wyniki i wyświetlić końcową klasyfikację.

### Udostępnianie wyników

- Po zakończeniu turnieju użyj przycisku **Udostępnij**, aby wygenerować link URL.
- Każdy, kto otworzy link, zobaczy pełne wyniki -- klasyfikację, wyniki runda po rundzie i szczegóły meczy -- bez potrzeby instalacji aplikacji czy posiadania konta.

### Zmiana języka

- Użyj przełącznika języka w nagłówku, aby przełączać między polskim (PL), angielskim (EN), niemieckim (DE) i ukraińskim (UA) w dowolnym momencie. Preferencja jest zapisywana w przeglądarce.

### Zarządzanie turniejami

- Zapisane turnieje są wyświetlane na stronie głównej, posortowane według ostatniej aktualizacji.
- Aktywne turnieje można kontynuować od miejsca, w którym zostały przerwane.
- Turnieje można usuwać z listy na stronie głównej.

---

## Struktura projektu

```
src/
  app/
    page.tsx                  -- Strona główna (lista turniejów)
    layout.tsx                -- Główny układ z metadanymi i providerami
    globals.css               -- Globalne style i tokeny designu
    results/
      page.tsx                -- Podgląd udostępnionych wyników (dostęp przez URL)
    tournament/
      new/
        page.tsx              -- Kreator tworzenia turnieju (4 kroki)
      [id]/
        page.tsx              -- Widok aktywnego turnieju (mecze, wyniki, klasyfikacja)
        results/
          page.tsx            -- Strona wyników turnieju
  components/
    Header.tsx                -- Nagłówek aplikacji z logo i przełącznikiem języka
  context/
    AppContext.tsx             -- Globalny stan (React Context + useReducer)
  lib/
    types.ts                  -- Definicje typów TypeScript
    scheduler.ts              -- Algorytmy planowania meczy i parowania graczy
    scoring.ts                -- Silnik punktacji i obliczanie klasyfikacji
    share.ts                  -- Udostępnianie wyników przez URL (kodowanie/dekodowanie)
    storage.ts                -- Warstwa persystencji localStorage
    i18n.ts                   -- Tłumaczenia (PL, EN, DE, UA)
```
