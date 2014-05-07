def planMove(crane, routes):
    pos = crane.getPosition(ret=True)
    row, column = pos['row'], pos['column']
    while len(routes) > 0:
        shortest = 1000000000
        best_r = None
        for r in routes:
            dist = abs(r[0][0] - row) + abs(r[0][1] - column)
            if dist < shortest:
                shortest = dist
                best_r = r
        crane.move_box(best_r[0][0], best_r[0][1], best_r[1][0], best_r[1][1])
        row, column = best_r[1]
        routes.remove(best_r)
