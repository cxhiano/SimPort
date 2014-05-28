import lib
import dp

TH_DP = 16

def min(x, y):
    if x < 0:
        return y
    if y < 0:
        return x
    if x < y:
        return x
    return y

def _update(f, r, c, c2, column_plan):
    pos = r, column_plan[c][0][0][1]
    if c <= c2:
        if c > 0:
            col = column_plan[c - 1]
            tmp = dp.get_results(pos, col)
            n = len(col)
            for i in range(n):
                end = col[i][1][0]
                cost = tmp[i]
                if f[end][c - 1][c2] == -1 or f[r][c][c2] + cost < f[end][c - 1][c2]:
                    f[end][c - 1][c2] = f[r][c][c2] + cost

        if c2 < len(column_plan) - 1:
            col = column_plan[c2 + 1]
            tmp = dp.get_results(pos, col)
            n = len(col)
            for i in range(n):
                end = col[i][1][0]
                cost = tmp[i]
                if f[end][c2 + 1][c] == -1 or f[r][c][c2] + cost < f[end][c2 + 1][c]:
                    f[end][c2 + 1][c] = f[r][c][c2] + cost

    if c > c2:
        if c2 > 0:
            col = column_plan[c2 - 1]
            tmp = dp.get_results(pos, col)
            n = len(col)
            for i in range(n):
                end = col[i][1][0]
                cost = tmp[i]
                if f[end][c2 - 1][c] == -1 or f[r][c][c2] + cost < f[end][c2 - 1][c]:
                    f[end][c2 - 1][c] = f[r][c][c2] + cost

        if c < len(column_plan) - 1:
            col = column_plan[c + 1]
            tmp = dp.get_results(pos, col)
            n = len(col)
            for i in range(n):
                end = col[i][1][0]
                cost = tmp[i]
                if f[end][c + 1][c2] == -1 or f[r][c][c2] + cost < f[end][c + 1][c2]:
                    f[end][c + 1][c2] = f[r][c][c2] + cost

def plan_move(start, routes):
    copy = sorted(routes, key=lambda x: x[0][1])
    tmp = []
    column_plan = []
    for i in range(len(copy)):
        tmp.append(copy[i])
        if i == len(copy) - 1 or copy[i][0][1] != copy[i + 1][0][1]:
            column_plan.append(tmp)
            tmp = []

    n_col = len(column_plan)
    max_row = max(copy, key=lambda x: max(x[0][0], x[1][0]))
    max_row = max(max_row[0][0], max_row[1][0]) + 1

    f = lib.array((max_row, n_col, n_col), lambda: -1)
    for c in range(n_col):
        col = column_plan[c]
        tmp = dp.get_results(start, col)
        for i in range(len(col)):
            end = col[i][1][0]
            f[end][c][c] = min(f[end][c][c], tmp[i])

    for interval in range(n_col - 1):
        for c in range(n_col):
            for c2 in set([c - interval, c + interval]):
                if c2 < n_col and c2 >= 0:
                    for r in range(max_row):
                        if f[r][c][c2] != -1:
                            _update(f, r, c, c2, column_plan)

    best = 100000000
    for r in range(max_row):
        if f[r][0][n_col - 1] != -1 and f[r][0][n_col - 1] < best:
            best = f[r][0][n_col - 1]
        if f[r][n_col - 1][0] != -1 and f[r][n_col - 1][0] < best:
            best = f[r][n_col - 1][0]

    return best
