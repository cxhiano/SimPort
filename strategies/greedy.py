import lib

def interval(r, pos):
    return lib.dist(r[0], pos)

def complete_time(r, pos):
    return lib.dist(r[0], pos) + lib.dist(r[0], r[1])

def plan_move(start, routes, cost_fun=interval):
    row, column = start
    copy = routes[:]
    ret = []
    while len(copy) > 0:
        best = 1000000000
        best_r = None
        for r in copy:
            cost = cost_fun(r, (row, column))
            if cost < best:
                best = cost
                best_r = r
        row, column = best_r[1]
        copy.remove(best_r)
        ret.append(best_r)
    return ret
