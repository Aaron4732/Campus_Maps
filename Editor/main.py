import pygame
import sys
from pathlib import Path
from PIL import Image

from lib.circle import c_circle as circle_class

#Save Circles list as jason
import json
def save_circles(scale_factor_widht = 1, scale_factor_height = 1):
    #Schreiben der Kreise in ein Dictionary
    circles_dict = {}
    for key, circle in circle_class.circles.items():
        circles_dict[circle.id] = {
            "x": circle.x * scale_factor_widht,
            "y": circle.y * scale_factor_height,
            "node_type": circle.node_type,
            "floor": circle.floor,
            "connections": circle.connections,
            "name": circle.name,
            "id": circle.id
        }

    with open("circles.json", "w") as f:
        json.dump(circles_dict, f)


def main():

    circle_class.load_file("circles.json")

    pygame.init()

    # Fenstergröße
    width, height = 1920, 1080
    sidebar_width = 200
    screen = pygame.display.set_mode((width, height))

    # Liste der Hintergrundbilder
    background_images = [
        (Path('maps/E1_B.png'), "E1"), 
        (Path('maps/E2_B.png'), "E2"),
        (Path('maps/E3_B.png'), "E3")]  # Pfad zu Ihren Bildern
    current_image_index = 0
    background_image = pygame.image.load(background_images[current_image_index][0])
    background_rect = background_image.get_rect(center=(width // 2, height // 2))

    background_org_height = background_image.get_height()
    background_org_width = background_image.get_width()

    scale_factor_widht = background_org_width / background_rect.width
    scale_factor_height = background_org_height / background_rect.height

    # Skalierungsfaktor, Verschiebung und Modi
    scale = 1.0
    dragging = False
    mode = "New"  # Anfangsmodus
    node_type = "Way"
    #circles = []  # Liste für Kreispositionen
    circles = circle_class.circles
    connections = []  # Liste für Verbindungen zwischen Kreisen
    selected_circle = None  # Aktuell ausgewählter Kreis
    moving_circle = None  # Zu bewegender Kreis

    menu_active = False
    menu_options = ['Rot', 'Grün', 'Blau']
    selected_option = None

    font = pygame.font.Font(None, 36)  # Schriftart für Textanzeige

    # Zustand und Inhalt der Texteingabe
    is_text_input_active = False
    text_input_content = ""
    input_box_width = 300
    input_box_height = 50
    input_box_x = width // 2 - input_box_width // 2
    input_box_y = height // 2 - input_box_height // 2

    # Liste der Modi und Tasten
    modes = {
        "Connect": "C",
        "New": "N",
        "Edit": "E",
        "Delet": "D",
        "Move": "M",
        "Save": "S",
    }

    node_types = {
        "Way": "W",
        "Room": "R",
        "Others": "T",
    }

    clock = pygame.time.Clock()

    # Hauptprogrammschleife
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            elif menu_active:
                if event.type == pygame.MOUSEBUTTONDOWN:
                # Logik zur Auswahl von Menüoptionen
                    for i, option in enumerate(circle_class.get_node_types()):
                        option_rect = pygame.Rect(menu_pos[0], menu_pos[1] + i * 30, 100, 30)
                        if option_rect.collidepoint(mouse_x, mouse_y):
                            selected_option = option

                            mouse_x, mouse_y = event.pos
                            circle_pos = (mouse_x - background_rect.x, mouse_y - background_rect.y)

                            circle_class.new_circle(circle_pos[0], circle_pos[1], selected_option, background_images[current_image_index][1], circle_pos)

                            menu_active = False
                            # Hier können Sie die Logik hinzufügen, um den Kreis mit der ausgewählten Option zu erstellen
                            break

            elif is_text_input_active:
                # Behandle nur Tastatureingaben für Text, ignoriere andere Aktionen
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_RETURN:
                        # Enter wurde gedrückt, Texteingabe abschließen
                        is_text_input_active = False
                        circle_class.new_circle(circle_pos[0], circle_pos[1], node_type, background_images[current_image_index][1], circle_pos, text_input_content)
                        text_input_content = ""  # Texteingabe zurücksetzen
                    elif event.key == pygame.K_BACKSPACE:
                        # Letztes Zeichen löschen
                        text_input_content = text_input_content[:-1]
                    else:
                        # Zeichen zum Text hinzufügen
                        text_input_content += event.unicode

            else:
                if event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 3:  # Rechte Maustaste
                        dragging = True
                        mouse_x, mouse_y = event.pos
                        offset_x, offset_y = mouse_x - background_rect.x, mouse_y - background_rect.y

                    elif mode == "Move" and event.button == 1:
                        # Überprüfen, ob ein Kreis angeklickt wurde und für Bewegung markieren
                        mouse_x, mouse_y = event.pos
                        moving_circle = circle_class.get_circle_at_pos((mouse_x - background_rect.x, mouse_y - background_rect.y))
                    elif mode == "Delet" and event.button == 1:
                        # Überprüfen, ob ein Kreis angeklickt wurde und löschen
                        mouse_x, mouse_y = event.pos
                        clicked_circle = circle_class.get_circle_at_pos((mouse_x - background_rect.x, mouse_y - background_rect.y))
                        if clicked_circle is not None:
                            # Entfernen des Kreises
                            clicked_circle.delet()

                    elif mode == "Connect" and event.button == 1:
                        # Überprüfen, ob ein Kreis angeklickt wurde
                        mouse_x, mouse_y = event.pos
                        clicked_circle = circle_class.get_circle_at_pos((mouse_x - background_rect.x, mouse_y - background_rect.y))
                        if clicked_circle is not None:
                            if selected_circle is None:
                                selected_circle = clicked_circle
                            else:
                                if clicked_circle.id in selected_circle.connections:
                                    selected_circle.disconnect(clicked_circle)

                                else:
                                    selected_circle.connect(clicked_circle)

                                selected_circle = None
                        else:
                            selected_circle = None

                    elif mode == "New" and event.button == 1:
                        if node_type == "Others":
                            menu_active = True
                            menu_pos = event.pos
                            mouse_x, mouse_y = event.pos
                        # Kreis hinzufügen
                        else:
                            mouse_x, mouse_y = event.pos
                            circle_pos = (mouse_x - background_rect.x, mouse_y - background_rect.y)
                            is_text_input_active = True

                elif event.type == pygame.MOUSEBUTTONUP:
                    if event.button == 3:  # Rechte Maustaste loslassen
                        dragging = False

                    if event.button == 1:  # Linke Maustaste loslassen
                        moving_circle = None
                elif event.type == pygame.MOUSEMOTION:
                    if dragging:
                        mouse_x, mouse_y = event.pos
                        background_rect.x = mouse_x - offset_x
                        background_rect.y = mouse_y - offset_y
                    elif moving_circle is not None:
                        # Bewegen des ausgewählten Kreises
                        mouse_x, mouse_y = event.pos
                        moving_circle.move(mouse_x - background_rect.x, mouse_y - background_rect.y)



                elif event.type == pygame.MOUSEWHEEL:
                    # Zoomen mit dem Mausrad
                    mouse_x, mouse_y = pygame.mouse.get_pos()
                    zoom_change = 1.1 if event.y > 0 else 0.9
                    scale *= zoom_change

                    # Zoom relativ zur Mausposition
                    background_rect.width = int(background_image.get_width() * scale)
                    background_rect.height = int(background_image.get_height() * scale)
                    background_rect.x += (mouse_x - background_rect.x) * (1 - zoom_change)
                    background_rect.y += (mouse_y - background_rect.y) * (1 - zoom_change)

                    # Aktualisieren der Kreispositionen
                    #circles = [(x * zoom_change, y * zoom_change) for x, y in circles]

                    for key, circle in circles.items():
                        circle.x *= zoom_change
                        circle.y *= zoom_change


                    
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_c:
                        mode = "Connect"
                    elif event.key == pygame.K_n:
                        mode = "New"
                    elif event.key == pygame.K_d:
                        mode = "Delet"
                    elif event.key == pygame.K_m:
                        mode = "Move"
                    elif event.key == pygame.K_s:
                        save_circles(scale_factor_widht, scale_factor_height)

                    elif event.key == pygame.K_w:
                        node_type = "Way"
                    elif event.key == pygame.K_r:
                        node_type = "Room"
                    elif event.key == pygame.K_t:
                        node_type = "Others"

                    elif event.key == pygame.K_q:
                        current_image_index = (current_image_index - 1) % len(background_images)
                        background_image = pygame.image.load(background_images[current_image_index][0])
                        background_org_height = background_image.get_height()
                        background_org_width = background_image.get_width()
                    elif event.key is pygame.K_y:
                        current_image_index = (current_image_index + 1) % len(background_images)
                        background_image = pygame.image.load(background_images[current_image_index][0])
                        background_org_height = background_image.get_height()
                        background_org_width = background_image.get_width()


        # Mausposition relativ zum Bild
        mouse_x, mouse_y = pygame.mouse.get_pos()

        relative_mouse_pos_x_zero = mouse_x - background_rect.x
        relative_mouse_pos_y_zero = mouse_y - background_rect.y

        scale_factor_widht = background_org_width / background_rect.width
        scale_factor_height = background_org_height / background_rect.height

        relative_mouse_pos_x = relative_mouse_pos_x_zero * scale_factor_widht
        relative_mouse_pos_y = relative_mouse_pos_y_zero * scale_factor_height

        relative_mouse_pos = (relative_mouse_pos_x, relative_mouse_pos_y)

        # Bild zeichnenc
        screen.fill((0, 0, 0))

        scaled_image = pygame.transform.scale(background_image, (background_rect.width, background_rect.height))
        screen.blit(scaled_image, background_rect)

        #Kreis zeichnen
        for key, circle in circles.items():
            if circle.floor == background_images[current_image_index][1]:
                color = (0, 0, 255) if circle != selected_circle else (255, 0, 0)
                pygame.draw.circle(screen, color, (background_rect.x + circle.x, background_rect.y + circle.y), 10)

        # Verbindungen zeichnen
        for key, circle in circles.items():
            for opposit_circle_id in circle.connections:
                opposit_circle = circle_class.get_circle_whit_id(opposit_circle_id)
                if circle.floor == background_images[current_image_index][1] or opposit_circle.floor == background_images[current_image_index][1]:
                    
                    start_pos = (background_rect.x + circle.x, background_rect.y + circle.y)
                    end_pos = (background_rect.x + opposit_circle.x, background_rect.y + opposit_circle.y)
                    pygame.draw.line(screen, (0, 255, 0), start_pos, end_pos, 2)

        #Text zu Kreisen zeichnen
        for key, circle in circles.items():
            if circle.floor == background_images[current_image_index][1]:
                text = font.render(circle.node_type, True, (0, 0, 0))
                screen.blit(text, (background_rect.x + circle.x, background_rect.y + circle.y))
                text = font.render(circle.name, True, (0, 0, 0))
                screen.blit(text, (background_rect.x + circle.x, background_rect.y + circle.y - 30))



    #Linke Anzeige
        # Seitenleiste zeichnen
        pygame.draw.rect(screen, (255, 255, 255), (0, 0, sidebar_width, height))

        # Modusinformationen auf der Seitenleiste anzeigen
        y = 10
        for m, key in modes.items():
            text_color = (0, 0, 0) if m != mode else (255, 0, 0)
            mode_text = font.render(f"{m} ({key})", True, text_color)
            screen.blit(mode_text, (10, y))
            y += 40

        for m, key in node_types.items():
            text_color = (0, 0, 0) if m != node_type else (255, 0, 0)
            mode_text = font.render(f"{m} ({key})", True, text_color)
            screen.blit(mode_text, (10, y))
            y += 40

        # Koordinatenanzeige
        coords_text = font.render(f"{relative_mouse_pos}", True, (0,0,0))
        screen.blit(coords_text, (10, height - 40))

    #Rechte Anzeige
        # Seitenleiste rechts zeichnen
        pygame.draw.rect(screen, (255, 255, 255), (width - sidebar_width, 0, sidebar_width, height))

        # Liste der Bilder anzeigen
        y = 10
        for i, (_, display_name) in enumerate(background_images):
            text_color = (255, 0, 0) if i == current_image_index else (0, 0, 0)
            image_text = font.render(display_name, True, text_color)
            screen.blit(image_text, (width + 10 - sidebar_width, y))
            y += 30

        # Menü zeichnen
        if menu_active:
            for i, option in enumerate(circle_class.get_node_types()):
                option_rect = pygame.Rect(menu_pos[0], menu_pos[1] + i * 30, 100, 30)
                pygame.draw.rect(screen, (200, 200, 200), option_rect)
                text_color = (255, 0, 0) if option_rect.collidepoint(mouse_x, mouse_y) else (0, 0, 0)
                option_text = font.render(option, True, text_color)
                screen.blit(option_text, (menu_pos[0] + 10, menu_pos[1] + i * 30))

        if is_text_input_active:
        # Zeichne den grauen Hintergrund für das Eingabefeld
            pygame.draw.rect(screen, (200, 200, 200), (input_box_x, input_box_y, input_box_width, input_box_height))

            # Render Text
            text_surface = font.render(text_input_content, True, (0, 0, 0))
            screen.blit(text_surface, (input_box_x + 10, input_box_y + (input_box_height - text_surface.get_height()) // 2))





        pygame.display.flip()

        clock.tick(60)

    pygame.quit()

if __name__ == "__main__":
    main()