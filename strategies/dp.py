import lib

def dist(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

def planMove(lift, routes):
    pos = lift.getPosition(ret=True)
    pos = (pos['row'], pos['column'])

    n = len(routes)
    f = lib.array((n, 1 << n), lambda: -1)
    trace = lib.array((n, 1 << n), lambda: (0, 0))

    for i in range(n):
        f[i][1 << i] = dist(pos, routes[i][0])

    for s in range(1, 1 << n):
        for i in range(n):
            if f[i][s] != -1:
                for j in range(n):
                    new = s | (1 << j)
                    if new != s:
                        value  = f[i][s] + dist(routes[i][1], routes[j][0])
                        if f[j][new] == -1 or value < f[j][new]:
                            f[j][new] = value
                            trace[j][new] = (i, s)

    best = 100000000000
    best_i = 0
    s = (1 << n) - 1
    for i in range(n):
        if f[i][s] < best:
            best = f[i][(1 << n) - 1]
            best_i = i

    i = best_i
    seq = []
    for j in range(n):
        seq.append(i)
        i, s = trace[i][s]
    for r in reversed(seq):
        lift.move_box(routes[r][0][0], routes[r][0][1], routes[r][1][0], routes[r][1][1])
