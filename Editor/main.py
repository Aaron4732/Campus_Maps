import pygame
import sys

def main():
    pygame.init()

    # Fenstergröße
    width, height = 800, 600
    sidebar_width = 200
    screen = pygame.display.set_mode((width, height))

    # Laden des Bildes
    background_image = pygame.image.load('maps\\05 Stammhaus E1-Bestandsplan B-1.png')
    background_rect = background_image.get_rect(center=(width // 2 + sidebar_width // 2, height // 2))

    # Skalierungsfaktor, Verschiebung und Modi
    scale = 1.0
    dragging = False
    mode = "Connect"  # Anfangsmodus
    circles = []  # Liste für Kreispositionen

    font = pygame.font.Font(None, 36)  # Schriftart für Textanzeige

    # Liste der Modi und Tasten
    modes = {
        "Connect": "C",
        "New": "N"
    }

    clock = pygame.time.Clock()

    # Hauptprogrammschleife
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 3:  # Rechte Maustaste
                    dragging = True
                    mouse_x, mouse_y = event.pos
                    offset_x, offset_y = mouse_x - background_rect.x, mouse_y - background_rect.y
                elif mode == "New" and event.button == 1:
                    # Kreis hinzufügen
                    mouse_x, mouse_y = event.pos
                    circle_pos = (mouse_x - background_rect.x, mouse_y - background_rect.y)
                    circles.append(circle_pos)
            elif event.type == pygame.MOUSEBUTTONUP:
                if event.button == 3:  # Rechte Maustaste loslassen
                    dragging = False
            elif event.type == pygame.MOUSEMOTION and dragging:
                mouse_x, mouse_y = event.pos
                background_rect.x = mouse_x - offset_x
                background_rect.y = mouse_y - offset_y
            elif event.type == pygame.MOUSEWHEEL:
                mouse_x, mouse_y = pygame.mouse.get_pos()
                zoom_change = 1.1 if event.y > 0 else 0.9
                scale *= zoom_change

                # Zoom relativ zur Mausposition
                background_rect.width = int(background_image.get_width() * scale)
                background_rect.height = int(background_image.get_height() * scale)
                background_rect.x += (mouse_x - background_rect.x) * (1 - zoom_change)
                background_rect.y += (mouse_y - background_rect.y) * (1 - zoom_change)

                # Aktualisieren der Kreispositionen
                circles = [(x * zoom_change, y * zoom_change) for x, y in circles]
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_c:
                    mode = "Connect"
                elif event.key == pygame.K_n:
                    mode = "New"

        # Bild zeichnen
        screen.fill((0, 0, 0))

        scaled_image = pygame.transform.scale(background_image, (background_rect.width, background_rect.height))
        screen.blit(scaled_image, background_rect)

        # Seitenleiste zeichnen
        pygame.draw.rect(screen, (255, 255, 255), (0, 0, sidebar_width, height))

        # Modusinformationen auf der Seitenleiste anzeigen
        y = 10
        for m, key in modes.items():
            text_color = (0, 0, 0) if m != mode else (255, 0, 0)
            mode_text = font.render(f"{m} ({key})", True, text_color)
            screen.blit(mode_text, (10, y))
            y += 40

        # Kreise zeichnen
        for x, y in circles:
            pygame.draw.circle(screen, (255, 0, 0), (background_rect.x + x, background_rect.y + y), 10)

        pygame.display.flip()

        clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()
