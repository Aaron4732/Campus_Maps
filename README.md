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
    Die Karte kann klicken und ziehen verschoben werden.
    Mit dem Mausrad kann gezoomt werden
    Oberhalb von der Karte kann mit den Buttons "E1, E2, E3" das Stockwerk geändert werden.

2. Auswahl des Startpunktes   
    1. Suchleiste  
        Den Startpunkt in die Suchleite bei Start eingeben und dann auf "Weiter" drücken  
    2. In der Karte wählen  
        Punkt auf der Karte wählen, wenn der Punkt ausgwählt ist, wird er grün und dann "Start auf Karte wählen" drücken.

3. Auswhal des Endpunktes  
    Gleich wie bei Startpunk 
    Um wieder zur Startpunkt abfrage zu kommen "Zurück zur Startpunktauswahl" drücken.

4. Zwischenstopp und Barrierefrei auswählen  
    Bei Zwischenstopp die gewüschnten haltepunkte auswählen
    Barrierefei auswählen, wenn benötigt
    Um wieder zur Startpunkt abfrage zu kommen "Zurück zur Startpunktauswahl" drücken.

5. Berechnung starten  
    "Route berechnen" auswählen

6. Letze Suchen laden  
    Unterhalb von der Karte wird der Suchverlauf aufgelistet
    Wenn ausgewählt, wird der Eintrag geladen und angezeigt


## Editor Starten (über Terminal )
1. In das richtige Verzeichniss wechseln  
    cd Editor/
1. Starten   
    python3 main.py

## Editor bedienen
Der Editor hat verschiedene Moduse die mit der Tastertur ausgewählt werden (Key steht in Klammer nebem den Modus)

1. Neu Node erstellen  
    Modus: New   
    Die Werte Way,Room,Others definieren den Typen von der Node (Diese Werte haben nur im Moduse New eine Funktion)
    Position für den Punkt auf der Karte auswählen, bei Room und Way kommt eine Namensabfrage für die Node.
    Bei Others erscheint ein Fenster mit allen Möglichkeiten

2. Nodes Verbinden  
    Modus: Connect  
    Erste Node auswählen, Node wird daraufhin rot 
    Zweite Node auswählen, die Nodes werden miteinander verbunden
    Nodes können auch über mehrere Ebenen hinweg verbunden werden

    Werden zwei Nodes erneut miteinander verbunden, dann wird die Verbindung aufgehoben

3. Nodes Löschen   
    Modus: Delet   
    Zu löschen Node auswählen 
 
4. Node verschieben  
    Modus: Move 
    Node mit drack and drob verschieben

5. Speicher  
    Modus: Save
    Achtung es gibt keine Rückmeldung

6. Ebenen wechseln   
    Mit "y" wir eine Ebene nach oben gegangen 
    Mit "q" wird eine Ebene nach unten gegangen

7. Navigation in der Karte  
    Mit Rechklick und ziehen kann die Karte verschoben werden
    Mit dem Mausrad kann gezoomt werden





