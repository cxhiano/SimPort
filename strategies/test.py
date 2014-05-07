import api.client
import api.depot
import lib
import greedy, dp
import random
import json

def gen_routes(rows, columns, n):
    ret = []
    randxy = lambda: map(random.randrange, (rows, columns))
    for i in range(n):
        route = [randxy(), randxy()]
        ret.append(route)
    return ret

if __name__ == '__main__':
    clt = api.client.Client('localhost', 8888)
    d = []
    for r in range(2):
        tmp = []
        for c in range(1):
            tmp.append(api.depot.Depot(r, c, clt))
        d.append(tmp)

    routes = gen_routes(d[0][0].rows, d[0][0].columns - 1, 6)
    data = lib.array((d[0][0].rows, d[0][0].columns), list)
    for r in routes:
        for x in range(2):
            data[r[x][0]][r[x][1]].append('x')
    d[0][0].setBoxes(boxes=data)
    d[1][0].setBoxes(boxes=data)

    dp.planMove(d[0][0].cranes['l'], routes)
    greedy.planMove(d[1][0].cranes['l'], routes)
