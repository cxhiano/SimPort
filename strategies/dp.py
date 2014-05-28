import lib

def main(start, routes, n, f, trace):
    for i in range(n):
        f[i][1 << i] = lib.dist(start, routes[i][0])

    for s in range(1, 1 << n):
        for i in range(n):
            if f[i][s] != -1:
                for j in range(n):
                    new = s | (1 << j)
                    if new != s:
                        value  = f[i][s] + lib.dist(routes[i][1], routes[j][0])
                        if f[j][new] == -1 or value < f[j][new]:
                            f[j][new] = value
                            if trace != None:
                                trace[j][new] = (i, s)

def get_results(start, routes):
    n = len(routes)
    f = lib.array((n, 1 << n), lambda: -1)
    main(start, routes, n, f, None)

    return [f[i][(1 << n) - 1] for i in range(n)]

def plan_move(start, routes):
    n = len(routes)
    f = lib.array((n, 1 << n), lambda: -1)
    trace = lib.array((n, 1 << n), lambda: (0, 0))

    main(start, routes, n, f, trace)

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
    ret = []
    for r in reversed(seq):
        ret.append(routes[r])
    return ret