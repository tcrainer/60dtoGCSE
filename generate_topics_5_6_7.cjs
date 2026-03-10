const fs = require('fs');

const topic5Raw = `
1	die Medien	the media
1	die Mediennutzung	how people use media
1	das Internet	inernet
1	das Fernsehen	television
1	das Fernsehen verliert an Bedeutung	television is becoming less important
1	"Sie hören die Nachrichten"	"here is the news"
2	die Nachricht	piece of news
2	die Nachricht	item of news
2	die Nachrichten	the news
2	die Nachrichtenmedien	the news media
2	die Nachrichtensendung, die Tagesschau	news programme
2	die Werbung	advertising
3	der Einfluss auf Gesellschaft und Politik	influence on society and politics
3	die Meinungsfreiheit	freedom of speech
3	die Fake News	fake news
3	die Fake News (pl)	fake news
3	die Desinformation	disinformation
3	der Datenschutz	data protection
4	das Cybermobbing	cyberbullying
4	die Presse mundtot machen	to gag the press
4	die Presseagentur (en)	press agency
4	die Pressefreiheit	freedom of the press
4	die Pressezensur	censorship of the press
4	der Journalist (en)	journalist
5	berichten über (AKK)	to report on
5	öffentlich	public
5	beeinflussen	to influence
5	die Sendung (en)	television programme
5	die Zeitschrift (en)	magazine
5	Digital- und Onlinemedien	Digital and online media
6	Fernsehen, Digital-, Print- und Onlinemedien	Television, digital, print and online media
6	die Online-Videothek (en)	online video library
6	die Onlinedienste	online services
6	mit jemandem online chatten	to chat with someone online
6	online einkaufen	to shop online
6	das Digitalfernsehen	digital television
7	die negative Auswirkung der digitalen Medien auf unser Gehirn	the negative effects of digital media on our brains
7	digital	digital
7	in digitaler Form	in digital form
7	das Smartphone (s)	smartphone
7	der Algorithmus, die Algorithmen	algorithm(s)
7	die Filterblase (n)	filter bubble
8	der Rundfunk	broadcasting
8	die Privatsphäre-Einstellungen	privacy settings
8	in die Privatsphäre eingreifen	to invade people's privacy
8	funktionieren	to work (machine)
8	umschalten	to change channels
8	verharmlosen	to make something appear harmless
9	stumpfsinnig	mindless
9	wertlos	worthless
9	sich informieren	to find out, inform oneself
9	abonnieren	to subscribe to
9	ausloggen	to log off
9	ausschalten	to switch off
10	ausstrahlen	to broadcast
10	drucken	to print
10	durchblättern	to leaf, flick through
10	einloggen	to log on
10	einschalten	to switch on
10	liken	to 'like' (social media)
11	mailen	to mail
11	melden	to report
11	posten	to post
11	schmökern	to bury oneself in a book
11	trollen	to troll
11	verbinden	to link, connect
12	verbreiten	to disseminate, spread
12	verleumden	to write malicious things
12	zensieren	to censor
12	ausführlich	full, in depth, detailed
12	das Nachrichtenwesen	news media
12	der 24-Stunden-Nachrichtensender	24-hour news channel
13	die 24-Stunden-Nachrichtenflut	24 hours a day news coverage
13	die Gesellschaft	society
13	die Informationsgesellschaft	information technology-based society
13	erreichbar	contactable
13	gesellig	sociable
13	handlich	handy, practical
14	internetfähig	internet compatible
14	kindisch	childish
14	kostenlos	free, no cost
14	monatlich	monthly
14	postfaktisch	post-truth
14	reißerisch	sensationalist
15	tragbar	portable
15	unzuverlässig	unreliable
15	wöchentlich	weekly
15	Fotos machen, aufnehmen	to take photos
15	aktuell	up-to-date
15	auf Facebook gehen, facebooken	to go on Facebook
16	ausgewogen	balanced
16	blitzschnell	fast as lightning, instantly
16	deprimiert	depressed
16	dumm	stupid
16	ein Zerrbild entwerfen (i-a-o)	to give a distorted picture
16	eine Zeitung herausgeben (i-a-e)	to publish a newspaper
17	erscheinen (Buch, Film)	to be published
17	gehirnamputiert	dead from the neck up
17	im Hintergrund laufen (ä-ie-au)	to be on in the background
17	interaktiv	interactive
17	kinderleicht	child's play
17	live	live
18	packend	gripping, thrilling
18	passiv	passive
18	seriös	serious, heavyweight
18	sich erkundigen nach (DAT)	to find out about
18	spannend	exciting
18	sprachgesteuert	hands-free
19	(zu) spammen	to spam
19	Essstörungen verherrlichen	to glorify eating disorders
19	Fotos verschicken	to send photos
19	Informationen austauschen	to exchange information
19	Kontakte knüpfen	to network
19	Nützliches erfahren	to learn useful things
20	Schlagzeilen machen	to hit the headlines
20	Vernetzungsmöglichkeiten eröffnen	to open up networking possibilities
20	anschließen (ie-o-o)	to plut in
20	empfangen (ä-i-a)	to receive
20	etwas nachsehen	to look something up
20	jemandem mailen	to e-mail someone
21	jemandem simsen	to text someone
21	jemanden hänseln	to pick on someone
21	kontaktfreudig sein	to enjoy making contact
21	sich ausruhen	to relax, rest
21	sich engagieren	to get involved
21	twittern, (re)tweeten	to (re)tweet
22	vegetieren, vertrotteln	to vegetate
22	Fluch oder Segen	curse or a blessing
22	Politiker sind zugänglicher	politicains are more accessible
22	Zeitungen und Zeitschriften	newspapers and magazines
22	der Nachrichtenkanal (¨e)	news channel
22	der Zeitungshändler (-)	newsagent
23	der drahtlose Internetzugang	wireless internet access
23	die Auswirkung auf	the effect on
23	die Tageszeitung (en)	daily newspaper
23	die überregionale Zeitung (en)	national newspaper
23	gewaltsam, gewalttätig	violent
23	kreativ, schöpferisch	creative
24	objektiv, sachlich	objective
24	richtunggebend, einflussreich	influential
24	subjektiv, unsachlich	subjective
24	voreingenommen, einseitig	biased
24	Die Politik	politis
24	Die Printmedien	print media
25	auf Tastendruck	at the click of a button
25	das Bildschirmgestarre	staring at a screen
25	das Breitbandnetz	broadband network
25	das Cybergrooming	internet grooming (of children)
25	das Fernsehangebot	choice of television programmes
25	das Fernsehprogramm	television schedule
26	das Frühstücksfernsehen	breakfast television
26	das Grooming	grooming
26	das Heimkino	home cinema
26	das Layout	layout
26	das Reality-TV	reality TV
26	das Verhalten	behaviour
27	das Weltgeschehen	world events
27	der Bewegungsmangel	lack of exercise
27	der Datendiebstahl	data theft
27	der Enthüllungsjournalismus	investigative journalism
27	der Fernsehkonsum	television consumption
27	der Follower	follower
28	der Hörfunk	radio
28	der Kinderschutz	child protection
28	der Livestream	live streaming
28	der Pädophile	paedophile
28	der Terrorismus	terrorism
29	die Auflage	circulation
29	die Aufmerksamkeitsspanne	attention span
29	die Berichterstattung	reporting
29	die Boulevardpresse	the gutter press, the tabloids
29	die Brutalität	brutality
30	die Daten	data
30	die Depression	depression
30	die Einsamkeit	loneliness
30	die Einstellungen	settings
30	die Erzählliteratur	fiction
31	die Fernsehgebühren	television licence fee
31	die Gewalt	violence
31	die Heimvernetzung	connected home
31	die Kolumne	column (article, page division)
31	die Langeweile	boredom
32	die Leserschaft	readership
32	die Pornografie	pronography
32	die Redaktion	editorial staff
32	die Regenbogenpresse	trashy magazines
32	die Scheinwelt	a bogus world
33	die Unzuverlässigkeit	unreliability
33	die Vereinsamung	loneliness, isolation
33	die Verschlüsselung	encryption
33	die Zeiteinteilung	how one uses one's time
33	die Zustimmung	consent
34	die Zuverlässigkeit	reliability, truthfulness
34	die sozialen Medien (pl)	social media
34	etwas kommentieren	co comment on something
34	hochauflösendes Fernsehen	high-definition television
34	im Fernsehen	on the television
35	im Internet	on the internet
35	kreative Tätigkeiten	creative activities
35	mit Eselsohren	dog-eared
35	positive Aspekte	positive ascepts
35	seicht, trivial	trivial, shallow
36	sexuale Anspielungen	sexual innuendos
36	zum Entspannen	for relaxation
36	zur Ablenkung	for distraction
36	anstößige Inhalte aussortieren	to filter out offensive material
36	auf dem Laufenden bleiben	to keep up to date
37	durch Webseiten scrollen	to scroll through web pages
37	durch die Kanäle zappen	to flick through the channels
37	ein FaceTime-Gespräch führen, facetimen	to have a FaceTime conversation
37	etwas einseitig schildern	to report something in a biased way
37	hacken in (AKK)	to hack into
38	im Internet surfen	to surf the net
38	im Wörterbuch nachschlagen (ä-u-a)	to look up in a dictionary
38	interviewen (hat interviewt)	to interview
38	jemandem etwas ausrichten lassen	to leave someone a message
38	kommunizieren mit (DAT)	to communicate with
39	mit jemandem skypen	to skpe someone
39	negative Kommentare posten	to post negative comments
39	ohne Zustimmung hochladen	to upload without consent
39	persönliche Daten preisgeben	to reveal personal information
39	sein Wissen erweitern	to expand one's knowledge
40	seine Macht missbrauchen	to abues one's power
40	sich durch Werbeeinnahmen finanzieren	to be financed by advertising revenue
40	sich etwas anschauen (DAT)	to watch something
40	stöbern in (DAT)	to browse through
40	vor der Glotze sitzen	to sit in front of the box
41	zu Ende lesen	to finish reading something
41	Bücher und E-books	books and e-books
41	Couchpotato (s), Dauerglotzer	couch potato
41	bei Hodder erschienen	published by Hodder
41	das Abonnement (s)	subscription
42	das Anzeigenblatt (¨er)	local advertising paper
42	das Bild (er)	picture, image
42	das Bücherregal €	ookshelf
42	das E-Book (s)	e-book
42	das Feuilleton (s)	feature, review, arts section
43	das Handy (s)	mobile phone
43	das Interview (s)	interview
43	das Käseblatt (¨er)	local rag
43	das Lesegerät (e)	reading device
43	das Opfer (-)	victim
44	das Profil (e)	profile
44	das Programm (e)	programme guide, channel
44	das Sachbuch (¨er)	non-fiction book
44	das Selfie (s)	selfie
44	das Tablet (s)	tablet (computer)
45	das Titelblatt (¨er)	front page
45	das soziale Netzwerk €	social network
45	das öffentlich-rechtliche Fernsehen	public-service television
45	der / das Computervirus	computer virus
45	der Abonnent (en)	subscriber
46	der Actionfilm (e)	action film
46	der Ansager (-)	announcer
46	der Bildschirm (e)	screen
46	der Computer (-)	computer
46	der Dokumentarfilm (e)	documentary
47	der Drucker (-)	printer
47	der Hacker (-)	hacker
47	der Internetnutzer (-)	internet user
47	der Kampf um Zuschauer	the ratings battle
47	der Kommentar (e)	comment, analysis
48	der Krimi (s)	crime, detective film
48	der Kritiker (-)	crtitic
48	der Leitartikel (-)	leading article
48	der Memorystick (s)	memory stick
48	der Moderator (en)	presenter
49	der Nutzer, Benutzer	user
49	der Redakteur (e)	editor
49	der Reporter, der Berichterstatter	reporter
49	der Roman (e)	novel
49	der Sender (-)	station, channel
50	der Speicher (-)	memory, storage capacity
50	der Spielfilm (e)	feature film
50	der Stecker (-)	plug
50	der Technikfeind (e)	technophobe
50	der Troll (e)	troll
51	der Untersuchungsbericht (e)	investigative report
51	der Verlag (e)	publishing company
51	der Vertrag (¨e)	contract
51	der Werbeblock (s)	commercial break
51	der Werbespot (s)	(television) ad
52	der Zeichentrickfilm (e)	cartoon
52	der Zuschauer (-)	viewer
52	der pädagogische Nutzen	educational benefits
52	die Ausgabe (n)	edition
52	die Bibliothek (en)	library
53	die Boulevardzeitung (en)	tabloid paper
53	die Castingshow (s)	talent show
53	die Datei (en)	file (IT)
53	die Einschaltquote (n)	viewing figures
53	die Fernbedienung (en)	remote control
54	die Geschwindigkeit (en)	speek
54	die Gewaltdarstellung (en)	depiction of violence
54	die Hassbotschaft (en)	hate message
54	die Illustrierte (n)	magazine, glossy
54	die Internetanbindung (en)	internet connection
55	die Kritik (en)	critique, critical review
55	die Kultur (en)	culture
55	die Künstliche Intelligenz (KI)	artificial intelligence (AI)
55	die Liveübertragung (en)	live broadcast
55	die Lust am Lesen	the pleasure of reading
56	die Meldung (en)	report
56	die Ortszeitung (en)	local paper
56	die Reportage (n)	report (longer, fuller)
56	die Rezension (en)	review
56	die SMS (s)	text message
57	die Schikane (n)	bullying, harassment
57	die Schimpftirade (n)	tirade of insults
57	die Seifenoper (n)	soap opera
57	die Serie (n)	series
57	die Sicherheitsmaßnahme (n)	security measure
58	die Sportsendung (en)	sports show
58	die Staffel (n)	season, series
58	die Startseite (n)	home page
58	die Steckdose (n)	plug socket
58	die Suchmaschine (n)	search engine
59	die Sucht (¨e)	addiction
59	die Tastatur (en)	keyboard
59	die Unterhaltungsshow (s)	entertainment show
59	die Voicemail (s)	voicemail
59	die Webcam (s)	webcam
60	die Wettervorhersage (n)	weather forecast
60	die globale Kommunikation	global communication
60	die integrierte Beleuchtung	integrated light
60	die unkritische Haltung	uncritical attitude
60	es beeinflusst unsere Wertvorstellungen	it influences our moral values
61	es lässt dich verdummen	it dulls your mind
61	mehrere Stunden pro Tag	several hours a day
61	rund um die Uhr	round the clock
61	sich über x lustig machen	to make fun of x
61	sie klebt am Handy	she's glued to her mobile phone
62	die Folge (n) (TV)	episode
62	heute geht es nicht mehr ohne	these days people can't do without it
62	Nachrichten über soziale Netzwerke empfangen (ä-i-a)	to get one's news from social media
62	eine Zeitung auf Schadensersatz verklagen	to claim damages from a newspaper
62	mit den Nachrichten auf dem Laufenden bleiben	to keep up to date with the news
63	sich mit jemandem in Verbindung setzen, mit jemandem in Kontakt treten	to make contact with someone
63	man ist 24 Stunden erreichbar	you're available 24 hours a day
63	man ist immer und überall erreichbar	people can always contact you, wherever you are
63	Was kommt heute Abend im Fernsehen?	What's on television this evening?
63	der / das Laptop (s)	laptop
64	der Kassenschlager (-), der Knüller	blockbuster
64	der Reißer (-), der Thriller	thriller
64	die Welt ändert sich permanent	the world is constantly changing
64	ein Teil des heutigen Lebens	part of everyday life
64	er kontrolliert alle paar Minuten seine Facebook-Seite	he checks his Facebook page every few minutes
65	es stellt eine Gefahr für die Meinungsvielfalt dar	it threatens to restrict the expression of a variety of opinions
65	man hat alles in einem Gerät	you have everything in one device
65	man spart Zeit und Geld	you save time and money
65	wie soeben gemeldet wird, …	according to reports just coming in
65	die Webseite (n), die Website (n)	web page, website
66	fernsehen (ie-a-e), Fernseh gucken, Fernseh schauen	to watch television
66	jemanden auf dem Laufenden halten (ä-ie-a)	to keep someone up to date
66	er verwendet Computer und Fernseher immer gleichzeitig	he always watches television at the same time as he's using his computer
66	Bücher haben eine längerfristige Zukunft	books have a future in the long term
66	Eltern sollten verhindern, dass ihre Kinder…	parents should prevent their children from …
67	Kinder fühlen sich leicht ausgegrenzt	chilrend can easily feel excluded
67	Kinder kommen übermüdet in die Schule	children are overtired when they arrive in school
67	Livesendungen lassen den Zuschauer am aktuellen Geschehen teilhaben	live broadcasts allow viewers to keep up with events as they happen
67	alles was Sie brauchen, steht dir zur Verfügung	everything you need is at your fingertips
67	bringen die Politiker in Kontakt mit ihren Wählern	put politicians in direct contact with their voters
68	der Verlust von Fantasie, Fantasieverlust	loss of one's imagination
68	die Kampagnen verbreiten sich über Twitter	campaigns spread via Twitter
68	eine globale Kultur des Austauschs und Zusammenarbeitens	a global culture of sharing and co-operations
68	er kann mit Computern nichts anfangen	he hasn't a clue about computers
68	ich halte mich stundenlang im Internet auf	I'm on the internet for hours
69	immer wird vom bevorstehenden Tod des Buchs geraunt	there are always rumours of the imminent death of books
69	man hat uneingeschränkten Zugriff auf Hunderte E-Books	you have unlimited access to hundreds of e-books
69	man kann Geräte per Handy einstellen	you can operate devices using your mobile phone
69	man sollte keine Kontaktanfragen von Fremden annehmen	you shouldn't accept contact requests from strangers
69	sie beschäftigen sich zu wenig mit ihren Kindern	they take too little interest in their children
70	sie verbringen zu viel Zeit mit Computern	they spend too much time on the computer
70	das Schlagwort (e), die Worthülse (n)	sound-bite
70	der Fernseher (-), das Fernsehgerät (e)	television set
70	die Drohung (en), die Bedrohung (en)	threat
`;

