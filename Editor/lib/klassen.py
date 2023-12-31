import pygame
from pygame.locals import*
import math

def Pytagoras(a,b):
    x = math.pow(a,2) + math.pow(b,2)
    y = math.sqrt(x)
    return y

def Listen_addieren(a,b):   
    return [a[i]+b[i] for i in range(len(a))]

def Listen_subtrahieren(a,b):   
    return [a[i]-b[i] for i in range(len(a))]

def Fenster_festahlten(Kordinate_x,Kordinate_y,Objekt_Laenge,Objekt_hoehe,Fenster_Laenge,Fenster_hoehe):
    """Funktion gibt True zurück wenn sich das Objekt innerhalb des Fensters befindet"""
    return Kordinate_x >= 0 and Kordinate_y >= 0 and Kordinate_x + Objekt_Laenge <= Fenster_Laenge and Kordinate_y + Objekt_hoehe <= Fenster_hoehe

def uebertragungsfaktor(Bewegungsrichtung1_x,Bewegungsrichtung1_y,Bewegungsrichtung2_x,Bewegungsrichtung2_y):

    skalarprodukt = Bewegungsrichtung1_x * Bewegungsrichtung2_x + Bewegungsrichtung1_y * Bewegungsrichtung2_y

    betrag1 = math.pow(Bewegungsrichtung1_x,2) + math.pow(Bewegungsrichtung1_y,2)
    betrag2 = math.pow(Bewegungsrichtung2_x,2) + math.pow(Bewegungsrichtung2_y,2)

    betrag1_w = math.sqrt(betrag1)
    betrag2_w = math.sqrt(betrag2)

    betrag_s = betrag1_w * betrag2_w

    uebertragungsfaktor = skalarprodukt / betrag_s

    return uebertragungsfaktor

class Objekt:
    """Grundlegender bestand von Objekten"""

    def __init__(self, name):
        self.name = name

    
class Mensch:

    "Bestandteile eines Menschen"

    def __init__(self):
        self.kordinaten = [0,0]
        self.groeße = 180
        self.breite = 50
        self.armlänge = 80
        self.beinlänge = 100
        self.kopfdurchmesser = 40

    def position_start(self,x = 0,y = 0):
        self.kordinaten = [x,y]

    def positionsänderung(self,x = 0,y = 0):
        self.kordinaten[0] += x
        self.kordinaten[1] += y

    

