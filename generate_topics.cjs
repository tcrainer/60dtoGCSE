const fs = require('fs');

const topic3Raw = `
1	Die Arbeitsbedingungen	Working conditions
1	die Arbeitsbeziehungen	industrial relations
1	die Arbeitskräfte (pl), die Belegschaft	workforce,employees
1	die Arbeitslosenhilfe, das Arbeitslosengeld	unemployment benefit
1	die Arbeitslosenzahlen	unemployment figures
1	die Arbeitslosigkeit	unemployment
2	die Arbeitsmarktlage	state of the job market
2	die Arbeitsplatzteilung, das Jobsharing	job sharing
2	die Arbeitsschutzvorschriften	health and safety regulations
2	die Arbeitsstreitigkeit	work dispute
2	der Beruf (e)	occupation, profession
2	der Berufsberater (-)	careers adviser
3	am Fließband arbeiten	to work on the assembly line
3	arbeiten bei	to work for
3	außerhalb der normalen Arbeitszeiten arbeiten	to work unsocial hours
3	schwarzarbeiten	to work illegally, without a permit
3	selbstständig arbeiten	to be self-employed
3	sich hocharbeiten	to work one's way up
4	von zu Hause arbeiten	working from home
4	der Arbeitgeber (-)	employer (of company)
4	Der Arbeitnehmer	The employee
4	der Angestellte (n), der Arbeitnehmer (-)	employee
4	die Stellenbeschreibung (en)	job description
4	die Stellenvermittlung (en)	employment agency
5	man hat mir die Stelle angeboten	they offered me the job
5	Maßnahmen zum Abbau der Arbeitslosigkeit	measures to reduce unemployment
5	arbeitslos, erwerbslos	unemployed
5	die Langzeitarbeitslosigkeit	long-term unemployment
5	eine Arbeitslosenquote von 5 %	an unemployment rate of 5%
5	sich arbeitslos melden	to register as unemployed
6	verdienen	to earn
6	das Gehalt (¨er)	salary
6	die Bewerbung	the application
6	das Vorstellungsgespräch	The interview
6	Die Firma	The company
6	die Firma	firm, company
7	die Firma wurde 1950 gegründet	the firm was founded in 1950
7	das Geschäft, die Gesellschaft, das Unternehmen	firm, company
7	der Lohnstopp	pay freeze
7	der Mindestlohn	minimum wage
7	Die Gleichstellung	Equal opportunities
7	die Gewerkschaft (en)	trade union
8	das Homeoffice	working from home
8	die Work-Life-Balance	work-life balance
8	der Fachkräftemangel	skilled worker shortage
8	die Inflation	inflation
8	die Lebenshaltungskosten (pl)	cost of living
8	die Lohntarife kündigen	to terminate the wage rates
9	anstellen, einstellen, beschäftigen	to employ
9	sich bewerben um (i-a-o)  (AKK)	to apply for
9	sich bewerben um eine Stelle als ... (i-a-o)	to apply for a job as...
9	die Ausbildung, die Lehre (n)	training, apprenticeship
9	der Arbeitsplatzabbau	job cuts
9	übernehmen	to take over
10	Gegenmaßnahmen ergreifen	to take counter-measures
10	Testverfahren einsetzen	to use tests
10	herstellen, erzeugen	to make, produce, manufacture
10	wild streiken	to go on unofficial strike
10	besitzen	to own
10	finanzieren	to finance
11	investieren	to invest
11	mieten	to rent
11	pendeln	to commute
11	rausfliegen	to get the sack
11	schließen	to close down
11	schulden	to owe
12	stilllegen	to close down (factory)
12	streiken	to strike
12	Neue Arbeitsplätze	New jobs
12	berufstätig	employed, having a job
12	das Angebot	goods on offer, produced
12	der Mittelstand	Germany's medium-sized companies
13	fleißig	hard working
13	freiberuflich	self-employed, freelance
13	fristlos	without notice
13	gute Umgangsformen	good manners
13	konkurrenzfähig	competitive
13	rückläufig	in decline
14	Bankrott machen, pleitegehen	to go bankrupt
14	Konflikte	Disputes
14	Verantwortung tragen (a-u-a)	to take responsibility
14	beruflich erfolgreich sein	to be successful in one's career
14	beschäftigt	busy (a lot to do)
14	die Automatisierung	automation
15	die Vier-Tage-Woche	four-day working week
15	eine gute Work-Life-Balance haben	to have a good work-life balance
15	einen guten Eindruck machen	to make a good impression
15	flexibel	adaptable, flexible
15	gepflegt	well-groomed
15	im Aufsichtsrat sitzen (irreg)	to be on the board of directors
16	im Geschäft sein	to be in business
16	in einer Krankenkasse sein	to have health insurance
16	jemandem als Referenz dienen	to be a referee for s.o.
16	leistungsorientiert	performance-oriented
16	rentabel	profitable
16	seine EDV-Kenntnisse nutzen	to use one's knowledge of computers
17	sich selbstständig machen	to go into business
17	unterqualifiziert	underqualified
17	vorrätig haben / sein	to have / be in stock
17	über seine Verhältnisse  leben	to live beyond one's means
17	überqualifiziert	overqualified
17	Arbeitskräfte einsparen	to cut back on jobs
18	Produktionsprozesse automatisieren	to automate production
18	ausgeben (i-a-e)	to spend (money)
18	bar bezahlen	to pay cash
18	befördert werden	to gain promotion
18	entlassen, feuern	to sack, dismiss
18	etwas beilegen	to enclose sth. (with a letter)
19	importieren, exportieren	to import, to export
19	sich beschweren	to complain
19	sparen für	to save for
19	Überstunden machen	to do overtime
19	Deutschkenntnisse erforderlich	knowledge of German required
19	belebt, geschäftig	busy, bustling
20	das Recht (e)	right
20	das erfordert Ihre Eigeninitiative	you have to use your own initiative
20	der Einsatz neuer Techniken	the introduction of new technologies
20	der steigende Leistungsdruck	increasing pressure to achieve
20	die Ware (n)	goods
20	die neuen Technologien	new technologies
21	er hat Geldsorgen	he's got money problems
21	gute Kenntnisse in ...	a good knowledge of...
21	Die Geschäftsorganisation	Business organisation
21	am Arbeitsplatz	at work, in the office
21	das Außenhandelsdefizit	trade gap deficit
21	das Bankwesen	banking
22	das Bargeld	cash
22	das Baugewerbe	construction industry
22	das Berufspraktikum	work experience
22	das Bruttoeinkommen	gross income
22	das Fachwissen	specialised knowledge
22	das Hotelgewerbe	hotel trade
23	das Kindergeld	child benefit
23	das Konto	account
23	das Mobbing	bullying / harassment
23	das Nettoeinkommen	net income
23	das Onlinebanking	online banking
23	das Personal	personnel, staff
24	das Weihnachtsgeld	Christmas bonus
24	der  Unternehmer	entrepreneur, businessman
24	der Abzug	deduction (from wage, salary)
24	der Arbeitskampf	industrial action
24	der Arbeitskräftemangel	labour shortage
24	der Aufschwung	upturn (economic)
25	der Aufsichtsrat	board
25	der Elternurlaub	paternity/ maternity leave
25	der Feierabend	closing time (and the time after it)
25	der Fleiß	hard work, diligence
25	der Geschäftssinn	business sense, acumen
25	der Jahresumsatz	annual turnover
26	der Kapitalismus	capitalism
26	der Kündigungsschutz	protection against (wrongful) dismissal
26	der Lebensstandard	standard of living
26	der Manager(-)	manager
26	der Personalschwund	natural wastage
26	der Protektionismus	protectionism
27	der Rationalisierungsschub	the drive to rationalise (working practices)
27	die  Arbeitsbelastung	workload
27	die  Ganztagsarbeit	full-time work
27	die Abwertung	devaluation
27	die Armut	poverty
27	die Ausgaben	outgoings
28	die Beförderung	promotion
28	die Berufsberatung	careers advice
28	die Berufserfahrung	experience (professional)
28	die Berufswahl	choice of career
28	die Dienstleistungsbranche	service industry
28	die Dunkelziffer	estimated number of unreported cases
29	die Einheitswährung	single currency
29	die Frauenquote	proportion of jobs set for women
29	die Gelegenheitsarbeit	casual work
29	die Geschäftszeiten	business hours
29	die Gleitzeit	flexible working hours, flexitime
29	die Handelsbilanz	balance of trade
30	die Handelsziffern	trade figures
30	die Kaufkraft	purchasing power
30	die Konkurrenz	competition
30	die Konkurrenzfähigkeit	competitiveness
30	die Kurzarbeit	short-time working
30	die Lohngleichheit	equality of pay
31	die Lohnkosten	wage costs
31	die Marktkräfte	market forces
31	die Massenproduktion	mass production
31	die Probezeit	probationary period
31	die Rentabilität	profitability
31	die Schichtarbeit	shift work
32	die Selbstachtung	self-respect, self-esteem
32	die Spesen	business expenses
32	die Tarifverhandlungen	pay negotiations, collective bargaining
32	die Teilzeit	part time
32	die Teilzeitarbeit	part-time work
32	die Transportkosten	transport costs
33	die Umschulung	retraining
33	die Unterlagen	documents, papers
33	die Urlaubsverlängerung	lengthening the holiday
33	die Versicherung	insurance
33	die Wartung	maintenance, servicing
33	die Zahlungsbilanz	balance of payments
34	die Zeitarbeit	temporary work
34	eine 35-Stunden-Woche	a 35-hour working week
34	freie Arbeitsplätze	vacancies
34	gut bezahlt	well paid
34	hoch qualifiziert	well qualified
34	im Pensionsalter	of retirement age
35	innerbetriebliche Ausbildung	on-the-job training
35	persönliche Daten	personal details
35	sehr motiviert	well motivated
35	zahlungsunfähig, insolvent	insolvent
35	bestimmte Arbeitsplatze überflüssig machen	to make certain jobs superfluous
35	den Gürtel enger schnallen	to tighten one's belt
36	dezente Kleidung tragen (a-u-a)	to dress well
36	die Geheimzahl eingeben (i-a-e)	to tap in one's PIN
36	durch Erfahrung lernen	to learn by experience
36	ein Formular ausfüllen	to fill in a form
36	eine Frist einhalten	to keep to a deadline
36	eine Rechnung bezahlen	to settle a bill
37	eine Stelle suchen	to look for a job
37	einen Konflikt lösen	to  resolve a conflict
37	einen Vertrag unterschreiben	to sign a contract
37	in Rente gehen	to retire
37	jemandem eine Absage erteilen	to turn s.o. down
37	jemanden um Rat bitten	to ask s.o. for advice
38	seine Spitzenposition behaupten	to maintain its leading position
38	seinen Verhältnissen entsprechend leben	to live within one's means
38	ein Roboter funktioniert reibungslos	a robot works without any problems
38	heute war viel los	it was a busy day today
38	im Sprachen-/ Finanzbereich	in the field of languages/ finance
38	50 000 Euro Schulden haben	to be €50,000 in debt
39	Angebot und Nachfrage	supply and demand
39	Arbeitsplätze gingen verloren	jobs were lost
39	Der internationale Handel	International trade
39	Deutsche Unternehmen und Industrien	German businesses and industries
39	Einkommen und Haushalt	Income and budget
39	Einnahmen und Ausgaben	income and expenditure
40	Schutzvorschriften für Schwangere	regulations to protect pregnant women
40	auf dem Weg nach oben sein	to be on the way up
40	das Arbeitsamt (¨er)	job centre
40	das Bewerbungsschreiben (-)	letter (of application)
40	das Gewerbe (-)	trade
40	das Lager, das Lagerhaus	warehouse
41	das Stellenangebot (e)	job vacancy
41	das verfügbare Einkommen	disposable income
41	der  Personalleiter  (-)	personnel manager
41	der  Verkaufsleiter  (-)	sales manager
41	der Arbeitstag (e)	working day
41	der Arbeitsvertrag  (¨e)	job contract
42	der Besitzer (-)	owner
42	der Betrieb (e)	business, concern, company, factory
42	der Betriebsleiter (-)	works manager
42	der Betriebsrat (¨e)	works council
42	der Buchhalter (-)	accountant
42	der Börsenmakler (-)	stockbroker
43	der Chef (s)	head, boss
43	der Dienstleistungsbetrieb (e)	service firm
43	der Dienstwagen (-)	company car
43	der Direktor (en)	director
43	der Drückeberger (-)	shirker
43	der Feiertag (e)	day off, holiday
44	der Geschäftsführer (-)	managing director, CEO
44	der Geschäftsmann (¨er)	businessman
44	der Gewerkschafter (-)	trade unionist
44	der Gewinn (e)	profit
44	der Hersteller (-)	manufacturer
44	der Import, der Export	import, export
45	der Kunde, die Kundin	customer
45	der Kurs (e)	exchange rate, share price
45	der Lebenslauf (¨e)	curriculum vitae, CV
45	der Lieferant (en)	supplier
45	der Mitarbeiter (-)	colleague, employee
45	der Pendler (-)	commuter
46	der Rentner (-)	pensioner
46	der Schlichtungsversuch scheiterte	the attempt at arbitration broke down
46	der Staat (en)	state
46	der Streik (s)	strike
46	der Tarifvertrag (¨e)	pay agreement
46	der Techniker (-)	technician
47	der Termin (e)	appointment, deadline
47	der Urlaub (e)	holiday, leave
47	der Verkäufer (-)	salesperson / shop assistant
47	der Verlag (e)	publishing company
47	der Verlust (e)	loss
47	der Vertreter (-)	representative, salesperson
48	der Vorgesetzte (n)	line-manager
48	der Vorstandsvorsitzende (n)	CEO (chief executive officer)
48	der Zahltag (e)	pay day
48	der Zins (en)	interest
48	der Zinssatz (¨e)	interest rate
48	der angelernte Arbeiter (-)	semi-skilled worker
49	der gesetzliche Mindestlohn	statutory minimum wage
49	der multinationale Konzern (e)	multinational company
49	der sichere Arbeitsplatz (¨e)	job security
49	der ständige Konkurrenzkampf	rat race
49	der ungelernte Arbeiter (-)	unskilled worker
49	der Öffentliche Dienst	civil service
50	die Abteilung (-en)	department
50	die Aktie (n)	share
50	die Aktiengesellschaft (en), AG	public limited company, plc
50	die Anforderung (en)	demand, requirement
50	die Annonce (n)	advertisement
50	die Aufgabe (n)	task
51	die Auseinandersetzung (en)	disagreement
51	die Beschwerde (n)	complaint
51	die Branche (n)	area of business, trade, industry
51	die Börse (n)	stock exchange
51	die Dienstleistungsbranche (pl)	service industry
51	die Eigenschaft (en)	(personal) characteristic
52	die Einkommenssteuer (n)	income tax
52	die Fabrik (en)	factory
52	die Finanzkrise (n)	financial crisis
52	die Fotokopie (n)	photocopy
52	die Frustration (en)	frustration
52	die Fusion (en)	merger
53	die Gehaltserhöhung (en)	payrise
53	die Geschäftsfrau (en)	businesswoman
53	die Handelsschranke (n)	trade barrier
53	die Investition (en}	investment
53	die Karriere (n)	career
53	die Kinderkrippe (n)	creche, nursery
54	die Konferenz (en)	meeting, conference
54	die Krankenversicherung (en)	health insurance
54	die Kreditkarte (n)	credit card
54	die Kündigung (en)	notice of dismissal
54	die Lieferung (en)	delivery
54	die Miete (n)	rent
55	die Milliarde (n)	billion(= thousand million)
55	die Pflicht (en)	duty
55	die Produktivität pro Kopf	output per head
55	die Qualifikation (en)	qualifications
55	die Referenz (en)	referee, reference
55	die Rezession (en)	recession
56	die Sorge (n)	worry, concern
56	die Sparte (n)	line of business
56	die Steuer (n)	tax
56	die Steuervergünstigung (en)	tax allowance
56	die Stimmung (en)	atmosphere, mood
56	die Verdienstmöglichkeiten (pl)	earning potential
57	die Wachstumsprognose (n)	growth forecast
57	die Währung (en)	currency
57	die Zentrale (n)	head office
57	die Zufriedenheit am Arbeitsplatz	job satisfaction
57	die Zusage (n)	(firm) job offer
57	die dynamische Rente	index-linked pension
58	die sexuelle Belästigung	sexual harassment
58	die Übernahme (n)	takeover
58	ein begehrter Posten	a much sought-after job
58	eine freie Stelle	vacancy
58	eine harte Währung	a stable currency
58	eine passende Stelle	a suitable job
59	eine schnell wachsende Wirtschaft	a booming economy
59	eine stumpfsinnige Arbeit	boring work/ job
59	eine verantwortungsvolle Stelle	a responsible job
59	ich bin blank	I'm broke
59	ich kann fließend Deutsch	I can speak fluent German
59	in den roten Zahlen stecken	to be in the red
60	neue Arbeitsplätze wurden geschaffen	new jobs were created
60	ohne Abzüge, Brutto	before deductions
60	verantwortlich, zuständig für (Akk)	responsible for
60	von der Hand in den Mund leben	to live from hand to mouth
60	vorzeitig in den Ruhestand gehen	to take early retirement
60	zurück in den Beruf	go back to the careers
61	Arbeitskräfte durch Industrieroboter ersetzen	to replace workers with industrial robots
61	eine Stelle ausschreiben (ei-ie-ie)	to advertise a job
61	einen neutralen Schlichter einbeziehen	to call in an independent arbitrator
61	in finanzielle Schwierigkeiten geraten	to get into financial difficulties
61	jemanden zum Vorstellungsgespräch einladen	to invite s.o. for interview
61	seine Bankgeschäfte  elektronisch erledigen	to do one's banking electronically
62	Frauen sind Benachteiligungen ausgesetzt	women are subjected to discrimination
62	Geschick im Umgang mit Menschen haben	to be good at dealing with people
62	der Anstieg der Lebenshaltungskosten	the rise in living costs
62	der Leiter des Vorstellungsgesprächs	interviewer
62	die Berufsaussichten, die Aufstiegsmöglichkeiten	career prospects
62	die Öffentlichkeitsarbeit, Public Relations	public relations
63	in eine leitende Stellung aufrücken	to reach a top position
63	jemanden als Referenz angeben (i-a-e)	to give s.o. as a referee
63	mit jemandem ein Unternehmen gründen	to go into business with s.o.
63	sich den veränderten Verhältnissen anpassen	to adapt to change
63	sich mit x ... auskennen müssen (DAT)	to have to know about x
63	sich nach der Decke strecken	to cut one's coat according to one's cloth
64	sie leben wie Gott in Frankreich	they live a life of luxury
64	Was sind Sie von Beruf?	What do you do for a living?
64	Wie steht der Kurs momentan?	What's the rate of exchange at the moment?
64	betroffen sind vor allem ...	those most affected are...
64	das Geschäft blüht / geht schlecht	business is booming/ is slack
64	das kann ich mir nicht leisten	I can't afford that
65	der Auftrag, die Bestellung (en)	order
65	die unterschiedliche Entlohnung, die Verdienstunterschiede	pay differentials
65	er ist auf Sozialhilfe angewiesen	he's dependent on state hand-outs t
65	er leitet die Filiale in Dresden	he manages the branch in Dresden
65	gleicher Lohn für gleiche Arbeit	equal pay for equal work
65	mir stehen viele Berufe offen	I have a wide range of career possibilities
66	nach Abzug von Steuern, Netto	after tax
66	sie ist knapp bei Kasse	she's hard up
66	das Foto (s), das Lichtbild (er)	photograph
66	das Geld aus dem Fenster werfen (i-a-o)	to spend money like water
66	der Beamte (-n) (adj. noun), die Beamtin (nen)	civil servant, government employee
66	die Produktion auf computergestützte Fertigung umstellen	to switch production to computerised methods
67	die Produktion ins Ausland verlagern	to transfer production abroad
67	eine Firma direkt anschreiben (ei-ie-ie)	to write to a firm directly
67	mit dem technischen Wandel zurechtkommen	to cope with technological change
67	Geld allein macht nicht glücklich, aber es beruhigt	money alone doesn't make you happy, but it helps
67	das Handelsvolumen hat sich rasch vergrößert	trade has increased rapidly in volume
67	der Anteil von Frauen in führenden Positionen	the proportion of women in top positions
68	der Dollar ist stark gefallen / gestiegen	the value of the dollar has dropped / risen sharply
68	der Mangel an qualifizierten Arbeitskräften	shortage of qualified staff
68	die Erwerbstätigen (adj. noun - pl)	the working population
68	die Kosten des Streiks werden auf ... beziffert	the cost of the strike is estimated at...
68	ein niedriges / mittleres / hohes Einkommen	a low/ medium I high income
69	er hat es aus eigener Kraft zum Millionär gebracht	he's a self made millionaire
69	ihre Produkte sind qualitativ besser	their products are of better quality
69	sein Anteil am gesamten Weltexport beträgt 5%	its share of world exports amounts to 5%
69	sie geraten in finanzielle Schwierigkeiten	hey are getting into financial difficulties
69	sie sind auf deutsches Know-how angewiesen	they rely on German know-how
70	der Kollege (n), die Kollegin (nen)	colleague
70	der Meister(-), die Meisterin (nen)	master craftsman, craftswoman
70	der gelernte Arbeiter (-), der Facharbeiter (-)	skilled worker
70	die Besprechung (en), die Sitzung (en)	meeting, session
70	die Geschäftsstelle (n), die Filiale (n)	branch, office
`;