const topic6Raw = `
1	das Fest(e)	celebration
1	das Festessen	celebration meal
1	die Feier(n)	party
1	die Feierlichkeiten	festivities,celebrations
1	Jüdische und islamische Feiern	Jewish and Islamic celebrations
1	etwas gebührend feiern	to celebrate something properly
2	feiern	to celebrate
2	wir feiern die Geburt Jesu Christi	we celebrate the birth of Christ
2	die Tradition unterscheidet sich von Region zu Region	tradition varies from one region to another
2	die Tradition wird groß geschrieben	tradition is really important
2	der Brauch (¨e), die Sitte (n)	custom
2	Frohe Weihnachten	Happy Christmas
3	Weihnachten	Christmas
3	zu Weihnachten	at Christmas
3	Ostern	Easter
3	zu Ostern	at Easter
3	der Karneval	carnival in the middle
3	der Karnevalszug, -züge	carnival procession
4	das Silvester	New Year's Eve
4	der Feiertag(e)	public holiday
4	die Kirchenglocke	church bell
4	die Kirchenglocken läuten	the church-bells ring
4	in die Kirche gehen	to go to church
4	sie haben religiöse Grundlagen	they have religious origin
5	das Geschenk(e)	present, gift
5	die Bedeutung(en)	significance, importance
5	der Weihnachtsmarkt	Christmas market
5	erschrecken	to frighten
5	prägen	to influence, characterise
5	benachteiligt	disadvantaged
6	bundesweit	nationwide, across the whole of Germany
6	Gewinn erzielen	to make a profit
6	gelten als	to be considered to be
6	vorbei sein	to be over, past
6	anzünden	to light
6	aufwachen	to wake up
7	aufwecken	to wake someone up
7	ausschenken	to pour, serve
7	backen	to bake
7	bedeuten	to mean
7	beten	to pray
7	entstehen	to arise, originate from
8	erzeugen	to produce
8	herstellen	to produce, manufacture
8	herumalbern	to fool around
8	locken	to tempt
8	läuten	to sound, ring
8	saufen	to drink (heavily)
9	schmücken	to decorate
9	schätzen	to value, treasure, appreciate
9	stärken	to reinforce, strengthen, boost
9	unterstützen	to support
9	veranstalten	to put on (event)
9	verhüllen	to mask, to cover
10	verschwenden	to waste
10	verteilen	to hand out
10	verzeihen	to forgive
10	zuschauen	to look on, watch
10	"Prosit Neujahr!"	"Here's to the New Year"
10	Guten Rutsch	Good slide, "Smooth start into the new year"
11	abergläubisch	superstitious
11	an Neujahr	at New Year
11	beharrlich	unchanging
11	christlich	Christian (adj)
11	das Neujahr	New Year's Day
11	das Richtfest	topping-out party (new buildings)
12	der Karfreitag	Good Friday
12	der Obdachlose(n)	homeless person
12	der Vorsatz	resolution
12	die Heimat	home town, region, country
12	die Silvesterparty	New Year's Eve party
12	die Ware	product (goods, merchandise)
13	erheblich	considerable
13	evangelisch	Protestant (adj)
13	fröhlich	merry
13	gemütlich	snug, cosy
13	heidnisch	pagan
13	in Norddeutschland	in the north of Germany
14	in Süddeutschland	in the south of Germany
14	katholisch	Catholic (adj)
14	kauflustig	in a spending mood
14	lebendig	alive, lively, livid
14	lustig	funny, merry
14	ursprünglich	original (adj)
15	vorchristlich	pre-Christian
15	weihnachtlich	Christmassy
15	wesentlich	essential
15	wirtschaftlich	economic
15	Aschermittwoch	Ash Wednesday
15	Feiertage	bank holidays
16	albern	silly, ridiculous
16	alte Bräuche pflegen	to maintain old traditions
16	auf den Weihnachtsmarkt gehen	to go to the Christmas market
16	aufgeregt sein über (Akk)	to be excited about
16	ausgelassen	lively, boisterous
16	böse	evil (adj)
17	das neue Jahr begrüßen	to so see in the New Year
17	eine Büttenrede halten	to make a carnival speech
17	eine Rede halten	to make a speech
17	glauben an (Akk)	to believe in
17	gute Geschäfte machen	to do good trade sales
17	jemandem Angst machen	to frighten someone
18	jemandem etwas schenken	to give someone something (as present)
18	karitativ	charitable
18	kommerzialisiert	commercialised
18	landesweit	in a particular federal state, across a Bundesland
18	neue Freundschaften schließen	to make new friends
18	sich ableiten von (Dat)	to be derived from
19	sich ändern, verändern	to change
19	tosend	thunderous (noise)
19	vertraut	familiar
19	verzichten auf (Akk)	to go without, to give up
19	viel Lärm machen	to make a huge racket
19	Dampf ablassen	to let off steam
20	Geschenke auspacken	to unwrap presents
20	Traditionen pflegen	to maintain traditions
20	aufmachen, öffnen	to open
20	aussterben (i-a-o)	to die out
20	betragen (ä-u-a)	to amount to (money)
20	bieten (ie-o-o)	to offer, give
21	einladen (ä-u-a)	to invite
21	essen (i-a-e)	to eat
21	gedenken (GEN)	to remember, commemorate
21	sich anziehen	to dress
21	sich betrinken	to get drunk
21	sich verkleiden	to disguise, wear fancy dress
22	verscheuchen, abschrecken	to scare away
22	verschmelzen (i-o-o)	to merge, fuse, blend
22	vertreiben (ei-ie-ie)	to drive out, away
22	widmen (DAT)	to dedicate to
22	ziehen (ie-o-o)	to march, move, process
22	Überflüssiges kaufen	to buy stuff that's not needed
23	das Zeichen (-)	sign, badge
23	der Anlass, Anlässe	cause, reason
23	der Einfluss, Einflüsse	influence
23	der Rosch ha-Schana	Jewish New Year
23	der Schützenkönig	champion marksman
23	ein glückliches neues Jahr	Happy New Year
24	im Norden Deutschlands	in northern Germany
24	im Süden Deutschlands	in southern Germany
24	in ganz Deutschland	all over Germany
24	Blei gießen	telling fortunes (by shapes formed by molten metal dropped into water)
24	am Heiligabend	on Christmas Eve
24	bei Sonnenaufgang	as the sun rises
25	bunt geschmückt	colourfully decorated
25	bunte Lampions	colourful lights
25	bunte Lichter	fairy lights
25	das Abendmahl	communion, eucharist
25	das Ambiente	ambience, atmosphere
25	das Angebot(e)	supply, offer
26	das Bundesland	federal state
26	das Böse	evil
26	das Christentum	Christianity
26	das Christkind	the Christ-child
26	das Dirndl	woman's traditional dress
26	das Dreikönigsfest	Epiphany (6 Jan)
27	das Ende	end
27	das Erntedankfest	harvest festival
27	das Feuerwerk	fireworks
27	das Gebet(e)	prayer
27	das Gedränge	crowd, crush
27	das Geräusch	sound, noise
28	das Gewerbe(-)	(a) trade
28	das Glockengeläut	the ringing of bells
28	das Kostüm	costume
28	das Kostüm(e)	fancy dress
28	das Kreuz	cross
28	das Kulturerbe	cultural heritage
29	das Merkmal(e)	characteristic, feature
29	das Osterei	Easter egg
29	das Passionsspiel(e)	Passion Play
29	das Pessach	Passover
29	das Pfingsten	Whitsun, Pentecost
29	das Rezept(e)	recipe
30	das Ritual(e)	ritual
30	das Schaltjahr	leap year
30	das Schaltjahr(e)	leap yar
30	das Schaufenster	shop window
30	das Schokoladenei	chocolate egg
30	das Schützenfest	fair with marksmen's competition
31	das Sonderangebot(e)	special offer
31	das Trachtenfest	festival where traditional costume is worn
31	das Vieh	cattle
31	das Volksfest	public festival, funfair
31	das Volksfest(e)	festival fair
31	das Weihnachtsgebäck	Christmas biscuits
32	das Weihnachtslied	Christmas carol
32	das Weinfest(e)	wine festival
32	das Wesentliche	the essential thing
32	der Aberglaube	superstition
32	der Anfang	start
32	der Ball	ball, party
33	der Bauer	farmer
33	der Besen	broom
33	der Bestandteil(e)	part
33	der Brunnen(-)	fountain
33	der Bräutigam(e)	bridegroom
33	der Bürgermeister	mayor
34	der Christstollen	Christmas cake
34	der Fasching	carnival in the south
34	der Fastenmonat(e)	month of fasting
34	der Fastnachtdienstag	Shrove Tuesday
34	der Festwagen	carnival float
34	der Fronleichnam	Corpus Christi (in Catholic areas)
35	der Frühling	spring
35	der Gaukler	travelling entertainer
35	der Geist(er)	spirit
35	der Geldbeutel(-)	purse, wallet
35	der Gemeinschaftssinn	sense of community, community spirit
35	der Glühwein	mulled wine
36	der Gründonnerstag	Maundy Thursday
36	der Heiligabend	Christmas Eve
36	der Hersteller(-)	producer
36	der Hintergrund	background
36	der Händler(-)	shop-keeper, dealer
36	der Höhepunkt(e)	climax
37	der Imbissstand	food stall
37	der Kitsch	kitsch
37	der Koran	Koran
37	der Krach	din, racket
37	der König(e)	king
37	der Lammbraten	roast lamb
38	der Lebkuchen	soft spicy biscuit
38	der Lärm	(loud) noise, racket
38	der Materialismus	materialism
38	der Narr(en)	fool, jester
38	der Nikolaustag	St Nicholas' Day
38	der Osterhase	Easter bunny
39	der Ostersonntag	Easter Sunday
39	der Partylöwe(n)	party animal
39	der Polterabend(e)	pre-wedding party
39	der Ramadan	Ramadan
39	der Rosenmontag	Carnival Monday
39	der Sekt	champagne, sparkling wine
40	der Spaß	fun
40	der Straßenmusikant(en)	street musician
40	der Streich(e)	practical joke
40	der Tannenbaum	fir-tree
40	der Unternehmer(-)	entrepreneur, employer, business man
40	der Volkstrauertag(e)	Remembrance Sunday (2 Sundays before Advent)
41	der Vorabend	the evening before
41	der Weihnachtsbaum	Christmas tree
41	der Weihnachtsmann	Father Christmas (6 Dec)
41	der Wunschzettel(-)	wish list
41	die Adventszeit	Advent
41	die Bescherung	giving of presents
42	die Birke(n)	birch-tree
42	die Bäuerin	female farmer
42	die Dekorationen	decorations
42	die Ernte	harvest
42	die Eröffnungsfeier	opening ceremony
42	die Fastenzeit	Lent / time of fasting
43	die Fastnacht	carnival in the north
43	die Feuerzangenbowle	red wine punch with rum
43	die Fruchtbarkeit	fertility
43	die Fröhlichkeit	merriness
43	die Gaststätte(n)	restaurant, pub
43	die Gaststättengewerbe	catering trade
44	die Geburt(en)	birth
44	die Gemeinde(n)	community, local authority
44	die Geselligkeit	sociability
44	die Glaskugel(n)	glass tree bauble
44	die Grundlage(n)	basis, origin
44	die Hexe(n)	witch
45	die Hochzeit(en)	wedding
45	die Jahreszeit(en)	season
45	die Kauflust	desire to buy
45	die Kerze(n)	candle
45	die Kreuzigung	crucifixion
45	die Krippe	crib (for nativity)
46	die Kuhglocke(n)	cow-bell
46	die Königin(en)	queen
46	die Luftschlange(n)	streamer
46	die Mandel(n)	almond
46	die Marone(n)	chestnut
46	die Maske(n)	mask
47	die Moschee(n)	mosque
47	die Nachfrage	demand (economical)
47	die Pralinen	chocolates
47	die Religion(en)	religion
47	die Schokolade	chocolate
47	die Sonnenwende	solstice
48	die Sternschnuppe	shooting star
48	die Sternsinger	carol singer, (6 Jan)
48	die Synagoge(en)	synagogue
48	die Süßigkeit(en)	sweet
48	die Tracht	traditional costume
48	die Tracht(en)	folk costume
49	die Verlässlichkeit	dependability
49	die Verwandten	relatives
49	die Verwurzelung	rootedness
49	die Vorbereitung(en)	preparation
49	die Weiberfastnacht	woman's carnival day
49	die Weihnachtskarte	Christmas card
50	die Wintersonnenwende	winter solstice
50	die Wurzel(n)	root
50	die Übernachtung(en)	overnight stay
50	existiert seit	has existed for/since
50	gebrannte Mandeln	roasted almonds
50	gehören dazu	are part of it
51	im Schlussverkauf	in the sales
51	in Partylaune	in a party mood
51	lebendiges Brauchtum	living tradition
51	selbst gemacht	home-made
51	um Mitternacht	at midnight
52	an der Straße stehen	to stand on the road side
52	der Versuchung widerstehen	to resist temptation
52	die Kerzen anzünden	to light the candles
52	die Rollen tauschen	to swap roles
52	die Zukunft voraussagen	to predict the future
53	die bösen Geister vertreiben	to drive away evil spirits
53	durch die Straßen ziehen	to march along the streets
53	ein Feuerwerk abbrennen	to let off fireworks
53	ein Freudenfeuer entzünden	to light a bonfire
53	einen Maibaum aufstellen	to erect a maypole
54	einen Schneemann bauen	to build a snowman
54	in die Zukunft schauen/blicken	to look into the future
54	saufen, soff, gesoffen	to drink, booze
54	sich die Hand reichen	to join hands
54	sich etwas wünschen (DAT)	to wish for something
55	sich freuen auf (Akk)	to look forward to
55	sich streiten mit	to argue with
55	stammen aus (Dat)	to originate in, stem from
55	wie ein Loch saufen	to drink like a fish
55	zu viel Geld ausgeben	to spend too much money
56	"Jesus ist auferstanden"	"Christ is risen"
56	"Prost! Zum Wohl!"	"Cheers! To your health"
56	Bräuche und Sitten	customs and traditions
56	Friede auf Erden	Peace on earth
56	Karneval, Fastnacht, Fasching	Carnival
57	auf der ganzen Welt	all over the world
57	bei Einbruch der Dunkelheit	as night falls
57	das Band, die Bänder	ribbon
57	das Brauchtum (¨er)	customs
57	das Einkaufen im Internet	online shopping
58	das Einkommen (-)	income
58	das Plätzchen (-)	biscuit
58	das Wahrzeichen, das Symbol	symbol
58	das Zuckerfest, Eid	end of Ramadan
58	das närrische Treiben	carnival celebrations
59	der Adventskalender (-)	advent calendar
59	der Adventskranz (¨e)	advent wreath
59	der Auftrag, Aufträge	commission, order
59	der Beitrag, Beiträge	contribution
59	der Brand, die Bränder	fire
60	der Engel (-)	angel
60	der Gast, Gäste	guest
60	der Gläubige (n)	believer
60	der Jahrestag (e)	anniversary
60	der Kampf, Kämpfe	fight, battle
61	der Klang, Klänge	(musical) sound
61	der Maßkrug, die Maß	beer stein (litre)
61	der Sinn für Humor	sense of humour
61	der Teilnehmer, (-)	participant
61	der Teufel (-)	devil
62	der Tod (e)	death
62	der Umsatz, Umsätze	turnover
62	der Umzug, Umzüge	procession
62	der erste Weihnachtstag	Christmas Day
62	der gesetzliche Feiertag(e)	national holiday
63	der zweite Weihnachtstag	Boxing Day (26 Dez)
63	die Auferstehung Christi	resurrection of Christ
63	die Braut, Bräute	bride
63	die Einladung (en)	invitation
63	die Gans, Gänse	goose
64	die Kirmes (sen)	fun-fair
64	die Messe, der Gottesdienst	church service
64	die Osterglocke, Narzisse	daffodil
64	durch etwas geprägt sein	characterised by something
64	ein Symbol für	a symbol of
65	eine besinnliche Zeit	a quiet, thoughtful time
65	es geht um (Akk)	it's about
65	in der Nacht	at night, during the night
65	man wünscht sich Glück	we wish one another happiness and luck
65	stolz auf (Akk)	proud of
66	typisch für (Akk)	typical of
66	verliert an Bedeutung	is declining in significance
66	von alters her	since time immemorial
66	über Jahrhunderte hinweg	through the centuries
66	ein guter Vorsatz für das neue Jahr	New Year's resolution
67	in Geschenkpapier einwickeln, packen	to gift-wrap
67	sie geben den Menschen Halt	they give support to people
67	das Zugehörigkeitsgefühl, die Zugehörigkeit	sense of belonging
67	die Heckenwirtschaft, Besenwirtschaft, Straußwirtschaft	seasonal pub by wine growers (marked by broom or bunches of flowers)
67	im Kaufrausch sein, kaufsüchtig sein	to be a shopaholic
68	tief in den Geldbeutel greifen	to dig deep (financially)
68	zu einem Ritual werden, Tradition werden	to become a tradition
68	das Bedürfnis (se), der Bedarf	need
68	das gilt als typisch deutsch	that's seen as typically German
68	der Tag der deutschen Einheit	German Unity Day (3 Oct)
69	die Veranstaltung(en), das Ereignis(se)	event
69	die emotionale Bindung an (Akk)	emotional connection with
69	man liest aus der Bibel vor	we read from the Bible
69	man stößt auf … an	we raise a glass to
69	sie vermitteln ein Gefühl von	they give a feeling of
70	und wie man sie feiert	and how they are celebrated
70	wir legen viel Wert auf	we set a lot of store by
70	der Verkaufsstand, der Stand, die Marktbude (n)	market stall
70	die Ursprünge liegen im Dunkel der Vergangenheit	the origins are lost in the mists of time
70	ich hatte ein bisschen zu viel des Guten	I ate and drank a bit too much
70	die Realityshow (s), die Containershow (s)	reality Tvshow
`;

