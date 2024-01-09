import pygame
from pygame.locals import*


class screen:
    """Grundlegende Funktionen für das Fenster"""
    
    def vollbild():
        return pygame.display.set_mode((0, 0), pygame.FULLSCREEN)

    def verkleinert(w,h):
        return pygame.display.set_mode((w, h))

class maus:
    """Gibt Kordinaten zurück solang maus gedrückt"""

    def gedrückt():
        return pygame.mouse.get_pressed()