const topic4Raw = `
1	die Musik sagt Jugendlichen zu	the music appeals to young people
1	die Musikberieselung	constant background music
1	die Musikrichtung (en)	kind of music, genre
1	das Lied (er), der Song (s)	song
2	der Musiker (-)	musician
2	das Konzert (e)	concert
2	das Album, Alben	album
2	der Sänger (-)	singer
3	Klassische Musik	classical music
3	der Einfluss der Musik auf die populäre Kultur	the influence of music on popular culture
3	der Streaming-Dienst (e)	streaming service
3	downloaden, herunterladen	to download
4	der Geschmack	taste
4	Musik hören	to listen to music
4	Musik über YouTube hören	to listen to music on YouTube
4	der Stil (e)	style
5	musizieren	to play a musical instrument
5	toben	to go crazy
5	veralten	to go out of date
5	ausverkauft	sold out
6	Erfolg haben	to be successful
6	Geige spielen	to play the violin
6	Klavier spielen	to play the piano
6	Stil haben	to have style
7	sich entspannen	to relax, to become less tense
7	stattfinden (i-a-u)	to take place
7	aufführen	to perform
7	aufnehmen	to record, take in, include
8	auftreten	to perform, appear
8	begleiten	to accompany, go with, deal with
8	bewundern	to admire
8	chillen	to chill out
9	dirigieren	to conduct
9	erscheinen	to appear
9	herausgeben	to publish
9	klingen	to sound
10	komponieren	to compose
10	mitsingen	to sing along
10	provozieren	to provoke
10	rappen	to rap
11	verkaufen	to sell
11	veröffentlichen	to publish, to release
11	zusammenarbeiten	to collaborate
11	üben	to practise
12	chillig	chilled (mood)
12	der Musikunterricht	music lessons
12	downloadbar	downloadable
12	eintönig	monotonous
13	einzigartig	unique
13	gängig	current, common
13	kitschig	kitschy, corny, trashy
13	kurzlebig	short-lived
14	musikalisch	musical (adjective)
14	oberflächlich	superficial
14	tiefsinnig	profound
14	urheberrechtlich geschützt	in copyright
15	üblich	common, normal
15	Musikaufnahmen	Recorded music
15	aggressiv	aggressive
15	angesagt	fashionable, trendy
16	auf Tournee gehen	to go on tour
16	aus der Mode kommen	to go out of fashion
16	beliebt	popular, much-loved
16	eine treue Fangemeinde haben	to have a loyal fan base
17	in ein Konzert gehen	to go to a concert
17	in einer Band spielen	to play in a band
17	klingeln	ro ring
17	lohnend	rewarding, worthwhile
18	misstönend	discordant
18	mitreißend	exciting, rousing
18	modebewusst	fashion-conscious
18	nach Gehör spielen	to play by ear
19	neue Wege beschreiten	to break new ground
19	richtunggebend	trend-setting
19	zum Nachdenken anregen	to make one think
19	bekannt werden	to get to know
20	falsch singen	to sing out of tune
20	floppen, durchfallen	to flop
20	jemandem nacheifern	to emulate someone
20	mitreißen (AKK)	to carry someone away (emotionally)
21	probieren, einstudieren	to rehearse
21	richtig singen	to sing in tune
21	sich ausdrücken	to express oneself
21	sich durchsetzen	to achieve success, become generally accepted, catch on
22	sich entwickeln	to develop
22	beeinflusst von (DAT)	influenced by
22	das Copyright, das Urheberrecht	copyright
22	die Entwicklung (en)	development
23	aktuelle Trends	current trends
23	berühmt, namhaft	famous
23	das Aussehen	appearance
23	das Gefühl	feeling
24	das Publikum	audience, public
24	das Schlagzeug	percussion, drums
24	der Gruppenzwang	peer pressure
24	der Herdentrieb	herd instinct
25	der Jazz	jazz
25	der Konzertsaal	concert hall
25	der Podcast (s)	podcast
25	der Rapper	rapper
26	der Ruhm	fame
26	der Zuhörer	listener
26	die Begleitung	backing (e.g. vocals)
26	die Beliebtheit	popularity
27	die Blechbläser	brass (section)
27	die Holzbläser	woodwind (section)
27	die Kleidung	clothing
27	die Noten	sheet music
28	die Plattenfirma	record company
28	die Schlagermusik	light music, easy listening
28	die Sprachwahl	choice of language
28	die Streicher	strings (section)
29	die Tantiemen	royalties
29	die Tonqualität	sound quality
29	die Unterhaltung	entertainment
29	digitale Musikdateien	digital music files
30	erfolgreich, gelungen	successful
30	weltbekannt, weltberühmt	world-famous
30	beitragen zu (DAT)	to contribute to
30	die Grenzen verschieben	to push the boundaries
31	eine Zugabe verlangen	to call for an encore
31	einen Streamingdienst abonnieren	to subscribe to a streaming service
31	im Chor singen	to sing in a choir
31	in Mode kommen	to come into fashion
32	in die Charts gelangen	to get into the charts
32	jemanden musikalisch ausbilden	to train someone in music
32	live singen, spielen	to perform live
33	sich ausgegrenzt fühlen	to feel excluded
33	singen über (AKK)	to sing about
33	vom Blatt spielen	to sight-read
34	werben für (AKK)	to promote
34	Musik als Hintergrund	music as a background
34	Wandel und Trends	changes and trends
35	cool, gelassen, locker, entspannt	laid-back, relaxed
35	das Aufnahmestudio (s)	recording studio
35	das Festival (s)	festival (music)
36	das Kammerorchester (-)	chamber orchestra
36	das Mikrofon (e)	microphone
36	das Musical (s)	musical
37	das Musikfestival (s)	music festival
37	das Musikinstrument (e)	musical instrument
37	das Musikstück (e)	piece of music
38	das Musikvideo (s)	music video
38	das Online-Musikgeschäft (e)	online music store
38	das Orchester (-)	orchestra
39	das Streichquartett (e)	string quartet
39	das Vorbild (er)	role-model
39	der Auftritt (e)	performance, gig
40	der Backing-Sänger (-)	backing vocal
40	der Chor, Chöre	choir
40	der Dirigent (en)	conductor)
41	der Fanartikel (-)	merchandise (fans)
41	der Fanklub (s)	fan club
41	der Flügel (-)	grand piano
42	der Gitarrist (en)	guitarist
42	der Kapuzenpullover (-)	hoodie
42	der Klang (¨e)	sound
43	der Komponist (en)	composer
43	der Kopfhörer (-)	headphones
43	der Künstler (-)	artist
44	der Leadsänger (-)	lead singer
44	der Liedtext (e)	lyrics
44	der Misserfolg (e)	flop, failure
45	der Musiklehrer (-)	music teacher
45	der Nachwuchsmusiker (-)	up-and-coming musician
45	der Ohrwurm (¨er)	catchy, unforgettable tune
46	der Plattenvertrag (¨e)	recording contract
46	der Preis (e)	prize
46	der Rhythmus, Rhythmen	rhythm
47	der Sieg (e)	victory
47	der Solist (en)	soloist
47	der Songschreiber (-)	songwriter
48	der Star (s)	star
48	der Straßenmusikant (en)	street musician, busker
48	der Takt, der Schlag	beat
49	der Ton (¨e)	note (sound)
49	der Tonträger (-)	recording medium
49	der Traum (¨e)	dream
50	der Virtuose (n)	virtuoso
50	der Werbevertrag (¨e)	endorsement deal
50	der Wettbewerb (e)	contest
51	der letzte Schrei	the latest thing, craze
51	der/das Download (s)	download
51	die Akustikgitarre (n)	acoustic guitar
52	die Bezahlung (en)	pay, payment
52	die Blaskapelle (n)	brass band
52	die Bühne (n)	stage
53	die Demoaufnahme (n)	demo recording
53	die Disco (s)	disco, club
53	die Eintagsfliege (n)	passing craze
54	die Eintrittskarte (n)	entry ticket
54	die Emotion (en)	emotion
54	die Fangemeinde (n)	fan base
55	die Frisur (en)	hair style
55	die Gage (n)	fee (for performance)
55	die Geige (n)	violin
56	die Hitliste, die Charts	charts
56	die Kapelle (n)	band (brass etc)
56	die Komposition (en)	composition
57	die Lieblingsband (s)	favourite band
57	die Melodie (n)	tune
57	die Modeerscheinung (en)	passing fashion
58	die Oper (n)	opera
58	die Opernaufführung (en)	opera performance
58	die Originalversion (en)	original version
59	die Partitur (en)	score
59	die Playlist (s)	playlist
59	die Raubkopie (n)	pirated copy
60	die Saite (n)	string
60	die Schallplatte (n)	vinyl record
60	die Single (s)	single
61	die Sprache (n)	language
61	die Stimme (n)	voice
61	die Subkultur (en)	subculture
62	die Tendenz (en)	trend, tendency
62	die Volksmusik, Folklore	folk music
62	die Werbekampagne (n)	promotion (campaign)
63	die neuesten Musiktrends	the latest trends in music
63	die persönlichen Musikvorlieben	personal preferences in music
63	die zeitgenössische Musik	contemporary music
64	ein Ausdruck der Zugehörigkeit	an expression of belonging
64	im Rundfunk, im Radio	on the radio
64	vergleichen mit (DAT)	compare with
65	von Jahr zu Jahr	from year to year
65	Übung macht den Meister	practice makes perfect
65	es macht mir gute Laune	it puts me in a good mood
66	teilnehmen an (DAT), sich beteiligen an	to take part in
66	alles dreht sich um …	everything hast to do with …
66	auf Platz ein in den Charts	number q in the charts
67	dazu kann man gut tanzen	you can really dance to it
67	es klingt nach / wie	it sounds like
67	in den Texten geht es um	the lyrics are about
68	sie ist Mitglied in einer Band	she's a member of a band
68	der Fan (s), der Anhänger (-)	fan
68	die Kritik (en), die Rezension (en)	critique, review
69	die Laune (n), die Stimmung(en)	mood
69	alltägliche Sehnsüchte, Träume und Ängste	everyday longings, dreams and fears
69	das Genre (s), die Gattung, die Stilrichtung	genre
70	die Mode ändert sich schnell und ohne Warnung	fashions change quickly and without warning
70	die sinkende Bereitschaft, für Musik zu bezahlen	the declining willingness to pay for music
70	der Musikfreund (e), der Musikliebhaber (-)	music-lover
`;

function parseTopic(raw, topicId) {
  const lines = raw.trim().split('\n');
  const words = [];
  let index = 1;
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split('\t');
    if (parts.length >= 3) {
      const day = parseInt(parts[0].trim(), 10);
      const german = parts[1].trim();
      const english = parts[2].trim();
      words.push({
        id: "t" + topicId + "_" + day + "_" + index,
        topicId: topicId.toString(),
        day,
        german,
        english
      });
      index++;
    }
  }
  return words;
}

const topic3 = parseTopic(topic3Raw, 3);
const topic4 = parseTopic(topic4Raw, 4);

fs.writeFileSync('src/data/topic3.ts', 'import { Word } from "./vocabulary";\n\nexport const topic3Vocab: Word[] = ' + JSON.stringify(topic3, null, 2) + ';\n');
fs.writeFileSync('src/data/topic4.ts', 'import { Word } from "./vocabulary";\n\nexport const topic4Vocab: Word[] = ' + JSON.stringify(topic4, null, 2) + ';\n');
