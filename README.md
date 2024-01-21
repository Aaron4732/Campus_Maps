# Campus Maps

## Benötigte Umgebungen
1. NodeJS

## Web Applikation starten
1. NodeJS Module installlieren
    npm install

2. Applikation starten
    npm start

## Web Applikation bedienen
1. Navigation auf der Karte
    Die Karte kann mit klicken und ziehen verschoben werden.
    Mit dem Mausrad kann gezoomt werden
    Oberhalb von der Karte kann mit den Buttons "E1, E2, E3" das Stockwerk geändert werden.

2. Auswahl des Startpunktes
    1. Suchleiste
        Den Startpunkt in die Suchleiste bei Start eingeben oder direkt auswählen per dropdown, und dann auf "Weiter" drücken  
    2. Über die Karte wählen
        Punkt auf der Karte wählen, wenn der Punkt ausgwählt ist, wird er grün und dann kann man "Start auf Karte wählen" drücken somit wird der Startpunkt gesetzt

3. Auswahl des Endpunktes
    Gleicher Ablauf wie beim Startpunkt
    Um wieder zur Startpunktabfrage zu kommen, einfach "Zurück zur Startpunktauswahl" drücken

4. Zwischenstopps und barrierefrei auswählen
    Bei den Zwischenstopps die gewüschnten Haltepunkte auswählen
    barrierefei auswählen, falls barrierefreier Weg benötigt (Weg mit Aufzug)
    Um wieder zur Startpunktabfrage zu kommen, einfach "Zurück zur Startpunktauswahl" drücken.

5. Berechnung starten
    "Route berechnen" auswählen

6. Letze Suchen laden  
    Unterhalb von der Karte wird der Suchverlauf aufgelistet
    Wenn eine alte Route ausgewählt wird, wird der Eintrag geladen und angezeigt

## Editor Starten (über Terminal)
1. In das richtige Verzeichnis wechseln  
    cd Editor/
1. Starten   
    python3 main.py

## Editor bedienen
Der Editor hat verschiedene Modi, die mit der Tastatur ausgewählt werden können (Hotkey steht in Klammer neben dem Modus)

1. Neu Node erstellen  
    Modus: New   
    Die Werte Way, Room, Others definieren den Typen von der Node (Diese Werte haben nur im Modus New, eine Funktion)
    Position für den Punkt auf der Karte auswählen, bei Room und Way kommt eine Namensabfrage für die Node.
    Bei Others erscheint ein Fenster mit allen Möglichkeiten

2. Nodes Verbinden  
    Modus: Connect  
    Erste Node auswählen, Node wird daraufhin rot 
    Zweite Node auswählen, die Nodes werden miteinander verbunden
    Nodes können auch über mehrere Ebenen hinweg verbunden werden

    Werden zwei Nodes erneut miteinander verbunden, dann wird die Verbindung aufgehoben

3. Nodes Löschen   
    Modus: Delete   
    Zu löschende Node auswählen 
 
4. Node verschieben  
    Modus: Move 
    Node mit Drag and Drop verschieben

5. Speichern  
    Modus: Save
    Wird gespeichert in das file circles.json (default)
    Achtung es gibt keine Rückmeldung

6. Ebenen wechseln   
    Mit "y" wechselt man eine Ebene nach oben 
    Mit "q" wechselt man eine Ebene nach unten 

7. Navigation in der Karte  
    Mit Rechtsklick und Ziehen kann die Karte verschoben werden
    Mit dem Mausrad kann gezoomt werden