const topic7Raw = `
1	die Einwanderung, die Zuwanderung	immigration
1	der Einwanderer (-)	immigrant
1	die Wirtschaft	economy
2	die Wirtschaft ist auf Fachkräfte aus dem Ausland angewiesen	the economy is reliant on skilled workers from abroad
2	die Kultur des Landes bereichern	to enrich the culture of the country
2	die Kulturlandschaft ist vielfältiger geworden	the cultural landscape has become more varied
3	die kulturelle Vielfalt / Diversität	cultural diversity
3	vielfalt	diverse
4	die Arbeitskraft (¨e)	worker, employee
4	die Sprachenvielfalt	varietey of languages
5	der Gastarbeiter (-)	foreign worker (60s and 70s, term no longer used)
5	alltäglich werden	to become part of everyday life
6	sich anfreunden	to become friends
6	abbauen	to break down, reduce, cut back
7	auswandern	to emigrate
7	bevorzugen	to prefer
8	diversifizieren	to diversify
8	lösen	to solve
9	widerspiegeln	to reflect
9	allmählich	gradual(ly)
10	die Überalterung	disproportionate number of old people
10	eine Parallelgesellschaft	a parallel society
11	fremdsprachig	foreign language (adj)
11	hochwertig	high-quality, high-grade
12	unauffällig	unobtrusive
12	vertrauensvoll	trusting
13	zweisprachig	bilingual
13	einen Beitrag leisten	to make a contribution
14	gefragt	in demand
14	gewohnt	accustomed
15	integrationsfördernd	encouraging integration
15	mangeln an (Dat)	to lack, to be short of
16	selbstbewusst	self-confident
16	tolerant	tolerant
17	weltumfassend	global, world-wide
17	auffallen (ä-ie-a)	to attract attention, be noticeable, stand out, be conspicious
18	ausländisch essen	to eat foreign food
18	eintreffen (i-a-o)	to arrive
19	erwerben (i-a-o)	to acquire
19	sich anpassen	to adapt, to conform
20	sich bemühen	to try hard, to strive
20	sich eingewöhnen	to settle down, to acclimatize
21	verbinden (i-a-u)	to unite, connect
21	Jugendliche nichtdeutscher Herkunft	young people from a non-German background
22	berufstätig, erwerbstätig	employed, in work
22	der Nachteil  (e)	disadvantage
23	der Vorteil  (e)	advantage
23	die jüngere Generation	the younger generation
24	ungeachtet ethnischer Grenzen	regardless of ethnic boundaries
24	zugutekommen (o-a-o) (Dat)	to be of benefit to
25	EU-Bürger (-)	EU citizens
25	das Erwerbseinkommen	income from employment
26	das Kulturleben	cultural life
26	das Rentenalter	retirement age
27	das Vertrauen	trust
27	der Arbeitskräftebedarf	the need for workers
28	der Fachkräftemangel	shortage of qualified personnel
28	der Geburtenrückgang	declining birth rate
29	der Straßenjargon	street slang
29	die Anzahl	number (approximate)
30	die Auswanderung	emigration
30	die Berufsausbildung	job training
31	die Bevölkerung	population
31	die EU-Freizügigkeit	freedom of movement in the EU
32	die Gastronomielandschaft	the gastronomic scene
32	die Gesundheitsfürsorge	health care
33	die Globalisierung	globalisation
33	die Leitkultur	main, dominant culture
34	die Personalbeschaffung	staff recruitment
34	die Pflege	care (=looking after)
35	die Populärkultur	popular culture
35	die Selbstwahrnehmung	self-perception
36	die Toleranz	tolerance
36	die Unterstützung	support
37	die Vielzahl	multitude, huge number
37	multikulturell, multikulti	multicultural
38	fliehen, flüchten vor (DAT)	to flee from
38	sich glücklich schätzen	to consider oneself lucky
39	sich integrieren, eingliedern	to integrate
39	vertrauen (Dat) an	to trust to
40	Deutsche mit Migrationshintergrund	Germans from migrant backgrounds
40	Kultur trennt und verbindet	culture both divides and connects
41	das Asylantenheim (e)	accommodation for asylum seekers
41	das Bildungsniveau (s)	level of education
42	das Kulturgut (¨er)	cultural asset
42	das Lehnwort (¨er)	loan aord
43	das Unternehmen (-)	firm, business, company
43	der Arbeitsplatz (¨e)	job
44	der Arbeitsvertrag (¨e)	employment contract
44	der Asylant (en)	asylum seeker
45	der Asylbewerber (-)	applicant for asylum, asylum seeker
45	der Bürgerkrieg (e)	civil war
46	der Durchschnittbürger (-)	average citizen
46	der Einheimische (n)	local person, native
47	der Einwohner (-)	inhabitant
47	der Flüchtling  (e)	refugee
48	der Fremde (n)	foreigner, stranger
48	der Haushalt (e)	budget
49	der Hochschulabschluss (¨e)	(university) degree
49	der Höhepunkt (e)	highlight
50	der Mangel an (Dat)	lack of, shortage of
50	der Mindestlohn (¨e)	minimum wage
51	der Sprachkurs (e)	language course
51	der Unternehmer (-)	entrepreneur, business man
52	der Wendepunkt (e)	turning point
52	der Wirtschaftswissenschaftler (-)	economist
53	der Zugang (¨e)	access
53	der demografische Wandel	demographic change
54	die Altersgruppe (n)	age group
54	die Anwerbung (en)	recruitment
55	die Beschäftigung (en)	employment
55	die Branche (n)	(area of) industry, business
56	die Deutschkenntnisse (pl)	knowledge of German
56	die Einstellung (en)	attitude
57	die Fachkraft (¨e)	qualified worker
57	die Fähigkeit (en)	skill, ability
58	die Gemeinschaft (en)	community
58	die Glaubensrichtung (en)	religion, belief system
59	die Mehrheit (en)	majority
59	die Minderheit (en)	minority
60	die Mischsprache (n)	hybrid language
60	die Teilnahme (n)	participation
61	die Unterkunft (¨e)	accommodation, lodging
61	die Ursache (n)	cause
62	die meisten Deutschen	most germans
62	den Bedarf an Fachkräften decken	to meet the demand for skilled personnel
63	die Essgewohnheiten, die Ernährungsgewohnheiten	eating habits
63	die Konkurrenzfähigkeit, die Wettbewerbsfähigkeit	competitiveness
64	Arbeit macht das Leben süß	hard work never hurt anyone
64	das Angebot an ausländischen Produkten nimmt zu	there is an increasing range of foreign products available
65	das Paradebeispiel (e), das Musterbeispiel	prime example
65	die Alltagskultur der Mehrheit hat sich nachhaltig gewandelt	the everyday culture of the majority has changed for good
66	die rapide Alterung der Gesellschaft	a society that is aging rapidly
66	in weiten Kreisen der Bevölkerung	in wide sections of the population
67	sie haben alle Chancen auf Erfolg	they have every chance of success
67	sie spiegeln die heutige Gesellschaft wider	they reflect today's society
68	sie verschmelzen die neue und alte Kultur	they blend old and new culture
68	sich niederlassen (ä-ie-a), sich einleben	to settle down
69	der Bürger (-), der Staatsbürger (-)	citizen
69	der Ursprung (¨e), die Herkunft (¨e)	origin
70	die Arbeitsgenehmigung (en), die Arbeitserlaubnis (se)	work permit
70	die Beziehung (en), das Verhältnis (se)	relationship
`;

