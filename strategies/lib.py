def dist(a, b):
    return abs(a[0] - b[0]) + 5 * abs(a[1] - b[1])

def array(dimension, value_getter):
    if (len(dimension) == 0):
        return value_getter()

    ret = []
    for i in range(dimension[0]):
        ret.append(array(dimension[1:], value_getter))
    return ret

def evaluate(start, routes):
    ans = 0
    pos = start
    for r in routes:
        ans += dist(pos, r[0])
        pos = r[1]
    return ans
