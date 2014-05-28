import lib
import dp, merge

def min(x, y):
    if x < 0:
        return y
    if y < 0:
        return x
    if x < y:
        return x
    return y

def _add_col(start, col):
    for i in range(len(col)):
        end = col[-1][1][0]
        yield (end, lib.evaluate(start, col))
        col.append(col[0])
        col.remove(col[0])

def _update(f, r, c, c2, column_plan, trace):
    if c <= c2:
        if c > 0:
            for end, cost in _add_col((r, column_plan[c][0][0][1]), column_plan[c - 1]):
                if f[end][c - 1][c2] == -1 or f[r][c][c2] + cost < f[end][c - 1][c2]:
                    f[end][c - 1][c2] = f[r][c][c2] + cost
                    trace[end][c - 1][c2] = (r, c, c2)

        if c2 < len(column_plan) - 1:
            for end, cost in _add_col((r, column_plan[c][0][0][1]), column_plan[c2 + 1]):
                if f[end][c2 + 1][c] == -1 or f[r][c][c2] + cost < f[end][c2 + 1][c]:
                    f[end][c2 + 1][c] = f[r][c][c2] + cost
                    trace[end][c2 + 1][c] = (r, c, c2)

    if c > c2:
        if c2 > 0:
            for end, cost in _add_col((r, column_plan[c][0][0][1]), column_plan[c2 - 1]):
                if f[end][c2 - 1][c] == -1 or f[r][c][c2] + cost < f[end][c2 - 1][c]:
                    f[end][c2 - 1][c] = f[r][c][c2] + cost
                    trace[end][c2 - 1][c] = (r, c, c2)

        if c < len(column_plan) - 1:
            for end, cost in _add_col((r, column_plan[c][0][0][1]), column_plan[c + 1]):
                if f[end][c + 1][c2] == -1 or f[r][c][c2] + cost < f[end][c + 1][c2]:
                    f[end][c + 1][c2] = f[r][c][c2] + cost
                    trace[end][c + 1][c2] = (r, c, c2)

def plan_move(start, routes, sub_algorithm=merge):
    copy = sorted(routes, key=lambda x: x[0][1])
    tmp = []
    column_plan = []
    for i in range(len(copy)):
        tmp.append(copy[i])
        if i == len(copy) - 1 or copy[i][0][1] != copy[i + 1][0][1]:
            column_plan.append(sub_algorithm.plan_move(start, tmp))
            tmp = []

    n_col = len(column_plan)
    max_row = max(copy, key=lambda x: max(x[0][0], x[1][0]))
    max_row = max(max_row[0][0], max_row[1][0]) + 1

    f = lib.array((max_row, n_col, n_col), lambda: -1)
    trace = lib.array((max_row, n_col, n_col), lambda: (0, 0, 0))
    for c in range(n_col):
        col = column_plan[c]
        for i in range(len(col)):
            end = col[-1][1][0]
            f[end][c][c] = min(f[end][c][c], lib.evaluate(start, col))
            col.append(col[0])
            col.remove(col[0])

    for interval in range(n_col - 1):
        for c in range(n_col):
            for c2 in set([c - interval, c + interval]):
                if c2 < n_col and c2 >= 0:
                    for r in range(max_row):
                        if f[r][c][c2] != -1:
                            _update(f, r, c, c2, column_plan, trace)

    best = 100000000
    best_end = None
    for r in range(max_row):
        if f[r][0][n_col - 1] != -1 and f[r][0][n_col - 1] < best:
            best = f[r][0][n_col - 1]
            best_end = (r, 0, n_col - 1)
        if f[r][n_col - 1][0] != -1 and f[r][n_col - 1][0] < best:
            best = f[r][n_col - 1][0]
            best_end = (r, n_col - 1, 0)

    r, c, c2 = best_end
    dp_trace = []
    while True:
        dp_trace.insert(0, (r, c, c2))
        if c == c2:
            break
        r, c, c2 = trace[r][c][c2]
    plan = []
    pos = start
    val = 0
    for tr in dp_trace:
        col = column_plan[tr[1]]
        while val + lib.evaluate(pos, col) != f[tr[0]][tr[1]][tr[2]]:
            col.append(col[0])
            col.remove(col[0])
        val = f[tr[0]][tr[1]][tr[2]]
        pos = (tr[0], column_plan[tr[1]][0][0][1])
        plan.extend(col)
    return plan