function parseTopic(raw, topicId) {
  const lines = raw.trim().split('\n');
  const words = [];
  lines.forEach((line, index) => {
    const parts = line.split('\t');
    if (parts.length >= 3) {
      const day = parseInt(parts[0].trim(), 10);
      const german = parts[1].trim();
      const english = parts[2].trim();
      words.push({
        id: "t" + topicId + "_" + day + "_" + index,
        topicId: topicId,
        day: day,
        german: german,
        english: english
      });
    }
  });
  return words;
}

const topic5Words = parseTopic(topic5Raw, "5");
const topic6Words = parseTopic(topic6Raw, "6");
const topic7Words = parseTopic(topic7Raw, "7");

fs.writeFileSync('src/data/topic5.ts', "import { Word } from './vocabulary';\n\nexport const topic5Vocab: Word[] = " + JSON.stringify(topic5Words, null, 2) + ";\n");
fs.writeFileSync('src/data/topic6.ts', "import { Word } from './vocabulary';\n\nexport const topic6Vocab: Word[] = " + JSON.stringify(topic6Words, null, 2) + ";\n");
fs.writeFileSync('src/data/topic7.ts', "import { Word } from './vocabulary';\n\nexport const topic7Vocab: Word[] = " + JSON.stringify(topic7Words, null, 2) + ";\n");

console.log('Generated topic5.ts, topic6.ts, topic7.ts');
