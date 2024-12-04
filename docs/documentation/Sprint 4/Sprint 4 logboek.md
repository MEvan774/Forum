# Project 2 Sprint 4 logboek

## Maandag 18 nov 

Vandaag tijdens de sprint review kregen wij te horen dat Milan nu bij ons project mee doet. Daarom hebben wij tijdens dit contact moment even besproken of er aanpassingen gemaakt moeten worden voor bijvoorbeeld de contact momenten en de user storie taakverdeling

We hebben besproken dat we de contact momenten hetzelfde houden en de regels voor het contract ook. We hebben de aanpassing gemaakt dat Milan nu ook in het contract staat:
[Samenwerkingscontract](https://1drv.ms/w/c/cb8489981097f8a6/EYl7p8-kRpBHqRshK5jLI9gBGz26ZLAv5LMxKKXt7U4JOA?e=11fN2Y)

## Dinsdag 19 Nov

Sjoerd: Ik heb user story 2C afgemaakt. De vragen genereren nu correct. Bij het laden van de pagina wordt het id van de vraag opgehaald uit de url dmv de api functionaliteit van de HBO-ICT Cloud. Met dit id wordt de juiste vraag opgehaald uit de database en vervolgens gerendered in de view via de method in de QuestionController.

## Woensdag 20 Nov

Sjoerd: Vandaag vooral gewerkt, in de avond een klein beetje de styling aangepast van de detail pagina van de vragen.

## Donderdag 21 Nov

Feedback ontvangen bij consult ERD & EERD:
-Naamgeving moet consequent volgens conventies in camelCase.
-ERD is meer EERD, kan abstracter. (Datatypes mogen weggelaten worden)
-Relaties toevoegen in ERD. ("User maakt vraag")
-Opletten op subtypes (Nog niet echt van belang, maar voor in de toekomst)

## Maandag 25 Nov

Vandaag hebben we een user/guerilla test gehouden met Anne, de feedback van haar is als volgt:
- Klein type foutje in de homepage.
- Vragen kunnen nog niet aangemaakt worden.
- Antwoorden kunnen aangemaakt en verwijderd worden, maar niet bewerkt worden.
- Je kan geen code snippet toevoegen bij je antwoord.
- Tijd die aangegeven wordt is niet gelijk aan de pc.
- Je kan je eigen profiel niet bekijken.
- Bij registreren moet er nog toegevoegd worden dat je je wachtwoord moet herhalen.
- De styling van het vragen aanmaken is onduidelijk, je kijkt er overheen.

## Dinsdag 26/11/2024

Vandaag hebben we een user/guerilla test gehouden met Rai, de feedback van hem is als volgt:
- Je kan je vraag zonder ingelogd te zijn stellen
- Meer feedback om in te loggen voordat je je antwoord kan invullen, of de optie om je antwoord te geven weg te laten.
- Tab functionaliteit in code block zetten (code block zo dicht mogelijk laten functioneren als visual studio of andere code programs).
- Bij het bewerken van de antwoord worden de regels van de code op 1 lijn gezet.
- Onduidelijk als je een vraag post, gebruiker weet niet of het gepost is. Pagina moet naar boven scrollen naar je antwoord of de antwoorden moeten onderaan verschijnen.
- Code block van antwoorden ziet er janky uit, boven in is er meer ruimte dan onderin. Padding moet boven en onder hetzelfde zijn


## Woensdag 27 Nov

We hebben op dit moment een paar van de aanpassingen gemaakt volgens de feedback van de guerilla testen:

**Verbeterd**

- De typfouten op de homepage zijn verbeterd
- Antwoorden kunnen nu op de juiste manier zonder errors bewerkt worden.
- Code snippets kunnen toegevoegd worden bij het beantwoorden van de vraag.
- De tijd die wordt meegegeven bij een antwoord klopt en ook bij het bewerken.
- Het wachtwoord moet herhaald worden tijdens het registreren
- code wordt weergeven op de juiste lijn en aantal tabs binnen een code blok of text veld.
- tab functionaliteit werkt op dezelfde manier als visual studio.
- padding is boven gelijk aan onder in de antwoord-container.


**Moeten nog aangepast worden**

- Vragen kunnen nog niet aangemaakt worden.
- Nog niet gecheckt of juiste tijd wordt meegegeven aan vraag.
- Je kan je eigen profiel niet bekijken.
- De styling van het vragen aanmaken is onduidelijk, je kijkt er overheen.
- Je kan je vraag zonder ingelogd te zijn stellen
- Meer feedback om in te loggen voordat je je antwoord kan invullen, of de optie om je antwoord te geven weg te laten.
- Onduidelijk als je een vraag post, gebruiker weet niet of het gepost is. Pagina moet naar boven scrollen naar je antwoord of de antwoorden moeten onderaan verschijnen.


## Woensdag 4 dec

Vandaag is een nieuwe user story aangemaakt voor het geven van een rating (User Story 4D). Deze user story heeft een should have prioriteit en is toegevoegd aan het sprint board van Sprint 5.
