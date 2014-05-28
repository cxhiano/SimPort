import lib

_edges = {}

def _add_edge(x, y, cap, cost):
    global _edges
    _edges[(x, y)] = [cap, cost]
    _edges[(y, x)] = [0, -cost]

def _spfa(src, dst, n):
    global _edges
    lim = 100000000
    dist = [lim] * n
    dist[src] = 0
    queue = [src]
    in_queue = [False] * n
    trace = [-1] * n
    in_queue[src] = True
    while len(queue) > 0:
        u = queue[0]
        queue = queue[1:]
        for v in range(n):
            e = _edges.get((u, v))
            if e and e[0] > 0 and dist[u] + e[1] < dist[v]:
                dist[v] = dist[u] + e[1]
                trace[v] = u
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
        in_queue[u] = False

    v = dst
    while v != src:
        u = trace[v]
        _edges[(u, v)][0] -= 1
        _edges[(v, u)][0] += 1
        v = u
    return dist[dst]

def _get_circles(n):
    ret = []
    routes = range(n)
    while len(routes) > 0:
        u = routes[0]
        circle = []
        while True:
            circle.insert(0, u)
            routes.remove(u)
            for v in range(n):
                if u != v and _edges[(u, n + v)][0] == 0:
                    break
            if v in circle:
                break
            u = v
        ret.append(circle)
    return ret

def _to_route(routes, c):
    l = len(c)
    longest = -1
    cut = -1
    for i in range(l):
        dist = lib.dist(routes[c[i]][-1][1], routes[c[(i + 1) % l]][0][0])
        if dist > longest:
            cut = (i + 1) % l
            longest = dist
    for i in range(cut):
        c.append(c[0])
        c.remove(c[0])

def merge(routes):
    global _edges
    n = len(routes)
    _edges = {}
    for head in range(n):
        _add_edge(2 * n, head, 1, 0)
        _add_edge(n + head, 2 * n + 1, 1, 0)
        for tail in range(n):
            if head != tail:
                _add_edge(head, n + tail, 1,
                          lib.dist(routes[head][0][0], routes[tail][-1][1]))

    for i in range(n):
        _spfa(2 * n, 2 * n + 1, 2 * n + 2)

    ret = []
    for c in _get_circles(n):
        _to_route(routes, c)
        tmp = []
        for r in c:
            tmp.extend(routes[r])
        ret.append(tmp)

    return ret

def start_from(start, circle):
    best_start = -1
    best = 100000000
    for i in range(len(circle)):
        j = i - 1
        if j < 0:
            j += len(circle)
        cost = lib.dist(start, circle[i][0]) - lib.dist(circle[j][1], circle[i][0])
        if cost < best:
            best = cost
            best_start = i
    for i in range(best_start):
        circle.append(circle[0])
        circle.remove(circle[0])

def plan_move(start, routes):
    plan = []
    for r in routes:
        plan.append([r])
    while len(plan) > 1:
        plan = merge(plan)
    plan = plan[0]

    start_from(start, plan)

    return plan
