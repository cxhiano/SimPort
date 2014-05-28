import api.client
import api.depot
import lib
import greedy, dp, merge, seperate, dp_sep
import random
import json
import time

def gen_routes(rows, columns, n):
    ret = []
    randxy = lambda: map(random.randrange, (rows, columns))
    for i in range(n):
        route = [randxy()]
        route.append(route[0][:])
        while route[1][0] == route[0][0]:
            route[1][0] = random.randrange(rows)
        ret.append(tuple(route))
    return ret

def display():
    clt = api.client.Client('localhost', 8888)
    d = []
    for r in range(2):
        tmp = []
        for c in range(2):
            tmp.append(api.depot.Depot(r, c, clt))
        d.append(tmp)

    routes = gen_routes(d[0][0].rows, 7, 10)
    data = lib.array((d[0][0].rows, d[0][0].columns), list)
    for r in routes:
        for x in range(2):
            data[r[x][0]][r[x][1]].append('x')

    for pos in [(0, 0), (1, 0), (0, 1)]:
        x, y = pos
        d[x][y].setBoxes(boxes=data)
        d[x][y].cranes['l'].hMove(column=1)
        d[x][y].cranes['l'].vMove(row=1, ret=True)

    for show in [(dp, (0, 0)),
                 (greedy, (1, 0)),
                 (merge, (0, 1))]:
        crane = d[show[1][0]][show[1][1]].cranes['l']
        start = crane.getPosition(ret=True)
        start = (start['row'], start['column'])
        plan = show[0].plan_move(start, routes)
        crane.execute_plan(plan)

def compare(rows, columns, n_routes):
    routes = gen_routes(rows, columns, n_routes)
    start = (0, 0)
    lst = []
    '''
    for alg in [dp, greedy, merge, seperate]:
        plan = alg.plan_move(start, routes)
        lst.append(lib.evaluate(start, plan))
    '''
    plan = seperate.plan_move(start, routes, greedy)
    lst.append(lib.evaluate(start, plan))
    plan = seperate.plan_move(start, routes)
    lst.append(lib.evaluate(start, plan))
    plan = dp_sep.plan_move(start, plan)
    lst.append(plan)
    print '{0} {1} {2}'.format(*lst)

if __name__ == '__main__':
    #compare(6, 10, 1)
    #routes = [([5, 0], [1, 0]), ([7, 0], [5, 0]), ([1, 0], [7, 0]), ([6, 0], [5, 0]), ([9, 0], [6, 0]), ([0, 0], [9, 0])]
    #print merge.plan_move((0, 0), routes)
    #routes = gen_routes(8, 7, 10)
    #print seperate.plan_move((0, 2), routes)
    for i in range(10):
        compare(20, 20, 50)
