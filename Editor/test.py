import pygame

# Pygame initialisieren
pygame.init()

# Fenster erstellen
screen = pygame.display.set_mode((800, 600))

# Schriftart definieren
font = pygame.font.SysFont(None, 36)

# Starttext
current_text = "Drücke M oder C"

# Text rendern Funktion
def render_text(text):
    return font.render(text, True, (255, 255, 255))  # Weißer Text

# Spiel-Schleife
running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_m:
                current_text = "Map"
            elif event.key == pygame.K_c:
                current_text = "Connect"

    # Hintergrundfarbe
    screen.fill((0, 0, 0))  # Schwarzer Hintergrund

    # Text rendern und zeichnen
    text_surface = render_text(current_text)
    screen.blit(text_surface, (0, 0))

    # Display aktualisieren
    pygame.display.flip()

# Pygame beenden
pygame.quit()