class Ball:
    """Ein Ball zum Testen"""

    def __init__(self, name, kordinaten = [0,0], fenster = [100,100], durchgaenge = 60, masse = 10 ):
        self.name = name
        self.kordinaten = kordinaten
        self.durchmesser = 100
        self.farbe = [255,255,255]

        #Variabeln für nehmen
        self.differenz_Ball_Zeiger = [0,0]
        self.distanz_Ball_Zeigt = 0
        self.differenz_zeiger = 0
        self.ball_genommen = False

        #Variablen für physik
        self.bewegungsrichtung = [0,0]
        self.fenster = fenster
        self.schwerkraft = 9.81
        self.durchgang = durchgaenge
        self.Luftwiderstand = 1
        self.masse = masse
        self.Luft_Bremskraft = 0

        #Variablen für Wurfbewegung 
        self.kordinaten_letzte_runde = [0,0]
        self.kordinaten_letzte_runde_uebergeben = True

        #Variablen für Kolision
        self.kolisions_wert = [0,0]

        # 5te Feld zu addierender x-wert
            # 6te Feld zu addierender y-wert

    def plazieren(self,kordinaten):
        self.kordinaten = kordinaten

    def zeichnen(self,screen):
        pygame.draw.ellipse(screen, self.farbe, [self.kordinaten[0]-self.durchmesser/2, self.kordinaten[1]-self.durchmesser/2, self.durchmesser, self.durchmesser])

    def nehmen(self, zeiger_differenz = []):
   
        if pygame.mouse.get_pressed()[0]:

            self.differenz_Ball_Zeiger = Listen_subtrahieren(self.kordinaten,pygame.mouse.get_pos())
            self.distanz_Ball_Zeigt = Pytagoras(self.differenz_Ball_Zeiger[0],self.differenz_Ball_Zeiger[1])

            if self.distanz_Ball_Zeigt <= 50:

                self.ball_genommen = True
     
        if self.ball_genommen:
            self.kordinaten = Listen_addieren(self.kordinaten,zeiger_differenz) 
            self.bewegungsrichtung = [0,0]

        if pygame.mouse.get_pressed()[0] == False:
            self.ball_genommen = False

    def physik(self):

        #Siemuliert Schwerkraft 
        if  pygame.mouse.get_pressed()[0] == False and self.kordinaten[1] + self.durchmesser/2 < self.fenster[1]:
            self.bewegungsrichtung[1] += self.schwerkraft / 60
    
        #Simuliert wurfbewegung

        if self.ball_genommen:
            self.kordinaten_letzte_runde = [0,0]
            self.kordinaten_letzte_runde[0] += self.kordinaten[0]
            self.kordinaten_letzte_runde[1] += self.kordinaten[1]
            self.kordinaten_letzte_runde_uebergeben = False

        else:
            if self.kordinaten_letzte_runde_uebergeben:

                #self.Luft_Bremskraft

                if self.bewegungsrichtung[0] < -0.1 :
                    self.bewegungsrichtung[0] += self.Luft_Bremskraft

                if self.bewegungsrichtung[1] < -0.1 :
                    self.bewegungsrichtung[1] += self.Luft_Bremskraft

                if self.bewegungsrichtung[0] > 0.1 :
                    self.bewegungsrichtung[0] -= self.Luft_Bremskraft

                if self.bewegungsrichtung[1] > 0.1 :
                    self.bewegungsrichtung[1] -= self.Luft_Bremskraft

                if self.bewegungsrichtung[0] <= 0.1 and self.bewegungsrichtung[0] > -1:
                    self.bewegungsrichtung[0] = 0

                if self.bewegungsrichtung[1] <= 0.1 and self.bewegungsrichtung[1] > -1:
                    self.bewegungsrichtung[1] = 0    
                
            else:
                self.bewegungsrichtung[0] = self.kordinaten[0] - self.kordinaten_letzte_runde[0]
                self.bewegungsrichtung[1] = self.kordinaten[1] - self.kordinaten_letzte_runde[1]
                self.kordinaten_letzte_runde_uebergeben = True


        #Bwegungsrichtung in Koridinaten übertragen
        self.kordinaten[0] += self.bewegungsrichtung[0]
        self.kordinaten[1] += self.bewegungsrichtung[1]


    	#Dieser Teil sogt, dass der Ball im Fenster bleibt 
        if self.kordinaten[0] - self.durchmesser/2 < 0:
            self.kordinaten[0] = 0 +self.durchmesser/2
            self.bewegungsrichtung[0] = self.bewegungsrichtung[0] * (-1)

        if self.kordinaten[1] - self.durchmesser/2 < 0:
            self.kordinaten[1] = 0 +self.durchmesser/2
            self.bewegungsrichtung[1] = self.bewegungsrichtung[1] * (-1)

        if self.kordinaten[0] + self.durchmesser/2 > self.fenster[0]:
            self.kordinaten[0] = self.fenster[0] - self.durchmesser/2
            self.bewegungsrichtung[0] = self.bewegungsrichtung[0] * (-1)

        if self.kordinaten[1] + self.durchmesser/2 > self.fenster[1]:
            self.kordinaten[1] = self.fenster[1] - self.durchmesser/2
            self.bewegungsrichtung[1] = self.bewegungsrichtung[1] * (-1)

    def kolision(self,kordinatenliste):
        """Erkennt ob eine Kolision statgefunden hat und übergibt die Werte der Bewegungsrichtung"""
           
            #Achtung! 
            #In der Liste ist das:
            # 0te Feld die X-Achse, 
            # 1te Feld die Y-Achse,
            # 2te Feld die Bewgung der X-Achse
            # 3te Feld die Bewegung der Y-Achse
            # 4te Feld Anzahl bis Tot
            # 5te Feld zu addierender x-wert
            # 6te Feld zu addierender y-wert

        #Kolisionsdetektor             

        #Andere Bälle

        for y in kordinatenliste: 

            for x in kordinatenliste[y][0]:
                #Berechnen der differenz Variabel zwischen zwei Bällen 
                differenz_Ball_x = self.kordinaten[0]-x[0]
                differenz_Ball_y = self.kordinaten[1]-x[1]


                if self.name != y:
                    
                    #Brechnen des Abstandes zu dem andren Bällen
                    abstand_andererBall = Pytagoras(differenz_Ball_x,differenz_Ball_y)

                    if abstand_andererBall <= self.durchmesser:
                        #Richtungsänderung bestimmen
                        uebertragungsfaktor_x = uebertragungsfaktor(differenz_Ball_x,differenz_Ball_y,x[2],x[3])

                        if uebertragungsfaktor_x > 0:
                            # Energie Übergeben 
                            self.kolisions_wert[0] += uebertragungsfaktor_x * x[2] 
                            self.kolisions_wert[1] += uebertragungsfaktor_x * x[3]
                            x[2] -= uebertragungsfaktor_x * x[2]
                            x[3] -= uebertragungsfaktor_x * x[3]

        #Neue vectorrichtung eintragen
        '''
        for i in kordinatenliste:
            if (i[2] < 0 and i[5] > 0) or (i[2] > 0 and i[5] < 0):
                i[2] *= -1
                i[2] += i[5]
            else:
                i[2] += i[5]

            if (i[3] < 0 and i[6] > 0) or (i[3] > 0 and i[6] < 0):
                i[3] *= -1
                i[3] += i[6]
            else:
                i[3] += i[6]

            i[5] = 0
            i[6] = 0'''

    def kordinaten_schreiben(self):
        return self.kordinaten,self.bewegungsrichtung