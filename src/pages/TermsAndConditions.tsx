import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { i18n } = useTranslation();

  if (i18n.language === "pl") {
    return (
      <article className="terms-and-conditions">
        <h1>Polityka Prywatności</h1>
        <div>
          Poniższa Polityka Prywatności określa{" "}
          <strong>
            zasady zapisywania i uzyskiwania dostępu do danych na Urządzeniach
            Użytkowników
          </strong>{" "}
          korzystających z Serwisu do celów świadczenia usług drogą
          elektroniczną przez Administratora oraz{" "}
          <strong>
            zasady gromadzenia i przetwarzania danych osobowych Użytkowników
          </strong>
          , które zostały podane przez nich osobiście i dobrowolnie za
          pośrednictwem narzędzi dostępnych w Serwisie.
        </div>
        <div>
          Poniższa Polityka Prywatności jest integralną częścią Regulaminu
          Serwisu, który określa zasady, prawa i obowiązki Użytkowników
          korzystających z Serwisu.
        </div>
        <h2>§1 Definicje</h2>
        <ul>
          <li>
            <div>
              <strong>Serwis</strong> - serwis internetowy "PetBuddy"
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Serwis zewnętrzny</strong> - serwisy internetowe
              partnerów, usługodawców lub usługobiorców współpracujących z
              Administratorem
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Administrator Serwisu / Danych</strong> - Administratorem
              Serwisu oraz Administratorem Danych (dalej Administrator) jest
              firma "PetBuddy", prowadząca działalność pod adresem: Wrocław,
              świadcząca usługi drogą elektroniczną za pośrednictwem Serwisu
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Użytkownik</strong> - osoba fizyczna, dla której
              Administrator świadczy usługi drogą elektroniczną za pośrednictwem
              Serwisu.
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Urządzenie</strong> - elektroniczne urządzenie wraz z
              oprogramowaniem, za pośrednictwem którego Użytkownik uzyskuje
              dostęp do Serwisu
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Cookies (ciasteczka)</strong> - dane tekstowe gromadzone w
              formie plików zamieszczanych na Urządzeniu Użytkownika
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>RODO</strong> - Rozporządzenie Parlamentu Europejskiego i
              Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony
              osób fizycznych w związku z przetwarzaniem danych osobowych i w
              sprawie swobodnego przepływu takich danych oraz uchylenia
              dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych){" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Dane osobowe</strong> - oznaczają informacje o
              zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej
              („osobie, której dane dotyczą”); możliwa do zidentyfikowania osoba
              fizyczna to osoba, którą można bezpośrednio lub pośrednio
              zidentyfikować, w szczególności na podstawie identyfikatora
              takiego jak imię i nazwisko, numer identyfikacyjny, dane o
              lokalizacji, identyfikator internetowy lub jeden bądź kilka
              szczególnych czynników określających fizyczną, fizjologiczną,
              genetyczną, psychiczną, ekonomiczną, kulturową lub społeczną
              tożsamość osoby fizycznej{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Przetwarzanie</strong> - oznacza operację lub zestaw
              operacji wykonywanych na danych osobowych lub zestawach danych
              osobowych w sposób zautomatyzowany lub niezautomatyzowany, taką
              jak zbieranie, utrwalanie, organizowanie, porządkowanie,
              przechowywanie, adaptowanie lub modyfikowanie, pobieranie,
              przeglądanie, wykorzystywanie, ujawnianie poprzez przesłanie,
              rozpowszechnianie lub innego rodzaju udostępnianie, dopasowywanie
              lub łączenie, ograniczanie, usuwanie lub niszczenie;{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Ograniczenie przetwarzania</strong> - oznacza oznaczenie
              przechowywanych danych osobowych w celu ograniczenia ich
              przyszłego przetwarzania{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Profilowanie</strong> - oznacza dowolną formę
              zautomatyzowanego przetwarzania danych osobowych, które polega na
              wykorzystaniu danych osobowych do oceny niektórych czynników
              osobowych osoby fizycznej, w szczególności do analizy lub prognozy
              aspektów dotyczących efektów pracy tej osoby fizycznej, jej
              sytuacji ekonomicznej, zdrowia, osobistych preferencji,
              zainteresowań, wiarygodności, zachowania, lokalizacji lub
              przemieszczania się{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Zgoda</strong> - zgoda osoby, której dane dotyczą oznacza
              dobrowolne, konkretne, świadome i jednoznaczne okazanie woli,
              którym osoba, której dane dotyczą, w formie oświadczenia lub
              wyraźnego działania potwierdzającego, przyzwala na przetwarzanie
              dotyczących jej danych osobowych{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Naruszenie ochrony danych osobowych</strong> - oznacza
              naruszenie bezpieczeństwa prowadzące do przypadkowego lub
              niezgodnego z prawem zniszczenia, utracenia, zmodyfikowania,
              nieuprawnionego ujawnienia lub nieuprawnionego dostępu do danych
              osobowych przesyłanych, przechowywanych lub w inny sposób
              przetwarzanych{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Pseudonimizacja</strong> - oznacza przetworzenie danych
              osobowych w taki sposób, by nie można ich było już przypisać
              konkretnej osobie, której dane dotyczą, bez użycia dodatkowych
              informacji, pod warunkiem że takie dodatkowe informacje są
              przechowywane osobno i są objęte środkami technicznymi i
              organizacyjnymi uniemożliwiającymi ich przypisanie
              zidentyfikowanej lub możliwej do zidentyfikowania osobie fizycznej{" "}
            </div>
          </li>
          <li>
            <div>
              <strong>Anonimizacja</strong> - Anonimizacja danych to
              nieodwracalny proces operacji na danych, który niszczy / nadpisuje
              "dane osobowe" uniemożliwiając identyfikację, lub powiązanie
              danego rekordu z konkretnym użytkownikiem lub osobą fizyczną.
            </div>
          </li>
        </ul>
        <h2>§2 Inspektor Ochrony Danych</h2>
        <div>
          Na podstawie Art. 37 RODO, Administrator nie powołał Inspektora
          Ochrony Danych.
        </div>
        <div>
          W sprawach dotyczących przetwarzania danych, w tym danych osobowych,
          należy kontaktować się bezpośrednio z Administratorem.
        </div>
        <h2>§3 Rodzaje Plików Cookies</h2>
        <ul>
          <li>
            <div>
              <strong>Cookies wewnętrzne</strong> - pliki zamieszczane i
              odczytywane z Urządzenia Użytkownika przez system
              teleinformatyczny Serwisu
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Cookies zewnętrzne</strong> - pliki zamieszczane i
              odczytywane z Urządzenia Użytkownika przez systemy
              teleinformatyczne Serwisów zewnętrznych. Skrypty Serwisów
              zewnętrznych, które mogą umieszczać pliki Cookies na Urządzeniach
              Użytkownika zostały świadomie umieszczone w Serwisie poprzez
              skrypty i usługi udostępnione i zainstalowane w Serwisie{" "}
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Cookies trwałe</strong> - pliki zamieszczane i odczytywane
              z Urządzenia Użytkownika przez Serwis do momentu ich ręcznego
              usunięcia. Pliki nie są usuwane automatycznie po zakończeniu sesji
              Urządzenia chyba że konfiguracja Urządzenia Użytkownika jest
              ustawiona na tryb usuwanie plików Cookie po zakończeniu sesji
              Urządzenia.
            </div>
          </li>
        </ul>
        <h2>§4 Bezpieczeństwo składowania danych</h2>
        <ul>
          <li>
            <div>
              <strong>Mechanizmy składowania i odczytu plików Cookie</strong> -
              Mechanizmy składowania, odczytu i wymiany danych pomiędzy Plikami
              Cookies zapisywanymi na Urządzeniu Użytkownika a Serwisem są
              realizowane poprzez wbudowane mechanizmy przeglądarek
              internetowych i nie pozwalają na pobieranie innych danych z
              Urządzenia Użytkownika lub danych innych witryn internetowych,
              które odwiedzał Użytkownik, w tym danych osobowych ani informacji
              poufnych. Przeniesienie na Urządzenie Użytkownika wirusów, koni
              trojańskich oraz innych robaków jest także praktycznie niemożliwe.
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Cookie wewnętrzne</strong> - zastosowane przez
              Administratora pliki Cookie są bezpieczne dla Urządzeń
              Użytkowników i nie zawierają skryptów, treści lub informacji
              mogących zagrażać bezpieczeństwu danych osobowych lub
              bezpieczeństwu Urządzenia z którego korzysta Użytkownik.
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Cookie zewnętrzne</strong> - Administrator dokonuje
              wszelkich możliwych działań w celu weryfikacji i doboru partnerów
              serwisu w kontekście bezpieczeństwa Użytkowników. Administrator do
              współpracy dobiera znanych, dużych partnerów o globalnym zaufaniu
              społecznym. Nie posiada on jednak pełnej kontroli nad zawartością
              plików Cookie pochodzących od zewnętrznych partnerów. Za
              bezpieczeństwo plików Cookie, ich zawartość oraz zgodne z licencją
              wykorzystanie przez zainstalowane w serwisie Skrypty, pochodzących
              z Serwisów zewnętrznych, Administrator nie ponosi
              odpowiedzialności na tyle na ile pozwala na to prawo. Lista
              partnerów zamieszczona jest w dalszej części Polityki Prywatności.
            </div>
          </li>
          <li>
            <div>
              <strong>Kontrola plików Cookie</strong>
              <ul>
                <li>
                  <div>
                    Użytkownik może w dowolnym momencie, samodzielnie zmienić
                    ustawienia dotyczące zapisywania, usuwania oraz dostępu do
                    danych zapisanych plików Cookies przez każdą witrynę
                    internetową
                  </div>
                </li>
                <li>
                  <div>
                    Informacje o sposobie wyłączenia plików Cookie w
                    najpopularniejszych przeglądarkach komputerowych dostępne są
                    na stronie:{" "}
                    <a
                      rel="external"
                      href="https://nety.pl/jak-wylaczyc-pliki-cookie/"
                    >
                      jak wyłączyć cookie
                    </a>{" "}
                    lub u jednego ze wskazanych dostawców:
                    <ul>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&#038;hl=pl"
                        >
                          Zarządzanie plikami cookies w przeglądarce{" "}
                          <strong>Chrome</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://help.opera.com/pl/latest/web-preferences/"
                        >
                          Zarządzanie plikami cookies w przeglądarce{" "}
                          <strong>Opera</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.mozilla.org/pl/kb/blokowanie-ciasteczek"
                        >
                          Zarządzanie plikami cookies w przeglądarce{" "}
                          <strong>FireFox</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.microsoft.com/pl-pl/help/4027947/microsoft-edge-delete-cookies"
                        >
                          Zarządzanie plikami cookies w przeglądarce{" "}
                          <strong>Edge</strong>
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.apple.com/pl-pl/guide/safari/sfri11471/mac"
                        >
                          Zarządzanie plikami cookies w przeglądarce{" "}
                          <strong>Safari</strong>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <div>
                    Użytkownik może w dowolnym momencie usunąć wszelkie zapisane
                    do tej pory pliki Cookie korzystając z narzędzi Urządzenia
                    Użytkownika, za pośrednictwem którego Użytkownik korzysta z
                    usług Serwisu.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div>
              <strong>Zagrożenia po stronie Użytkownika </strong> -
              Administrator stosuje wszelkie możliwe środki techniczne w celu
              zapewnienia bezpieczeństwa danych umieszczanych w plikach Cookie.
              Należy jednak zwrócić uwagę, że zapewnienie bezpieczeństwa tych
              danych zależy od obu stron w tym działalności Użytkownika.
              Administrator nie bierze odpowiedzialności za przechwycenie tych
              danych, podszycie się pod sesję Użytkownika lub ich usunięcie, na
              skutek świadomej lub nieświadomej działalność Użytkownika,
              wirusów, koni trojańskich i innego oprogramowania szpiegującego,
              którymi może jest lub było zainfekowane Urządzenie Użytkownika.
              Użytkownicy w celu zabezpieczenia się przed tymi zagrożeniami
              powinni stosować się do{" "}
              <a rel="external" href="https://nety.pl/cyberbezpieczenstwo/">
                zasad bezpiecznego korzystania z sieci internet
              </a>
              .
            </div>
          </li>
          <li>
            <div>
              <strong>Przechowywanie danych osobowych</strong> - Administrator
              zapewnia, że dokonuje wszelkich starań, by przetwarzane dane
              osobowe wprowadzone dobrowolnie przez Użytkowników były
              bezpieczne, dostęp do nich był ograniczony i realizowany zgodnie z
              ich przeznaczeniem i celami przetwarzania. Administrator zapewnia
              także, że dokonuje wszelkich starań w celu zabezpieczenia
              posiadanych danych przed ich utratą, poprzez stosowanie
              odpowiednich zabezpieczeń fizycznych jak i organizacyjnych.
            </div>
          </li>
          <li>
            <div>
              <strong>Przechowywanie haseł</strong> - Administrator oświadcza,
              że hasła przechowywane są w zaszyfrowanej postaci, używając
              najnowszych standardów i wytycznych w tym zakresie. Deszyfracja
              podawanych w Serwisie haseł dostępu do konta jest praktycznie
              niemożliwa.
            </div>
          </li>
        </ul>
        <h2>§5 Cele do których wykorzystywane są pliki Cookie</h2>
        <ul id="cele">
          <li>Usprawnienie i ułatwienie dostępu do Serwisu</li>
          <li>Personalizacja Serwisu dla Użytkowników</li>
          <li>Umożliwienie Logowania do serwisu</li>
          <li>
            Prowadzenie statystyk (użytkowników, ilości odwiedzin, rodzajów
            urządzeń, łącze itp.)
          </li>
          <li>Świadczenie usług społecznościowych</li>
        </ul>
        <h2>§6 Cele przetwarzania danych osobowych</h2>
        <div>
          Dane osobowe dobrowolnie podane przez Użytkowników są przetwarzane w
          jednym z następujących celów:
        </div>
        <ul>
          <li>
            Realizacji usług elektronicznych:
            <ul>
              <li>
                Usługi rejestracji i utrzymania konta Użytkownika w Serwisie i
                funkcjonalności z nim związanych
              </li>
              <li>
                Usługi komentowania / polubienia wpisów w Serwisie bez
                konieczności rejestrowania się
              </li>
            </ul>
          </li>
          <li>
            Komunikacji Administratora z Użytkownikami w sprawach związanych z
            Serwisem oraz ochrony danych
          </li>
          <li>Zapewnienia prawnie uzasadnionego interesu Administratora</li>
        </ul>
        <div>
          Dane o Użytkownikach gromadzone anonimowo i automatycznie są
          przetwarzane w jednym z następujących celów:
        </div>
        <ul>
          <li>Prowadzenie statystyk</li>
          <li>Zapewnienia prawnie uzasadnionego interesu Administratora</li>
        </ul>
        <h2>§7 Pliki Cookies Serwisów zewnętrznych</h2>
        <div>
          Administrator w Serwisie wykorzystuje skrypty javascript i komponenty
          webowe partnerów, którzy mogą umieszczać własne pliki cookies na
          Urządzeniu Użytkownika. Pamiętaj, że w ustawieniach swojej
          przeglądarki możesz sam decydować o dozwolonych plikach cookies jakie
          mogą być używane przez poszczególne witryny internetowe. Poniżej
          znajduje się lista partnerów lub ich usług zaimplementowanych w
          Serwisie, mogących umieszczać pliki cookies:{" "}
        </div>
        <ul id="zewnetrzne">
          <li>
            <strong>Usługi społecznościowe / łączone:</strong>
            <br />
            (Rejestracja, Logowanie, udostępnianie treści, komunikacja, itp.)
            <br />
            <ul>
              <li>
                <a
                  rel="nofollow external"
                  href="https://policies.google.com/privacy?hl=pl"
                >
                  Google+
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div>
          Usługi świadczone przez podmioty trzecie są poza kontrolą
          Administratora. Podmioty te mogą w każdej chwili zmienić swoje warunki
          świadczenia usług, polityki prywatności, cel przetwarzania danych oraz
          sposów wykorzystywania plików cookie.
        </div>
        <h2>§8 Rodzaje gromadzonych danych</h2>
        <div>
          Serwis gromadzi dane o Użytkownikach. Cześć danych jest gromadzona
          automatycznie i anonimowo, a część danych to dane osobowe podane
          dobrowolnie przez Użytkowników w trakcie zapisywania się do
          poszczególnych usług oferowanych przez Serwis.
        </div>
        <div>
          <strong>Anonimowe dane gromadzone automatycznie:</strong>
        </div>
        <ul>
          <li>Adres IP</li>
          <li>Typ przeglądarki</li>
          <li>Rozdzielczość ekranu</li>
          <li>Przybliżona lokalizacja</li>
          <li>Otwierane podstrony serwisu</li>
          <li>Adres poprzedniej podstrony</li>
          <li>Język przeglądarki</li>
        </ul>
        <div>
          <strong>Dane gromadzone podczas rejestracji:</strong>
        </div>
        <ul>
          <li>Imię / nazwisko / pseudonim</li>
          <li>Adres e-mail</li>
          <li>Avatar / Zdjęcie profilowe</li>
          <li>Adres zamieszkania</li>
          <li>Numer telefonu</li>
          <li>Adres IP (zbierane automatycznie)</li>
          <li>Inne dane zwykłe</li>
        </ul>
        <div>
          <strong>Dane gromadzone podczas dodawania komentarza</strong>
        </div>
        <ul>
          <li>Imię i nazwisko / pseudonim</li>
          <li>Adres e-mail</li>
          <li>Adres IP (zbierane automatycznie)</li>
        </ul>
        <div>
          Część danych (bez danych identyfikujących) może być przechowywana w
          plikach cookies. Cześć danych (bez danych identyfikujących) może być
          przekazywana do dostawcy usług statystycznych.
        </div>
        <h2>§9 Dostęp do danych osobowych przez podmioty trzecie</h2>
        <div>
          Co do zasady jedynym odbiorcą danych osobowych podawanych przez
          Użytkowników jest Administrator. Dane gromadzone w ramach świadczonych
          usług nie są przekazywane ani odsprzedawane podmiotom trzecim.
        </div>
        <div>
          Dostęp do danych (najczęściej na podstawie Umowy powierzenia
          przetwarzania danych) mogą posiadać podmioty, odpowiedzialne za
          utrzymania infrastruktury i usług niezbędnych do prowadzenia serwisu
          tj.:
        </div>
        <ul></ul>
        <h2>§10 Sposób przetwarzania danych osobowych</h2>
        <div>
          <strong>Dane osobowe podane dobrowolnie przez Użytkowników:</strong>
        </div>
        <ul>
          <li>
            Dane osobowe nie będą przekazywane poza Unię Europejską, chyba że
            zostały opublikowane na skutek indywidualnego działania Użytkownika
            (np. wprowadzenie komentarza lub wpisu), co sprawi, że dane będą
            dostępne dla każdej osoby odwiedzającej serwis.
          </li>
          <li>
            Dane osobowe nie będą wykorzystywane do zautomatyzowanego
            podejmowania decyzji (profilowania).
          </li>
          <li>Dane osobowe nie będą odsprzedawane podmiotom trzecim.</li>
        </ul>
        <div>
          <strong>
            Dane anonimowe (bez danych osobowych) gromadzone automatycznie:
          </strong>
        </div>
        <ul>
          <li>
            Dane anonimiwe (bez danych osobowych) nie będą przekazywane poza
            Unię Europejską.
          </li>
          <li>
            Dane anonimiwe (bez danych osobowych) nie będą wykorzystywane do
            zautomatyzowanego podejmowania decyzji (profilowania).
          </li>
          <li>
            Dane anonimiwe (bez danych osobowych) nie będą odsprzedawane
            podmiotom trzecim.
          </li>
        </ul>
        <h2>§11 Podstawy prawne przetwarzania danych osobowych</h2>
        <div>Serwis gromadzi i przetwarza dane Użytkowników na podstawie:</div>
        <ul>
          <li>
            Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia
            27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z
            przetwarzaniem danych osobowych i w sprawie swobodnego przepływu
            takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne
            rozporządzenie o ochronie danych)
            <ul>
              <li>
                art. 6 ust. 1 lit. a<br />
                <small>
                  osoba, której dane dotyczą wyraziła zgodę na przetwarzanie
                  swoich danych osobowych w jednym lub większej liczbie
                  określonych celów
                </small>
              </li>
              <li>
                art. 6 ust. 1 lit. b<br />
                <small>
                  przetwarzanie jest niezbędne do wykonania umowy, której stroną
                  jest osoba, której dane dotyczą, lub do podjęcia działań na
                  żądanie osoby, której dane dotyczą, przed zawarciem umowy
                </small>
              </li>
              <li>
                art. 6 ust. 1 lit. f<br />
                <small>
                  przetwarzanie jest niezbędne do celów wynikających z prawnie
                  uzasadnionych interesów realizowanych przez administratora lub
                  przez stronę trzecią
                </small>
              </li>
            </ul>
          </li>
          <li>
            Ustawa z dnia 10 maja 2018 r. o ochronie danych osobowych (Dz.U.
            2018 poz. 1000)
          </li>
          <li>
            Ustawa z dnia 16 lipca 2004 r. Prawo telekomunikacyjne (Dz.U. 2004
            nr 171 poz. 1800)
          </li>
          <li>
            Ustawa z dnia 4 lutego 1994 r. o prawie autorskim i prawach
            pokrewnych (Dz. U. 1994 Nr 24 poz. 83)
          </li>
        </ul>
        <h2>§12 Okres przetwarzania danych osobowych</h2>
        <div>
          <strong>Dane osobowe podane dobrowolnie przez Użytkowników:</strong>
        </div>
        <div>
          Co do zasady wskazane dane osobowe są przechowywane wyłącznie przez
          okres świadczenia Usługi w ramach Serwisu przez Administratora. Są one
          usuwane lub anonimizowane w okresie do 30 dni od chwili zakończenia
          świadczenia usług (usunięcie zarejestrowanego konta użytkownika)
        </div>
        <div>
          Wyjątek stanowi sytuacja, która wymaga zabezpieczenia prawnie
          uzasadnionych celów dalszego przetwarzania tych danych przez
          Administratora. W takiej sytuacji Administrator będzie przechowywał
          wskazane dane, od czasu żądania ich usunięcia przez Użytkownika, nie
          dłużej niż przez okres 3 lat w przypadku naruszenia lub podejrzenia
          naruszenia zapisów regulaminu serwisu przez Użytkownika
        </div>
        <div>
          <strong>
            Dane anonimowe (bez danych osobowych) gromadzone automatycznie:
          </strong>
        </div>
        <div>
          Anonimowe dane statystyczne, niestanowiące danych osobowych, są
          przechowywane przez Administratora w celu prowadzenia statystyk
          serwisu przez czas nieoznaczony
        </div>
        <h2>
          §13 Prawa Użytkowników związane z przetwarzaniem danych osobowych
        </h2>
        <div>Serwis gromadzi i przetwarza dane Użytkowników na podstawie:</div>
        <ul>
          <li>
            <div>
              <strong>Prawo dostępu do danych osobowych</strong>
              <br />
              Użytkownikom przysługuje prawo uzyskania dostępu do swoich danych
              osobowych, realizowane za pośrednictwem panelu użytkownika
              dostępnego po zalogowaniu i narzędzi umożliwiających dostęp do
              konta w przypadku zapomnianego hasła.
            </div>
          </li>
          <li>
            <div>
              <strong>Prawo do sprostowania danych osobowych</strong>
              <br />
              Użytkownikom przysługuje prawo żądania od Administratora
              niezwłocznego sprostowania danych osobowych, które są
              nieprawidłowe lub / oraz uzupełnienia niekompletnych danych
              osobowych, realizowane za pośrednictwem panelu użytkownika
              dostępnego po zalogowaniu i narzędzi umożliwiających dostęp do
              konta w przypadku zapomnianego hasła.
            </div>
          </li>
          <li>
            <div>
              <strong>Prawo do usunięcia danych osobowych</strong>
              <br />
              Użytkownikom przysługuje prawo żądania od Administratora
              niezwłocznego usunięcia danych osobowych, realizowane na żądanie
              złożone do AdministratoraW przypadku kont użytkowników, usunięcie
              danych polega na anonimizacji danych umożliwiających identyfikację
              Użytkownika. Administrator zastrzega sobie prawo wstrzymania
              realizacji żądania usunięcia danych w celu ochrony prawnie
              uzasadnionego interesu Administratora (np. w gdy Użytkownik
              dopuścił się naruszenia Regulaminu czy dane zostały pozyskane
              wskutek prowadzonej korespondencji).
              <br />
            </div>
          </li>
          <li>
            <div>
              <strong>
                Prawo do ograniczenia przetwarzania danych osobowych
              </strong>
              <br />
              Użytkownikom przysługuje prawo ograniczenia przetwarzania danych
              osobowych w przypadkach wskazanych w art. 18 RODO, m.in.
              kwestionowania prawidłowość danych osobowych, realizowane na
              żądanie złożone do Administratora
            </div>
          </li>
          <li>
            <div>
              <strong>Prawo do przenoszenia danych osobowych</strong>
              <br />
              Użytkownikom przysługuje prawo uzyskania od Administratora, danych
              osobowych dotyczących Użytkownika w ustrukturyzowanym, powszechnie
              używanym formacie nadającym się do odczytu maszynowego,
              realizowane na żądanie złożone do Administratora
            </div>
          </li>
          <li>
            <div>
              <strong>
                Prawo wniesienia sprzeciwu wobec przetwarzania danych osobowych
              </strong>
              <br />
              Użytkownikom przysługuje prawo wniesienia sprzeciwu wobec
              przetwarzania jego danych osobowych w przypadkach określonych w
              art. 21 RODO, realizowane na żądanie złożone do Administratora
            </div>
          </li>
          <li>
            <div>
              <strong>Prawo wniesienia skargi</strong>
              <br />
              Użytkownikom przysługuje prawo wniesienia skargi do organu
              nadzorczego zajmującego się ochroną danych osobowych.
            </div>
          </li>
        </ul>
        <h2>§14 Kontakt do Administratora</h2>
        <div>
          Z Administratorem można skontaktować się w jeden z poniższych sposobów
        </div>
        <ul>
          <li>
            <div>
              <strong>Adres pocztowy</strong> - PetBuddy, Wrocław
            </div>
          </li>{" "}
          <li>
            <div>
              <strong>Adres poczty elektronicznej</strong> -
              petbuddy.zpi@gmail.com
            </div>
          </li>{" "}
        </ul>
        <h2>§15 Wymagania Serwisu</h2>
        <ul>
          <li>
            <div>
              Ograniczenie zapisu i dostępu do plików Cookie na Urządzeniu
              Użytkownika może spowodować nieprawidłowe działanie niektórych
              funkcji Serwisu.
            </div>
          </li>{" "}
          <li>
            <div>
              Administrator nie ponosi żadnej odpowiedzialności za nieprawidłowo
              działające funkcje Serwisu w przypadku gdy Użytkownik ograniczy w
              jakikolwiek sposób możliwość zapisywania i odczytu plików Cookie.
            </div>
          </li>
        </ul>
        <h2>§16 Linki zewnętrzne</h2>
        <div>
          W Serwisie - artykułach, postach, wpisach czy komentarzach
          Użytkowników mogą znajdować się odnośniki do witryn zewnętrznych, z
          którymi Właściciel serwisu nie współpracuje. Linki te oraz strony lub
          pliki pod nimi wskazane mogą być niebezpieczne dla Twojego Urządzenia
          lub stanowić zagrożenie bezpieczeństwa Twoich danych. Administrator
          nie ponosi odpowiedzialności za zawartość znajdującą się poza
          Serwisem.
        </div>
        <h2>§17 Zmiany w Polityce Prywatności</h2>
        <ul>
          <li>
            <div>
              Administrator zastrzega sobie prawo do dowolnej zmiany niniejszej
              Polityki Prywatności bez konieczności informowania o tym
              Użytkowników w zakresie stosowania i wykorzystywania danych
              anonimowych lub stosowania plików Cookie.
            </div>
          </li>
          <li>
            <div>
              Administrator zastrzega sobie prawo do dowolnej zmiany niniejszej
              Polityki Prywatności w zakresie przetwarzania Danych Osobowych, o
              czym poinformuje Użytkowników posiadających konta użytkownika za
              pośrednictwem poczty elektronicznej w terminie do 7 dni od zmiany
              zapisów. Dalsze korzystanie z usług oznacza zapoznanie się i
              akceptację wprowadzonych zmian Polityki Prywatności. W przypadku w
              którym Użytkownik nie będzie się zgadzał z wprowadzonymi zmianami,
              ma obowiązek usunąć swoje konto z Serwisu.
            </div>
          </li>{" "}
          <li>
            <div>
              Wprowadzone zmiany w Polityce Prywatności będą publikowane na tej
              podstronie Serwisu.
            </div>
          </li>{" "}
          <li>
            <div>
              Wprowadzone zmiany wchodzą w życie z chwilą ich publikacji.
            </div>
          </li>
        </ul>
      </article>
    );
  } else {
    return (
      <article className="terms-and-conditions">
        <h1>Privacy Policy</h1>
        <div>
          The following Privacy Policy specifies the{" "}
          <strong>
            rules for saving and accessing data on Users' Devices
          </strong>{" "}
          using the Service for the purpose of providing electronic services by
          the Administrator and the
          <strong>
            rules for collecting and processing Users' personal data
          </strong>
          , which were provided by them personally and voluntarily through the
          tools available in the Service.
        </div>
        <div>
          The following Privacy Policy is an integral part of the Terms of
          Service, which specifies the rules, rights, and obligations of Users
          using the Service.
        </div>
        <h2>§1 Definitions</h2>
        <ul>
          <li>
            <div>
              <strong>Service</strong> - the online service "PetBuddy"
            </div>
          </li>
          <li>
            <div>
              <strong>External Service</strong> - the websites of partners,
              service providers, or contractors cooperating with the
              Administrator
            </div>
          </li>
          <li>
            <div>
              <strong>Service / Data Administrator</strong> - The Service
              Administrator and Data Administrator (hereinafter Administrator)
              is the company "PetBuddy", conducting business at: Wrocław.
            </div>
          </li>
          <li>
            <div>
              <strong>User</strong> - a natural person for whom the
              Administrator provides electronic services via the Service.
            </div>
          </li>
          <li>
            <div>
              <strong>Device</strong> - an electronic device with software
              through which the User gains access to the Service.
            </div>
          </li>
          <li>
            <div>
              <strong>Cookies</strong> - text data collected in the form of
              files placed on the User's Device.
            </div>
          </li>
          <li>
            <div>
              <strong>GDPR</strong> - Regulation (EU) 2016/679 of the European
              Parliament and of the Council of 27 April 2016 on the protection
              of natural persons with regard to the processing of personal data
              and on the free movement of such data, and repealing Directive
              95/46/EC (General Data Protection Regulation).
            </div>
          </li>
          <li>
            <div>
              <strong>Personal Data</strong> - means information about an
              identified or identifiable natural person ("data subject"); an
              identifiable natural person is one who can be identified, directly
              or indirectly, in particular by reference to an identifier such as
              a name, identification number, location data, online identifier,
              or to one or more factors specific to the physical, physiological,
              genetic, mental, economic, cultural or social identity of that
              natural person.
            </div>
          </li>
          <li>
            <div>
              <strong>Processing</strong> - means any operation or set of
              operations which is performed on personal data or on sets of
              personal data, whether or not by automated means, such as
              collection, recording, organization, structuring, storage,
              adaptation or alteration, retrieval, consultation, use, disclosure
              by transmission, dissemination or otherwise making available,
              alignment or combination, restriction, erasure or destruction.
            </div>
          </li>
          <li>
            <div>
              <strong>Restriction of processing</strong> - means the marking of
              stored personal data with the aim of limiting their processing in
              the future.
            </div>
          </li>
          <li>
            <div>
              <strong>Profiling</strong> - means any form of automated
              processing of personal data consisting of the use of personal data
              to evaluate certain personal aspects relating to a natural person,
              in particular to analyze or predict aspects concerning that
              natural person's performance at work, economic situation, health,
              personal preferences, interests, reliability, behavior, location
              or movements.
            </div>
          </li>
          <li>
            <div>
              <strong>Consent</strong> - the consent of the data subject means
              any freely given, specific, informed and unambiguous indication of
              the data subject's wishes by which they, by a statement or by a
              clear affirmative action, signify agreement to the processing of
              personal data relating to them.
            </div>
          </li>
          <li>
            <div>
              <strong>Personal data breach</strong> - means a breach of security
              leading to the accidental or unlawful destruction, loss,
              alteration, unauthorized disclosure of, or access to, personal
              data transmitted, stored or otherwise processed.
            </div>
          </li>
          <li>
            <div>
              <strong>Pseudonymization</strong> - means the processing of
              personal data in such a manner that the personal data can no
              longer be attributed to a specific data subject without the use of
              additional information, provided that such additional information
              is kept separately and is subject to technical and organizational
              measures to ensure that the personal data are not attributed to an
              identified or identifiable natural person.
            </div>
          </li>
          <li>
            <div>
              <strong>Anonymization</strong> - Anonymization of data is an
              irreversible process of data operations that destroys / overwrites
              "personal data" making it impossible to identify, or associate a
              given record with a specific user or natural person.
            </div>
          </li>
        </ul>
        <h2>§2 Data Protection Officer</h2>
        <div>
          Based on Article 37 of the GDPR, the Administrator has not appointed a
          Data Protection Officer.
        </div>
        <div>
          For matters concerning data processing, including personal data,
          please contact the Administrator directly.
        </div>
        <h2>§3 Types of Cookies</h2>
        <ul>
          <li>
            <div>
              <strong>Internal Cookies</strong> - files placed and read from the
              User's Device by the Service's telecommunication system.
            </div>
          </li>
          <li>
            <div>
              <strong>External Cookies</strong> - files placed and read from the
              User's Device by the telecommunication systems of External
              Services. Scripts of External Services that may place Cookies on
              the User's Devices were intentionally placed in the Service
              through scripts and services made available and installed in the
              Service.
            </div>
          </li>
        </ul>
        <h2>§4 Data Storage Security</h2>
        <ul>
          <li>
            <div>
              <strong>Mechanisms for storing and reading Cookies</strong> - The
              mechanisms for storing, reading, and exchanging data between
              Cookies stored on the User's Device and the Service are carried
              out through built-in browser mechanisms and do not allow for
              downloading other data from the User's Device or data from other
              websites visited by the User, including personal data or
              confidential information. Transferring viruses, Trojan horses, and
              other worms to the User's Device is also practically impossible.
            </div>
          </li>
          <li>
            <div>
              <strong>Internal Cookies</strong> - Cookies used by the
              Administrator are safe for the Users' Devices and do not contain
              scripts, content, or information that may threaten the security of
              personal data or the security of the Device used by the User.
            </div>
          </li>
          <li>
            <div>
              <strong>External Cookies</strong> - The Administrator makes every
              effort to verify and select service partners in the context of
              User security. The Administrator selects known, large partners
              with global social trust. However, the Administrator does not have
              full control over the content of Cookies from external partners.
              The Administrator is not responsible for the security of Cookies,
              their content, and their use in accordance with the license by
              Scripts installed in the service, from External Services, to the
              extent permitted by law. A list of partners is included in the
              further part of the Privacy Policy.
            </div>
          </li>
          <li>
            <div>
              <strong>Control of Cookies</strong>
              <ul>
                <li>
                  <div>
                    The User may, at any time, independently change the settings
                    regarding the saving, deletion, and access to data of saved
                    Cookies by any website.
                  </div>
                </li>
                <li>
                  <div>
                    Information on how to disable Cookies in the most popular
                    computer browsers is available at:
                    <a
                      rel="external"
                      href="https://nety.pl/how-to-disable-cookies/"
                    >
                      how to disable cookies
                    </a>
                    or from one of the listed providers:
                    <ul>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.google.com/accounts/answer/61416?co=GENIE.Platform%3DDesktop&#038;hl=en"
                        >
                          Managing cookies in <strong>Chrome</strong> browser
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://help.opera.com/en/latest/web-preferences/"
                        >
                          Managing cookies in <strong>Opera</strong> browser
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.mozilla.org/en/kb/enable-and-disable-cookies-website-preferences"
                        >
                          Managing cookies in <strong>FireFox</strong> browser
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.microsoft.com/en-us/help/4027947/microsoft-edge-delete-cookies"
                        >
                          Managing cookies in <strong>Edge</strong> browser
                        </a>
                      </li>
                      <li>
                        <a
                          rel="nofollow external"
                          href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac"
                        >
                          Managing cookies in <strong>Safari</strong> browser
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <div>
                    The User may delete all Cookies saved so far at any time
                    using the tools of the User's Device, through which the User
                    uses the services of the Service.
                  </div>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <div>
              <strong>User-side threats</strong> - The Administrator applies all
              possible technical measures to ensure the security of data placed
              in Cookies. However, it should be noted that ensuring the security
              of these data depends on both parties, including the User's
              activities. The Administrator is not responsible for the
              interception of these data, impersonation of the User's session,
              or their removal as a result of conscious or unconscious activity
              of the User, viruses, Trojan horses, and other spyware that may or
              have been infected with the User's Device. Users should take
              measures to protect themselves from these threats. should follow
              the
              <a rel="external" href="https://nety.pl/en/cybersecurity/">
                principles of safe internet usage
              </a>
              .
            </div>
          </li>
          <li>
            <div>
              <strong>Storage of personal data</strong> - The Administrator
              ensures that every effort is made to keep the personal data
              voluntarily provided by Users secure, with access to them being
              limited and performed in accordance with their intended purpose
              and processing objectives. The Administrator also ensures that
              every effort is made to secure the data held against loss by using
              appropriate physical and organizational safeguards.
            </div>
          </li>
          <li>
            <div>
              <strong>Password storage</strong> - The Administrator declares
              that passwords are stored in encrypted form, using the latest
              standards and guidelines in this regard. Decrypting the passwords
              provided in the Service is practically impossible.
            </div>
          </li>
        </ul>
        <h2>§5 Purposes for which Cookies are used</h2>
        <ul id="cele">
          <li>Improvement and facilitation of access to the Service</li>
          <li>Personalization of the Service for Users</li>
          <li>Enabling login to the service</li>
          <li>Providing social services</li>
        </ul>
        <h2>§6 Purposes of Personal Data Processing</h2>
        <div>
          Personal data voluntarily provided by Users are processed for one of
          the following purposes:
        </div>
        <ul>
          <li>
            Providing electronic services:
            <ul>
              <li>
                Registration and maintenance of the User account in the Service
                and related functionalities
              </li>
              <li>
                Commenting / liking posts in the Service without the need to
                register
              </li>
            </ul>
          </li>
          <li>
            Communication between the Administrator and Users regarding the
            Service and data protection
          </li>
          <li>Ensuring the legitimate interest of the Administrator</li>
        </ul>
        <div>
          Data about Users collected anonymously and automatically are processed
          for one of the following purposes:
        </div>
        <ul>
          <li>Ensuring the legitimate interest of the Administrator</li>
        </ul>
        <h2>§7 Cookies from External Services</h2>
        <div id="zewinfo">
          The Administrator uses JavaScript scripts and web components from
          partners who may place their own cookies on the User's Device.
          Remember that you can decide on the allowed cookies used by individual
          websites in your browser settings. Below is a list of partners or
          their services implemented in the Service that may place cookies:
        </div>
        <ul id="zewnetrzne">
          <li>
            <strong>Social / Combined Services:</strong>
            <br />
            (Registration, Login, content sharing, communication, etc.)
            <br />
            <ul>
              <li>
                <a
                  rel="nofollow external"
                  href="https://policies.google.com/privacy?hl=en"
                >
                  Google+
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <div>
          Services provided by third parties are beyond the control of the
          Administrator. These entities may change their terms of service,
          privacy policies, data processing purposes, and methods of using
          cookies at any time.
        </div>
        <h2>§8 Types of Collected Data</h2>
        <div>
          The Service collects data about Users. Some of the data is collected
          automatically and anonymously, while some are personal data
          voluntarily provided by Users when signing up for various services
          offered by the Service.
        </div>
        <div>
          <strong>Anonymous data collected automatically:</strong>
        </div>
        <ul>
          <li>IP Address</li>
          <li>Browser Type</li>
          <li>Screen Resolution</li>
          <li>Approximate Location</li>
          <li>Visited Subpages</li>
          <li>Previous Subpage Address</li>
          <li>Browser Language</li>
        </ul>
        <div>
          <strong>Data collected during registration:</strong>
        </div>
        <ul>
          <li>First Name / Last Name / Nickname</li>
          <li>Email Address</li>
          <li>Avatar / Profile Picture</li>
          <li>Home Address</li>
          <li>Phone Number</li>
          <li>IP Address (collected automatically)</li>
          <li>Other Common Data</li>
        </ul>
        <div>
          <strong>Data collected when adding a comment</strong>
        </div>
        <ul>
          <li>First and Last Name / Nickname</li>
          <li>Email Address</li>
          <li>IP Address (collected automatically)</li>
        </ul>
        <div>
          Some data (without identifying information) may be stored in cookies.
          Some data (without identifying information) may be transmitted to the
          statistical services provider.
        </div>
        <h2>§9 Access to Personal Data by Third Parties</h2>
        <div>
          As a rule, the only recipient of personal data provided by Users is
          the Administrator. The data collected as part of the services provided
          are not transferred or resold to third parties.
        </div>
        <div>
          Access to the data (usually based on a Data Processing Agreement) may
          be held by entities responsible for maintaining the infrastructure and
          services necessary to run the service, such as:
        </div>
        <ul></ul>
        <h2>§10 Method of Personal Data Processing</h2>
        <div>
          <strong>Personal data voluntarily provided by Users:</strong>
        </div>
        <ul>
          <li>
            Personal data will not be transferred outside the European Union
            unless published as a result of an individual User action (e.g.,
            posting a comment or entry), which will make the data available to
            any visitor to the service.
          </li>
          <li>
            Personal data will not be used for automated decision-making
            (profiling).
          </li>
          <li>Personal data will not be resold to third parties.</li>
        </ul>
        <div>
          <strong>
            Anonymous data (without personal data) collected automatically:
          </strong>
        </div>
        <ul>
          <li>
            Anonymous data (without personal data) will not be transferred
            outside the European Union.
          </li>
          <li>
            Anonymous data (without personal data) will not be used for
            automated decision-making (profiling).
          </li>
          <li>
            Anonymous data (without personal data) will not be resold to third
            parties.
          </li>
        </ul>
        <h2>§11 Legal Basis for Personal Data Processing</h2>
        <div>The Service collects and processes Users' data based on:</div>
        <ul>
          <li>
            Regulation (EU) 2016/679 of the European Parliament and of the
            Council of 27 April 2016 on the protection of natural persons with
            regard to the processing of personal data and on the free movement
            of such data, and repealing Directive 95/46/EC (General Data
            Protection Regulation)
            <ul>
              <li>
                art. 6(1)(a)
                <br />
                <small>
                  the data subject has given consent to the processing of their
                  personal data for one or more specific purposes
                </small>
              </li>
              <li>
                art. 6(1)(b)
                <br />
                <small>
                  processing is necessary for the performance of a contract to
                  which the data subject is a party or in order to take steps at
                  the request of the data subject prior to entering into a
                  contract
                </small>
              </li>
              <li>
                art. 6(1)(f)
                <br />
                <small>
                  processing is necessary for the purposes of the legitimate
                  interests pursued by the controller or by a third party
                </small>
              </li>
            </ul>
          </li>
          <li>
            Act of 10 May 2018 on the protection of personal data (Journal of
            Laws 2018, item 1000)
          </li>
          <li>
            Act of 16 July 2004 Telecommunications Law (Journal of Laws 2004 No.
            171, item 1800)
          </li>
          <li>
            Act of 4 February 1994 on copyright and related rights (Journal of
            Laws 1994 No. 24, item 83)
          </li>
        </ul>
        <h2>§12 Period of Personal Data Processing</h2>
        <div>
          <strong>Personal data provided voluntarily by Users:</strong>
        </div>
        <div>
          As a rule, the indicated personal data is stored only for the period
          of providing the Service within the Service by the Administrator. They
          are deleted or anonymized within 30 days from the end of the provision
          of services (deletion of a registered user account)
        </div>
        <div>
          An exception is a situation that requires securing the legitimate
          purposes of further processing of this data by the Administrator. In
          such a case, the Administrator will store the indicated data, from the
          time of the User's request for their deletion, for no longer than 3
          years in the case of a breach or suspicion of a breach of the Service
          regulations by the User.
        </div>
        <div>
          <strong>
            Anonymous data (without personal data) collected automatically:
          </strong>
        </div>
        <div>
          Anonymous statistical data, which does not constitute personal data,
          is stored by the Administrator for an indefinite period to conduct
          service statistics.
        </div>
        <h2>§13 User Rights Related to Personal Data Processing</h2>
        <div>The Service collects and processes Users' data based on:</div>
        <ul>
          <li>
            <div>
              <strong>Right of access to personal data</strong>
              <br />
              Users have the right to obtain access to their personal data,
              carried out via the user panel available after logging in and
              tools enabling account access in case of a forgotten password.
            </div>
          </li>
          <li>
            <div>
              <strong>Right to rectify personal data</strong>
              <br />
              Users have the right to request the Administrator to rectify
              personal data that is inaccurate or to complete incomplete
              personal data, carried out via the user panel available after
              logging in and tools enabling account access in case of a
              forgotten password.
            </div>
          </li>
          <li>
            <div>
              <strong>Right to erasure of personal data</strong>
              <br />
              Users have the right to request the Administrator to delete
              personal data immediately, carried out on request submitted to the
              AdministratorIn the case of user accounts, data deletion involves
              anonymizing data that allows User identification. The
              Administrator reserves the right to suspend the implementation of
              the data deletion request to protect the legitimate interest of
              the Administrator (e.g., if the User has violated the Regulations
              or the data was obtained as a result of correspondence).
              <br />
            </div>
          </li>
          <li>
            <div>
              <strong>Right to restrict the processing of personal data</strong>
              <br />
              Users have the right to restrict the processing of personal data
              in cases indicated in Article 18 of the GDPR, including
              questioning the accuracy of personal data, carried out on request
              submitted to the Administrator
            </div>
          </li>
          <li>
            <div>
              <strong>Right to data portability</strong>
              <br />
              Users have the right to receive from the Administrator their
              personal data in a structured, commonly used, and machine-readable
              format, carried out on request submitted to the Administrator
            </div>
          </li>
          <li>
            <div>
              <strong>
                Right to object to the processing of personal data
              </strong>
              <br />
              Users have the right to object to the processing of their personal
              data in the cases specified in Article 21 of the GDPR, carried out
              on request submitted to the Administrator
            </div>
          </li>
          <li>
            <div>
              <strong>Right to lodge a complaint</strong>
              <br />
              Users have the right to lodge a complaint with a supervisory
              authority dealing with personal data protection.
            </div>
          </li>
        </ul>
        <h2>§14 Contact to the Administrator</h2>
        <div>
          You can contact the Administrator in one of the following ways:
        </div>
        <ul>
          <li>
            <div>
              <strong>Postal Address</strong> - PetBuddy, Wrocław
            </div>
          </li>
          <li>
            <div>
              <strong>Email Address</strong> - petbuddy.zpi@gmail.com
            </div>
          </li>
          <li>
            <div>
              <strong>Contact Form</strong> - available at: /kontakt
            </div>
          </li>
        </ul>
        <h2>§15 Service Requirements</h2>
        <ul>
          <li>
            <div>
              Limiting the storage and access to Cookies on the User's Device
              may cause some Service functions to malfunction.
            </div>
          </li>
          <li>
            <div>
              The Administrator bears no responsibility for improperly
              functioning Service functions if the User in any way restricts the
              ability to save and read Cookie files.
            </div>
          </li>
        </ul>
        <h2>§16 External Links</h2>
        <div>
          In the Service - articles, posts, entries, or User comments may
          contain links to external websites with which the Service Owner does
          not cooperate. These links and the sites or files indicated under them
          may be dangerous for your Device or pose a threat to the security of
          your data. The Administrator is not responsible for the content found
          outside the Service.
        </div>
        <h2>§17 Changes to the Privacy Policy</h2>
        <ul>
          <li>
            <div>
              The Administrator reserves the right to change this Privacy Policy
              at any time without informing Users in the scope of using and
              utilizing anonymous data or using Cookie files.
            </div>
          </li>
          <li>
            <div>
              The Administrator reserves the right to change this Privacy Policy
              in the scope of processing Personal Data, about which Users with
              user accounts will be informed via email within 7 days from the change. 
              Continued use of the services indicates familiarity with and acceptance of the
              changes made to the Privacy Policy. If the User does not agree
              with the changes, they must delete their account from the Service.
            </div>
          </li>
          <li>
            <div>
              The changes made to the Privacy Policy will be published on this
              subpage of the Service.
            </div>
          </li>
          <li>
            <div>The changes come into effect upon publication.</div>
          </li>
        </ul>
      </article>
    );
  }
};

export default TermsAndConditions;
